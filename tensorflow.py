import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Criando um modelo simples para prever ratings
model = keras.Sequential([
    layers.Embedding(input_dim=len(movie_to_id), output_dim=10),  # Representação vetorial dos filmes
    layers.Flatten(),
    layers.Dense(32, activation="relu"),
    layers.Dense(1, activation="sigmoid")  # Normalizado entre 0 e 1
])

# Compilando o modelo
model.compile(optimizer="adam", loss="mse", metrics=["mae"])

# Treinando o modelo (dados pequenos apenas para demonstração)
model.fit(X_movies, y_ratings, epochs=10, batch_size=2)

# Fazendo previsões
predictions = model.predict(X_movies) * 5.0  # Convertendo de volta para a escala de 0 a 5
for title, pred in zip(movie_to_id.keys(), predictions):
    print(f"Filme: {title} | Previsão de rating: {pred[0]:.2f}")
