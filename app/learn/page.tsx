// app/learn/page.tsx
'use client';

/**
 * 💡 Este componente representa el MODO RETO (A)
 * Es la página principal de práctica: muestra una tarjeta,
 * permite responder y recibir feedback de la IA.
 * Carga tarjetas desde Supabase según idioma, nivel y categoría.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 📦 Componente visual (tarjeta)
import Flashcard from '@/components/Flashcard';

export default function LearnPage() {
  // 🧩 Estados
  const [cards, setCards] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 Obtener idioma, nivel y modo desde localStorage
  const lang =
    typeof window !== 'undefined' ? localStorage.getItem('langCode') : null;
  const level =
    typeof window !== 'undefined' ? localStorage.getItem('levelName') : null;
  const mode =
    typeof window !== 'undefined' ? localStorage.getItem('mode') : null;

  // 🧭 Cargar tarjetas desde Supabase según idioma y nivel
  useEffect(() => {
    async function loadCards() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vocabulario')
        .select('*')
        .eq('language', lang)
        .eq('level', level);

      if (error) {
        console.error('Error cargando tarjetas:', error);
      } else {
        setCards(data || []);
      }
      setIsLoading(false);
    }

    loadCards();
  }, [lang, level]);

  // ⏭️ Tarjeta actual
  const current = cards[index];

  // 🧠 Validar respuesta del usuario según nivel y tipo de palabra
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;

    // Normalizar (sin tildes, minúsculas)
    const normalize = (str: string) =>
      (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const userClean = normalize(userAnswer.trim());
    const targetWord = normalize(current.word || current.back || '');
    const correct = userClean === targetWord;

    if (correct) {
      if (current.type === 'noun' && current.article) {
        setFeedback(
          `✅ Correcto. "${current.word}" es ${current.article} (${current.back}).`
        );
      } else {
        setFeedback(
          `✅ Correcto. "${current.word}" significa ${current.back}.`
        );
      }
    } else {
      if (current.type === 'noun' && current.article) {
        setFeedback(
          `❌ Incorrecto. "${current.word}" significa ${current.back} (${current.article}).`
        );
      } else {
        setFeedback(
          `❌ Incorrecto. "${current.word}" significa ${current.back}.`
        );
      }
    }

    setUserAnswer('');
  };

  // 🔁 Siguiente tarjeta
  const handleNext = () => {
    setFeedback('');
    setUserAnswer('');
    setIndex((prev) => (prev + 1) % cards.length);
  };

  // 🧱 Render
  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-400">Cargando tarjetas...</p>
    );
  }

  if (!current) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-gray-200 bg-gray-900">
        <h2 className="text-xl mb-4">No hay tarjetas disponibles.</h2>
        <p className="text-sm opacity-70">
          Asegúrate de haber agregado vocabulario en Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
      <h1 className="text-2xl mb-4 font-bold">
        Modo Reto (A) — Idioma: {lang?.toUpperCase()} / Nivel: {level}
      </h1>

      {/* Tarjeta */}
      <Flashcard front={current.front} back={current.back} />

      {/* Input para respuesta */}
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

      {/* Feedback */}
      {feedback && (
        <p
          className={`mt-4 text-lg ${
            feedback.includes('✅') ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Botón siguiente */}
      {feedback && (
        <button
          onClick={handleNext}
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Siguiente →
        </button>
      )}
    </main>
  );
}
