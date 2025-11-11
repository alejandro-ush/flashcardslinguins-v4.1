'use client';

import { useEffect } from 'react';

/**
 * Landing temporal:
 * - Si el usuario no tiene idioma/nivel guardado, lo manda a /setup
 * - Si ya tiene configuración previa, lo lleva directo a /learn
 */

export default function HomeRedirect() {
  useEffect(() => {
    const lang = localStorage.getItem('langFromId');
    const level = localStorage.getItem('levelName');

    if (!lang || !level) {
      window.location.href = '/setup';
    } else {
      window.location.href = '/learn';
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <h1 className="text-lg text-gray-400 animate-pulse">
        Bienvenido, loading una nueva experiencia...
      </h1>
    </main>
  );
}
