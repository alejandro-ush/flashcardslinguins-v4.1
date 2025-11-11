'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Flashcard from '@/components/Flashcard';
import { motion } from 'framer-motion';

// 🧩 Función para traer las tarjetas según idioma y nivel
async function loadCards(levelName: string, langFromId: number, langToId: number) {
  try {
    const { data: levelData, error: levelError } = await supabase
      .from('levels')
      .select('id')
      .eq('name', levelName)
      .single();

    if (levelError || !levelData) throw levelError;
    const levelId = levelData.id;

    const { data, error } = await supabase
      .from('words')
      .select(`
        id,
        concept_key,
        category_id,
        translations:translations!inner(
          language_id,
          text,
          article
        )
      `)
      .eq('level_id', levelId)
      .limit(50);

    if (error) throw error;

    return (
      data
        ?.map((word: any) => {
          const from = word.translations.find((t: any) => t.language_id === langFromId);
          const to = word.translations.find((t: any) => t.language_id === langToId);
          if (!from || !to) return null;
          return {
            id: word.id,
            front: `${from.article ? from.article + ' ' : ''}${from.text}`,
            back: to.text,
          };
        })
        .filter(Boolean) || []
    );
  } catch (err) {
    console.error('Error cargando tarjetas:', err);
    return [];
  }
}

export default function LearnPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');

  // 🔹 Datos del usuario (dinámicos)
  const [langFrom, setLangFrom] = useState('');
  const [langTo, setLangTo] = useState('');
  const [level, setLevel] = useState('');
  const [mode, setMode] = useState('');

  // 🔄 Botón para volver al setup
  const handleReset = () => {
    if (confirm('¿Seguro que quieres cambiar de idioma o nivel?')) {
      localStorage.clear();
      window.location.href = '/setup';
    }
  };

  // 🚀 Cargar configuración del usuario + tarjetas
  useEffect(() => {
    const storedLangFromId = Number(localStorage.getItem('langFromId'));
    const storedLangToId = Number(localStorage.getItem('langToId'));
    const storedLevel = localStorage.getItem('levelName') || 'A1';
    const storedMode = localStorage.getItem('mode') || 'A';

    // Solo mostramos los códigos en mayúscula (DE, EN, etc)
    const langMap: Record<number, string> = { 1: 'DE', 2: 'EN', 3: 'ES' };
    setLangFrom(langMap[storedLangFromId]);
    setLangTo(langMap[storedLangToId]);
    setLevel(storedLevel);
    setMode(storedMode);

    async function fetchData() {
      setIsLoading(true);
      const cardsFetched = await loadCards(storedLevel, storedLangFromId, storedLangToId);
      setCards(cardsFetched);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const current = cards[index];

  // ✅ Validar respuesta
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;

    const normalize = (s: string) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const correct =
      normalize(userAnswer.trim()) === normalize(current.back.trim());

    setFeedback(
      correct
        ? `✅ Correcto. "${current.front}" significa "${current.back}".`
        : `❌ Incorrecto. "${current.front}" significa "${current.back}".`
    );
    setUserAnswer('');
  };

  const handleNext = () => {
    setFeedback('');
    setUserAnswer('');
    setIndex((prev) => (prev + 1) % cards.length);
  };

  // 🧱 Render
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Cargando tarjetas...
      </main>
    );
  }

  if (!current) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
        <h2>No hay tarjetas disponibles.</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
      <h1 className="text-xl font-bold mb-4">
        Modo {mode === 'A' ? 'Reto (A)' : mode === 'B' ? 'Focus (B)' : 'Arcade (C)'} — Idioma: {langFrom} → {langTo} / Nivel: {level}
      </h1>

      {/* 🔄 Botón para cambiar configuración */}
      <motion.button
        onClick={handleReset}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-sm shadow-md border border-gray-700 transition-colors"
        title="Cambiar idioma o nivel"
      >
        ⚙️ 
      </motion.button>

      {/* Tarjeta actual */}
      <Flashcard front={current.front} back={current.back} />

      {/* Input de respuesta */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="p-2 rounded-md text-black w-64 text-center"
        />
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
        >
          Enviar respuesta
        </button>
      </form>

      {feedback && (
        <>
          <p
            className={`mt-4 text-lg ${
              feedback.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {feedback}
          </p>
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            Siguiente →
          </button>
        </>
      )}
    </main>
  );
}
