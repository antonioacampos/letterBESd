# 🎬 Projeto de Recomendações de Filmes - LetterBESd

Sistema completo de recomendação de filmes, com **backend** para processamento de dados e **frontend** para interação com o usuário.

---

## 📦 Parte 1: Backend (Servidor e Lógica)

Esta seção cobre a configuração do servidor que coleta dados, os armazena e fornece a API de recomendações.

### ✅ 1. Pré-requisitos

- **Docker**: Necessário para rodar o banco de dados PostgreSQL.
- **Python 3.x**: Para o servidor Flask e o scraper.

---

### 🐘 2. Configuração do Banco de Dados (PostgreSQL via Docker)

**Iniciar o container PostgreSQL:**

```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=db_psswd -p 5432:5432 -d postgres
```

**Conectar-se ao container:**

```bash
docker exec -it some-postgres psql -U postgres
```

(Use a senha `db_psswd` quando solicitado)

**Criar banco e tabelas:**

```sql
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
```

---

### 🐍 3. Configuração do Ambiente Python

Navegue até a pasta do backend:

```bash
cd path/to/backend
```

**Criar e ativar ambiente virtual:**

- **Windows:**
  ```bash
  python -m venv venv
  venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

**Instalar dependências:**

```bash
pip install -r requirements.txt
```

---

### 🚀 4. Execução do Backend

**Passo 1: Rodar o scraper para popular o banco de dados:**

```bash
python scrap.py
```

**Passo 2: Iniciar o servidor Flask:**

```bash
python app.py
```

> O backend estará rodando em: `http://127.0.0.1:5000`

---

## 🖥️ Parte 2: Frontend (Interface do Usuário)

### ✅ 1. Pré-requisitos

- **Node.js e npm**: Necessários para rodar o frontend em JavaScript.

---

### ⚙️ 2. Configuração e Execução

**Navegar até a pasta do frontend:**

```bash
cd frontend
```

**Instalar dependências:**

```bash
npm install
```

**Iniciar o servidor de desenvolvimento:**

```bash
npm run dev
```

> O frontend estará disponível em: `http://localhost:3000` (ou similar, conforme indicado no terminal)

---

### ✅ Pronto!

Com o **backend** e o **frontend** rodando, abra o navegador e acesse o endereço do frontend para começar a usar o sistema de recomendação de filmes!
