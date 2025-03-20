import numpy as np
import pandas as pd

watched_movies = [
    ("Oppenheimer", 5.0),
    ("Barbie", 4.0),
    ("Duna", 4.5),
    ("Interestelar", 5.0),
    ("Tenet", 3.5),
    ("Clube da Luta", 5.0)
]

# Criando um dicionário para converter filmes em IDs numéricos
movie_to_id = {title: i for i, (title, _) in enumerate(watched_movies)}

# Convertendo os filmes e ratings para NumPy
X_movies = np.array([movie_to_id[title] for title, _ in watched_movies])  # IDs dos filmes
y_ratings = np.array([rating / 5.0 for _, rating in watched_movies])  # Normalizando os ratings (0 a 1)

# Convertendo para DataFrame Pandas (opcional, mas útil para manipulação)
df = pd.DataFrame({"movie_id": X_movies, "rating": y_ratings})

print(df.head())  # Mostrando os primeiros dados
