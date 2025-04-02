import React, { useState } from 'react';
import { Film, Search, Loader2, Moon, Users, Coffee, Popcorn, Brain, Heart } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  director: string;
}

interface MovieCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  movies: Movie[];
}

function App() {
  const [letterboxdUsername, setLetterboxdUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const movieCategories: MovieCategory[] = [
    {
      id: 'late-night',
      title: 'Filmes para a Madrugada',
      description: 'Perfeitos para assistir quando o mundo está dormindo',
      icon: <Moon className="w-6 h-6" />,
      movies: [
        {
          id: '1',
          title: 'Clube da Luta',
          year: 1999,
          imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
          director: 'David Fincher'
        },
        {
          id: '2',
          title: 'Donnie Darko',
          year: 2001,
          imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400',
          director: 'Richard Kelly'
        },
        {
          id: '3',
          title: 'Blade Runner',
          year: 1982,
          imageUrl: 'https://images.unsplash.com/photo-1515191107209-c28698631303?auto=format&fit=crop&q=80&w=400',
          director: 'Ridley Scott'
        }
      ]
    },
    {
      id: 'company',
      title: 'Filmes para Ver Acompanhado',
      description: 'Experiências cinematográficas melhores compartilhadas',
      icon: <Users className="w-6 h-6" />,
      movies: [
        {
          id: '4',
          title: 'Pulp Fiction',
          year: 1994,
          imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=400',
          director: 'Quentin Tarantino'
        },
        {
          id: '5',
          title: 'Interestelar',
          year: 2014,
          imageUrl: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=400',
          director: 'Christopher Nolan'
        },
        {
          id: '6',
          title: 'Parasita',
          year: 2019,
          imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
          director: 'Bong Joon-ho'
        }
      ]
    },
    {
      id: 'sunday',
      title: 'Filmes para um Domingo Preguiçoso',
      description: 'Perfeitos para relaxar e recarregar as energias',
      icon: <Coffee className="w-6 h-6" />,
      movies: [
        {
          id: '7',
          title: 'O Grande Hotel Budapeste',
          year: 2014,
          imageUrl: 'https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&q=80&w=400',
          director: 'Wes Anderson'
        },
        {
          id: '8',
          title: 'Amélie Poulain',
          year: 2001,
          imageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&q=80&w=400',
          director: 'Jean-Pierre Jeunet'
        },
        {
          id: '9',
          title: 'Cinema Paradiso',
          year: 1988,
          imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
          director: 'Giuseppe Tornatore'
        }
      ]
    },
    {
      id: 'cinephile',
      title: 'Para o Cinéfilo Exigente',
      description: 'Obras-primas que vão expandir seus horizontes',
      icon: <Brain className="w-6 h-6" />,
      movies: [
        {
          id: '10',
          title: 'Stalker',
          year: 1979,
          imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=400',
          director: 'Andrei Tarkovsky'
        },
        {
          id: '11',
          title: '8½',
          year: 1963,
          imageUrl: 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?auto=format&fit=crop&q=80&w=400',
          director: 'Federico Fellini'
        },
        {
          id: '12',
          title: 'Persona',
          year: 1966,
          imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
          director: 'Ingmar Bergman'
        }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white pb-12">
        <div className="container mx-auto px-4">
          <header className="py-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Film className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Recomendações para {letterboxdUsername}</h1>
            <p className="text-blue-200">
              Baseado no seu perfil do Letterboxd, selecionamos estes filmes especialmente para você
            </p>
          </header>

          <div className="space-y-12">
            {movieCategories.map((category) => (
              <section key={category.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-blue-400">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <p className="text-blue-200 text-sm">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.movies.map((movie) => (
                    <div key={movie.id} className="group relative overflow-hidden rounded-lg">
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="w-full h-48 object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                        <h3 className="text-lg font-semibold">{movie.title}</h3>
                        <p className="text-sm text-blue-200">
                          {movie.year} • {movie.director}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

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
          <div className="flex items-center justify-center mb-8">
            <Film className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">LetterBESd</h1>
          <p className="text-xl text-blue-200 mb-8">
            Descubra novos filmes com recomendações personalizadas baseadas no seu histórico do Letterboxd
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue-200 mb-2">
                  Seu nome de usuário do Letterboxd
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="text"
                    id="username"
                    value={letterboxdUsername}
                    onChange={(e) => setLetterboxdUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-blue-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300"
                    placeholder="Ex: mscorsese"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !letterboxdUsername}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Analisando seu perfil...
                  </>
                ) : (
                  'Obter Recomendações'
                )}
              </button>
            </form>

            <div className="mt-8 text-sm text-blue-300">
              <p>Como funciona:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Analisamos seu histórico de filmes no Letterboxd</li>
                <li>Nosso algoritmo de Machine Learning identifica seus padrões de gosto</li>
                <li>Recomendamos filmes que você provavelmente vai adorar</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000"
              alt="Cinema"
              className="rounded-2xl w-full h-48 object-cover opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;