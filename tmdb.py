import requests

# Substitua pela sua chave da API do TMDb
api_key = "c5c3c61117205a9006a8b282c1efcf1a"
base_url = "https://api.themoviedb.org/3"

# Função para pegar filmes a partir da API do TMDb
def get_movies_from_tmdb(page=1):
    # URL de requisição para filmes mais populares
    url = f"{base_url}/discover/movie?api_key={api_key}&page={page}&sort_by=popularity.desc"
    
    # Fazendo a requisição à API
    response = requests.get(url)
     
    if response.status_code != 200:
        print(f"Erro ao acessar a API do TMDb: {response.status_code}")
        return None

    # Convertendo a resposta para JSON
    data = response.json()

    # Verificando se a resposta tem filmes
    if not data['results']:
        return None

    # Lista para armazenar filmes com título e avaliação
    movies = []
    
    # Extraindo os dados de cada filme
    for movie in data['results']:
        print(movie)
        title = movie.get("title")
        rating = movie.get("vote_average", "Sem avaliação")  # Pegando a nota média de votos
        movies.append((title, rating))

    return movies

# Função principal para obter e exibir filmes
def main():
    page = 1
    all_movies = []

    while True:
        # Pegando filmes da página atual
        movies = get_movies_from_tmdb(page)
        
        # Se não houver filmes ou todos os filmes foram obtidos, para o loop
        if not movies:
            break

        # Adicionando os filmes obtidos à lista total
        all_movies.extend(movies)

        print(f"Página {page} capturada com {len(movies)} filmes.")
        page += 1  # Próxima página

    # Exibindo todos os filmes
    print("\nTodos os filmes capturados:")
    for title, rating in all_movies:
        print(f"Filme: {title} | Avaliação: {rating}")

    print(f"\nTotal de filmes capturados: {len(all_movies)}")

# Rodando a função principal
if _name_ == "_main_":
    main()