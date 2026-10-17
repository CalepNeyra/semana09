'use client';

import React, { useState, useTransition } from 'react';
import axios from 'axios';

// Configuración de API Key para OMDb
const API_KEY = '6ff046e8';

// Definición de Interfaces TypeScript
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Plot: string;
  Director: string;
  Actors: string;
  Genre: string;
  imdbRating: string;
  Poster: string;
  Released?: string;
  Runtime?: string;
  Writer?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
}

interface SearchMoviesProps {
  onSelectMovie: (id: string) => void;
  selectedMovie: MovieDetail | null;
  onCloseModal: () => void;
}

export default function SearchMovies({
  onSelectMovie,
  selectedMovie,
  onCloseModal,
}: SearchMoviesProps) {
  // Estados Locales para la Búsqueda Dinámica (CSR)
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  // Función Principal para Consumir la API de OMDb vía Axios
  const handleSearchMovies = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const typeParam = filterType !== 'all' ? `&type=${filterType}` : '';
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}${typeParam}`
      );

      if (response.data.Response === 'True') {
        startTransition(() => {
          setMovies(response.data.Search || []);
        });
      } else {
        setMovies([]);
        setError(response.data.Error || 'No se encontraron títulos coincidentes con tu búsqueda.');
      }
    } catch (err: unknown) {
      console.error('Error fetching search results:', err);
      setError('Ocurrió un error inesperado al conectar con el servidor de películas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans selection:bg-cyan-400 selection:text-slate-950">
      
      {/* 1. Cabecera y Barra de Búsqueda CSR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              BÚSQUEDA DINÁMICA · CLIENT-SIDE RENDERING (CSR)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight pt-1">
            ¿Qué quieres ver hoy?
          </h2>
          <p className="text-xs text-slate-400 font-normal leading-relaxed">
            Busca en nuestro catálogo global interactivo. Filtra por películas o series con renderizado dinámico e instantáneo en el cliente.
          </p>
        </div>

        {/* Formulario e Inputs de Búsqueda */}
        <form onSubmit={handleSearchMovies} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Selector de Filtro (Película / Serie) */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-slate-800 bg-[#070b12] text-slate-300 text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
          >
            <option value="all">Todos los Tipos</option>
            <option value="movie">Películas</option>
            <option value="series">Series</option>
          </select>

          {/* Campo de Búsqueda */}
          <div className="relative flex-1 w-full sm:w-80 lg:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Busca por título (ej. Matrix, Batman, Suits)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-800 bg-[#070b12] text-white text-xs md:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-black px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-400/20 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            {loading ? 'Buscando...' : 'Buscar'}
            {!loading && <span className="text-sm font-bold">›</span>}
          </button>
        </form>
      </div>

      {/* Mensajes de Estado o Error */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs font-semibold text-center animate-fadeIn">
          {error}
        </div>
      )}

      {/* 2. Modal Flotante de Detalles Técnicos de la Película */}
      {selectedMovie && (
        <div className="bg-[#0d1422] backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-cyan-400/30 text-white space-y-6 shadow-2xl relative overflow-hidden my-6 transition-all animate-fadeIn">
          <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                Información del Título
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight pt-1">
                {selectedMovie.Title}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                {selectedMovie.Year} • {selectedMovie.Genre} • {selectedMovie.Runtime || 'Duración N/A'}
              </p>
            </div>
            <button
              onClick={onCloseModal}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer border border-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {selectedMovie.Poster && selectedMovie.Poster !== 'N/A' ? (
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                className="w-48 h-auto rounded-2xl object-cover shadow-2xl border border-slate-800/80 flex-shrink-0"
              />
            ) : (
              <div className="w-48 h-72 bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4 border border-slate-800 flex-shrink-0">
                <span className="text-3xl mb-2">🎬</span>
                <span>Sin afiche disponible</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs md:text-sm text-slate-300 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p><strong className="text-white font-bold">Director:</strong> {selectedMovie.Director}</p>
                <p><strong className="text-white font-bold">Idioma:</strong> {selectedMovie.Language || 'N/A'}</p>
                <p><strong className="text-white font-bold">Reparto:</strong> {selectedMovie.Actors}</p>
                <p><strong className="text-white font-bold">Premios:</strong> {selectedMovie.Awards || 'N/A'}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <strong className="text-white font-bold">Calificación IMDb:</strong>
                <span className="bg-amber-400/10 text-amber-400 font-black px-2.5 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                  ★ {selectedMovie.imdbRating}/10
                </span>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sinopsis General</span>
                <p className="text-slate-300 leading-relaxed bg-[#070b12] p-4 rounded-2xl border border-slate-800/80 italic font-normal text-xs md:text-sm mt-1">
                  "{selectedMovie.Plot}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Rejilla de Resultados Obtenidos vía CSR */}
      {isPending && (
        <div className="text-center py-8 text-xs text-cyan-400 font-bold tracking-widest uppercase">
          Procesando resultados...
        </div>
      )}

      {!isPending && movies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resultados encontrados: <strong className="text-white">{movies.length}</strong></span>
            <span>Haz clic para ver la ficha técnica</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pt-2">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => onSelectMovie(movie.imdbID)}
                className="group bg-[#0d1422] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-400/80 transition-all duration-300 cursor-pointer hover:-translate-y-2 flex flex-col justify-between shadow-xl"
              >
                <div className="relative w-full h-64 bg-slate-950 overflow-hidden">
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-3 bg-slate-950">
                      <span className="text-xl mb-1">🎬</span>
                      <span>Sin afiche</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-cyan-400/20 text-cyan-300 backdrop-blur-md text-[9px] font-black px-2 py-0.5 rounded border border-cyan-400/30">
                    CSR
                  </div>
                </div>

                <div className="p-3 bg-[#0d1422] space-y-1">
                  <h4 className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                    {movie.Title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{movie.Year}</span>
                    <span className="uppercase text-slate-500">{movie.Type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}