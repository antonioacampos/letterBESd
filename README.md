Projeto de Recomendações de Filmes Letterboxd
Este projeto consiste em um sistema completo de recomendação de filmes, com um backend para processamento de dados e um frontend para interação com o usuário.

Parte 1: Backend (Servidor e Lógica)
Esta seção cobre a configuração do servidor que coleta dados, os armazena e fornece a API de recomendações.

1. Pré-requisitos do Backend
Docker: Necessário para rodar o banco de dados PostgreSQL.

Python 3.x: Para o servidor Flask e o scraper.

2. Configuração do Banco de Dados (PostgreSQL com Docker)
Iniciar o Container PostgreSQL
Execute o seguinte comando no seu terminal:

docker run --name some-postgres -e POSTGRES_PASSWORD=db_psswd -p 5432:5432 -d postgres

Criar o Banco de Dados e as Tabelas
Conecte-se ao container:

docker exec -it some-postgres psql -U postgres

(Use a senha db_psswd quando solicitado)

Execute os seguintes comandos SQL, um de cada vez:

CREATE DATABASE db_name;
\c db_name
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating FLOAT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    UNIQUE (user_id, movie_id)
);
\q

3. Configuração do Ambiente Python
Navegue até a pasta do backend (ex: cd C:\Users\zFefeu\Desktop\letterBESd\backend).

Crie e ative um ambiente virtual:

Windows: python -m venv venv e venv\Scripts\activate

macOS/Linux: python3 -m venv venv e source venv/bin/activate

Instale as dependências a partir do seu arquivo requirements.txt:

pip install -r requirements.txt

4. Execução do Backend
Passo 1: Rodar o Scraper (scrap.py)
Em um terminal com o ambiente virtual ativado, popule o banco de dados:

python scrap.py

Passo 2: Rodar o Servidor Flask (app.py)
Em um segundo terminal, inicie a API:

python app.py

O backend estará rodando em http://127.0.0.1:5000.

Parte 2: Frontend (Interface do Usuário)
Siga estes passos para configurar a interface que o usuário verá no navegador.

1. Pré-requisitos do Frontend
Node.js e npm: Necessários para gerenciar pacotes e rodar a aplicação JavaScript.

2. Configuração e Execução
Abra um novo terminal e navegue até a pasta do frontend:

cd frontend

Instalar Dependências: Este comando lê o arquivo package.json e baixa todas as bibliotecas necessárias para a interface.

npm install

Iniciar o Servidor de Desenvolvimento: Este comando compila a aplicação e a torna acessível no seu navegador.

npm run dev

A aplicação frontend geralmente estará disponível em http://localhost:3000 ou um endereço similar. Verifique a saída no seu terminal para obter o link exato.

Agora, com o backend e o frontend rodando, você pode abrir o endereço do frontend no seu navegador para usar a aplicação de recomendação de filmes.
