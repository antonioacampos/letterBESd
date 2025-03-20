import requests
from bs4 import BeautifulSoup

username = "gutomp4" 
base_url = f"https://letterboxd.com/{username}/films/by/date/page/"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

watched_movies = []
page = 1 

while True:
    url = f"{base_url}{page}/" 
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Erro ao acessar a página do usuário.")
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
            rating += rating_text.count("½") /2
        else:
            rating = "Sem avaliação"

        watched_movies.append((title, rating))

    print(f"Página {page} capturada com {len(movies)} filmes.")
    page += 1  

print("\nTodos os filmes assistidos:")
for title, rating in watched_movies:
    print(f"Filme: {title} | Rating: {rating}")

print(f"\nTotal de filmes capturados: {len(watched_movies)}")
