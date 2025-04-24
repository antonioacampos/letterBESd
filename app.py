from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from psycopg2.errors import UniqueViolation
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
CORS(app)

load_dotenv()

dbname = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")

conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host,
    port=port
)
cursor = conn.cursor()

def insert_user(cursor, conn, username):
    try:
        cursor.execute("INSERT INTO users (username) VALUES (%s) RETURNING id;", (username,))
        return cursor.fetchone()[0]
    except UniqueViolation:
        conn.rollback()
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        return cursor.fetchone()[0]

def insert_movie(cursor, conn, title):
    try:
        cursor.execute("INSERT INTO movies (title) VALUES (%s) RETURNING id;", (title,))
        return cursor.fetchone()[0]
    except UniqueViolation:
        conn.rollback()
        cursor.execute("SELECT id FROM movies WHERE title = %s", (title,))
        return cursor.fetchone()[0]

def insert_rating(cursor, user_id, movie_id, rating):
    try:
        cursor.execute("INSERT INTO ratings (user_id, movie_id, rating) VALUES (%s, %s, %s);",
                       (user_id, movie_id, rating))
    except Exception:
        conn.rollback()

def scrap(cursor, conn, username):
    base_url = f"https://letterboxd.com/{username}/films/by/date/page/"
    headers = {"User-Agent": "Mozilla/5.0"}
    watched_movies = []
    page = 1

    while True:
        url = f"{base_url}{page}/"
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            break

        soup = BeautifulSoup(response.text, "html.parser")
        movies = soup.find_all("li", class_="poster-container")

        if not movies:
            break

        for movie in movies:
            title = movie.find("img")["alt"]
            rating_element = movie.find("span", class_="rating")
            if rating_element:
                rating_text = rating_element.text.strip()
                rating = rating_text.count("★") * 1.0
                rating += rating_text.count("½") / 2
            else:
                rating = None
            watched_movies.append((title, rating))

        page += 1

    user_id = insert_user(cursor, conn, username)

    for title, rating in watched_movies:
        movie_id = insert_movie(cursor, conn, title)
        if isinstance(rating, (float, int)):
            insert_rating(cursor, user_id, movie_id, rating)

    conn.commit()

def carregar_dados():
    query = """
    SELECT u.username, m.title, r.rating
    FROM users u
    JOIN ratings r ON u.id = r.user_id
    JOIN movies m ON m.id = r.movie_id
    """
    df = pd.read_sql(query, conn)
    rating_matrix = df.pivot_table(index='username', columns='title', values='rating', fill_value=0)
    return rating_matrix

def gerar_recomendacoes(usuario_alvo, n_recomendacoes=12):
    rating_matrix = carregar_dados()

    kmeans = KMeans(n_clusters=4, random_state=42)
    rating_matrix['cluster'] = kmeans.fit_predict(rating_matrix)

    if usuario_alvo not in rating_matrix.index:
        return {}

    cluster_usuario = rating_matrix.loc[usuario_alvo, 'cluster']
    usuarios_cluster = rating_matrix[rating_matrix['cluster'] == cluster_usuario]

    notas_cluster = usuarios_cluster.drop(columns=['cluster'])
    medias_por_filme = notas_cluster.mean()
    notas_usuario = notas_cluster.loc[usuario_alvo]
    filmes_nao_vistos = notas_usuario[notas_usuario == 0].index

    recomendacoes = medias_por_filme[filmes_nao_vistos].sort_values(ascending=False)
    return recomendacoes.head(n_recomendacoes).to_dict()

@app.route('/api/recomendacoes/<usuario_alvo>', methods=['GET'])
def obter_recomendacoes(usuario_alvo):
    scrap(cursor, conn, usuario_alvo)
    recomendacoes = gerar_recomendacoes(usuario_alvo)
    return jsonify(recomendacoes)

if __name__ == "__main__":
    app.run(debug=True)
