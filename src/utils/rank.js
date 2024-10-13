// src/utils/rank.js

// Fungsi untuk memberi peringkat pada alternatif berdasarkan skor
export function rankAlternatives(scores) {
  // Langkah 1: Buat array baru dengan menyimpan nilai skor dan indeks aslinya
  const scoredItems = scores.map((score, index) => ({ score, index }));

  // Langkah 2: Urutkan array berdasarkan skor dari yang tertinggi ke terendah
  const sortedItems = scoredItems.sort((a, b) => b.score - a.score);

  // Langkah 3: Tetapkan peringkat berdasarkan urutan
  const rankedItems = sortedItems.map((item, rank) => ({
      ...item,
      rank: rank + 1
  }));

  return rankedItems;
}
