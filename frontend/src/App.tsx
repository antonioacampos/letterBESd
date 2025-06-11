import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Film, Heart, AlertCircle } from 'lucide-react';

interface Recomendacao {
  filme: string;
  score: number;
}

interface RecomendacaoComPoster extends Recomendacao {
  poster_path?: string | null;
}

interface Metadata {
  total_usuarios: number;
  total_filmes: number;
  filmes_nao_vistos: number;
  total_recomendacoes: number;
}

interface ApiResponse {
  status: 'success' | 'error' | 'insufficient_data' | 'user_not_found';
  message: string;
  recomendacoes: { [key: string]: number };
  metadata: Metadata;
  error?: string;
}

interface FilmeDetalhes {
  poster_path?: string | null;
}

function App() {
  const [letterboxdUsername, setLetterboxdUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoComPoster[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const tmdbApiKey = 'b3661e4adf34873a50fd784e23823462'; 
  const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w200';

  const gerarLinkLetterboxd = (filme: string): string => {
    const slug = filme
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    return `https://letterboxd.com/film/${slug}/`;
  };

  const buscarDetalhesFilme = async (filme: string): Promise<FilmeDetalhes | null> => {
    try {
      const searchResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(filme)}`
      );
      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        return { poster_path: searchResponse.data.results[0].poster_path };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme no TMDb:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecomendacoes([]);
    setMetadata(null);
    setShowResults(false);

    try {
      const response = await axios.get<ApiResponse>(`http://localhost:5000/api/recomendacoes/${letterboxdUsername}`);
      const data = response.data;

      if (data.status === 'success') {
        const recomendacoesArray = Object.entries(data.recomendacoes).map(([filme, score]) => ({
          filme,
          score
        }));

        if (recomendacoesArray.length > 0) {
          const recomendacoesComPoster = await Promise.all(
            recomendacoesArray.map(async (rec) => {
              const detalhes = await buscarDetalhesFilme(rec.filme);
              return { ...rec, poster_path: detalhes?.poster_path };
            })
          );
          setRecomendacoes(recomendacoesComPoster);
          setMetadata(data.metadata);
          setShowResults(true);
        } else {
          setError('Nenhuma recomendação encontrada para este usuário');
        }
      } else {
        setError(data.message || 'Erro ao buscar recomendações');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
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
            {recomendacoes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recomendacoes.map((rec, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition duration-200">
                    <a href={gerarLinkLetterboxd(rec.filme)} target="_blank" rel="noopener noreferrer" className="block">
                      {rec.poster_path ? (
                        <img
                          src={`${tmdbImageBaseUrl}${rec.poster_path}`}
                          alt={`Poster de ${rec.filme}`}
                          className="w-full h-auto object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-center text-gray-400 text-xs rounded-t-lg p-2">
                          Poster não disponível
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-sm truncate">{rec.filme}</h3>
                        <p className="text-xs text-blue-200">
                          Score: {rec.score.toFixed(2)}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-blue-200">Nenhuma recomendação disponível</p>
            )}
          </section>

          <button
            onClick={() => {
              setShowResults(false);
              setRecomendacoes([]);
              setMetadata(null);
            }}
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

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;