// components/Flashcard.tsx
'use client';
import { useState } from 'react';

export default function Flashcard({ front, back, onAnswer }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

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
      onAnswer(result.correct, result.explanation);
    } catch (err) {
      setFeedback('⚠️ Error analizando la respuesta.');
    }

    setLoading(false);
    setInput('');
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-center">{front}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="border p-2 rounded-md"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Analizando...' : 'Enviar respuesta'}
        </button>
      </form>

      {feedback && (
        <p
          className={`text-sm text-center ${
            feedback.includes('✅') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
