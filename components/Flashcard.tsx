// components/Flashcard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ front, back, onAnswer }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // 💬 Manejar envío de respuesta (API IA)
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      const res = await fetch('/api/ai-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front, back, answer: input }),
      });

      const result = await res.json();
      setFeedback(result.explanation || '');
      onAnswer?.(result.correct, result.explanation);
    } catch (err) {
      console.error('⚠️ Error en Flashcard:', err);
      setFeedback('⚠️ Error analizando la respuesta.');
    }

    setLoading(false);
    setInput('');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-gray-800 text-gray-100 rounded-2xl shadow-xl border border-gray-700 max-w-md w-full p-8 flex flex-col items-center"
    >
      {/* 🔤 Texto frontal (palabra a traducir) */}
      <motion.h2
        key={front} // asegura animación entre tarjetas
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-2 tracking-wide text-white"
      >
        {front}
      </motion.h2>

      <p className="text-sm text-gray-400 italic mb-4">
        Traduce esta palabra al idioma destino
      </p>

      {/* ✍️ Campo de respuesta */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3 w-full"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu traducción..."
          className="w-full p-2 rounded-md text-black text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Analizando...' : 'Enviar respuesta'}
        </button>
      </form>

      {/* 💬 Feedback */}
      {feedback && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-4 text-center text-sm ${
            feedback.includes('✅') ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {feedback}
        </motion.p>
      )}
    </motion.div>
  );
}
