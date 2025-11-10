'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState('');
  const [level, setLevel] = useState('');
  const [mode, setMode] = useState('');

  // 📦 Guardar selección y navegar a /learn
  const handleStart = () => {
    if (!lang || !level || !mode) {
      alert('Por favor selecciona idioma, nivel y modo antes de empezar.');
      return;
    }

    // Guardar en localStorage para usar en /learn
    localStorage.setItem('langCode', lang);
    localStorage.setItem('levelName', level);
    localStorage.setItem('mode', mode);

    router.push('/learn');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center p-6 text-gray-100 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-2 text-green-400">
          Flashcards Linguins
        </h1>
        <p className="text-gray-400 mb-6">
          Aprende idiomas de forma natural y progresiva.
        </p>

        {/* Idioma */}
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Idioma
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-400"
          >
            <option value="">Selecciona...</option>
            <option value="de">🇩🇪 Alemán</option>
            <option value="en">🇬🇧 Inglés</option>
          </select>
        </div>

        {/* Nivel */}
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nivel
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-400"
          >
            <option value="">Selecciona...</option>
            <option value="A1">A1 (Inicial)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
          </select>
        </div>

        {/* Modo */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Modo
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-400"
          >
            <option value="">Selecciona...</option>
            <option value="A">🧠 Reto (Memoria)</option>
            <option value="B">🎯 Focus (IA)</option>
            <option value="C">🎮 Arcade (IA + 3 tarjetas)</option>
          </select>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition"
        >
          Empezar →
        </button>
      </motion.div>

      <footer className="mt-6 text-gray-500 text-xs">
        © 2025 Flashcards Linguins · v4-dev
      </footer>
    </main>
  );
}
