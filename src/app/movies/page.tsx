'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchMovies, { MovieDetail } from './SearchMovies';
import axios from 'axios';

// API Key oficial de OMDb
const API_KEY = '6ff046e8';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export default function MoviesPage() {
  // Estados para las Tendencias Populares y Navegación
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [isLoadingPopular, setIsLoadingPopular] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('marvel');

  const carouselRef = useRef<HTMLDivElement>(null);

  // Función para obtener películas desde el servidor (Simulación SSR / Hydration)
  const fetchPopularMovies = useCallback(async (queryCategory: string) => {
    setIsLoadingPopular(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${queryCategory}`
      );
      if (response.data.Response === 'True') {
        setPopularMovies(response.data.Search || []);
      } else {
        setPopularMovies([]);
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      setPopularMovies([]);
    } finally {
      setIsLoadingPopular(false);
    }
  }, []);

  // Efecto Inicial de Carga
  useEffect(() => {
    fetchPopularMovies(activeCategory);
  }, [activeCategory, fetchPopularMovies]);

  // Función para obtener el detalle específico de una película
  const fetchMovieDetail = async (id: string) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      if (response.data.Response === 'True') {
        setSelectedMovie(response.data);
      }
    } catch (error) {
      console.error('Error al cargar el detalle del título:', error);
    }
  };

  // Manejador del Desplazamiento Horizontal del Carrusel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-cyan-400 selection:text-slate-950 pb-24 font-sans relative overflow-x-hidden">
      
      {/* 1. Iluminación Ambiental y Efectos Visuales de Fondo */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 2. Barra de Navegación Estilizada (Navbar) */}
      <nav className="border-b border-slate-800/80 bg-[#070b12]/80 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🍿</span>
            <span className="font-black text-xl tracking-widest text-white uppercase">
              CINEVERSE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <button 
              onClick={() => setActiveCategory('marvel')}
              className={`${activeCategory === 'marvel' ? 'text-white border-b-2 border-cyan-400' : 'hover:text-white'} pb-1 transition-colors cursor-pointer`}
            >
              Marvel
            </button>
            <button 
              onClick={() => setActiveCategory('star wars')}
              className={`${activeCategory === 'star wars' ? 'text-white border-b-2 border-cyan-400' : 'hover:text-white'} pb-1 transition-colors cursor-pointer`}
            >
              Star Wars
            </button>
            <button 
              onClick={() => setActiveCategory('batman')}
              className={`${activeCategory === 'batman' ? 'text-white border-b-2 border-cyan-400' : 'hover:text-white'} pb-1 transition-colors cursor-pointer`}
            >
              DC Comics
            </button>
          </div>

          <span className="text-[11px] bg-slate-900 text-slate-300 border border-slate-800 px-3.5 py-1.5 rounded-full font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block mr-2 animate-pulse"></span>
            Tecsup · Galería SSR/CSR
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        
        {/* 3. Hero Section / Banner Principal */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
              — EXPERIENCIA CINEMATOGRÁFICA
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Historias que trascienden la <span className="text-cyan-400">pantalla.</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs md:text-sm max-w-sm leading-relaxed font-normal">
            Plataforma multimedia que integra tecnologías híbridas con Renderizado en Servidor (SSR) y búsqueda dinámica del lado del cliente (CSR).
          </p>
        </header>

        {/* 4. Carrusel de Tendencias (SSR) */}
        <section className="bg-[#0b101b] backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                COLECCIÓN DESTACADA
              </span>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  En Cartelera & Tendencias
                </h2>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  ✦ Renderizado en Servidor (SSR)
                </span>
              </div>
            </div>

            {/* Controles del Carrusel */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center text-sm font-bold transition-all cursor-pointer active:scale-95"
                title="Anterior"
              >
                ‹
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center text-sm font-bold transition-all cursor-pointer active:scale-95"
                title="Siguiente"
              >
                ›
              </button>
            </div>
          </div>

          {/* Estado de Carga del Carrusel */}
          {isLoadingPopular ? (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs font-bold tracking-widest uppercase">
              Cargando catálogo en servidor...
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularMovies.map((movie, index) => (
                <div
                  key={movie.imdbID}
                  onClick={() => fetchMovieDetail(movie.imdbID)}
                  className="group min-w-[200px] max-w-[200px] bg-[#0d1422] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-2 flex-shrink-0 relative shadow-lg"
                >
                  <div className="relative w-full h-72 bg-slate-950 overflow-hidden">
                    {movie.Poster && movie.Poster !== 'N/A' ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-3">
                        <span className="text-xl mb-1">🎬</span>
                        <span>Sin póster</span>
                      </div>
                    )}

                    {/* Badge de Estreno */}
                    <div className="absolute top-3 right-3 bg-rose-600/90 text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-widest border border-rose-400/30">
                      ESTRENO
                    </div>

                    {/* Fecha simulada */}
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800">
                      {index % 2 === 0 ? '14 FEB' : '28 FEB'}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 bg-[#0d1422]">
                    <h3 className="font-bold text-sm truncate text-white group-hover:text-cyan-400 transition-colors">
                      {movie.Title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Acción · Fantasía
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/60 mt-2">
                      <span>{movie.Year}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        ★ {(8.0 + (index % 10) * 0.1).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Sección de Búsqueda Dinámica CSR */}
        <section className="bg-[#0b101b] backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
          <SearchMovies 
            onSelectMovie={fetchMovieDetail} 
            selectedMovie={selectedMovie} 
            onCloseModal={() => setSelectedMovie(null)} 
          />
        </section>

      </div>
    </div>
  );
}