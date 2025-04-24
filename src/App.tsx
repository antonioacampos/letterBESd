import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Film, Heart } from 'lucide-react';

interface Recomendacao {
  titulo: string;
  nota_media: number;
}

function App() {
  const [letterboxdUsername, setLetterboxdUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios.get(`http://localhost:5000/api/recomendacoes/${letterboxdUsername}`)
      .then((res) => {
        const data = res.data;
        const recomendacoesFormatadas = Object.keys(data).map((titulo) => ({
          titulo,
          nota_media: data[titulo]
        }));
        setRecomendacoes(recomendacoesFormatadas);
        setShowResults(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao obter recomendações");
      })
      .finally(() => setIsLoading(false));
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white pb-12">
        <div className="container mx-auto px-4">
          <header className="py-8 text-center">
            <Film className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Recomendações para {letterboxdUsername}</h1>
          </header>

          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Filmes recomendados para você</h2>
            <ul className="space-y-4">
              {recomendacoes.map((rec, idx) => (
                <li key={idx} className="p-3 bg-white/5 rounded-lg">
                  <span className="font-medium">{rec.titulo}</span>
                  <span className="ml-2 text-sm text-blue-200">
                    (Nota média: {rec.nota_media.toFixed(2)})
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <button
            onClick={() => setShowResults(false)}
            className="mx-auto mt-12 flex items-center gap-2 bg-white/10 hover:bg-white/20 transition duration-200 px-6 py-3 rounded-lg"
          >
            <Heart className="w-4 h-4" />
            Fazer nova busca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Film className="w-12 h-12 text-blue-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">LetterBESd</h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={letterboxdUsername}
                onChange={(e) => setLetterboxdUsername(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-white/5 border border-blue-400/30 rounded-lg"
                placeholder="Nome de usuário do Letterboxd"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg flex justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Carregando...
                  </>
                ) : (
                  'Obter Recomendações'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
