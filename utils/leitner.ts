// utils/leitner.ts
export type Card = {
  id: string | number;
  front: string;
  back: string;
  box: number; // 1..5
};

export function nextReview(cards: Card[]): Card[] {
  // Para demo: devuelve todas las de box 1 primero
  const sorted = [...cards].sort((a, b) => a.box - b.box);
  return sorted.slice(0, 5); // 5 tarjetas por sesión
}

export function grade(card: Card, isCorrect: boolean): Card {
  const nextBox = Math.max(1, Math.min(5, card.box + (isCorrect ? 1 : -1)));
  return { ...card, box: nextBox };
}
