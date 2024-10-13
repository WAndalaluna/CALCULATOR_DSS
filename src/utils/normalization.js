// src/utils/normalization.js

// Fungsi untuk menormalisasi matriks
export function normalizeMatrix(matrix) {
  // Langkah 1: Hitung akar kuadrat dari jumlah kuadrat setiap kolom
  const columnSums = matrix[0].map((_, colIndex) => 
      Math.sqrt(matrix.reduce((sum, row) => sum + row[colIndex] ** 2, 0))
  );

  // Langkah 2: Normalisasi setiap nilai dalam matriks dengan membagi dengan total kolom yang sesuai
  const normalizedMatrix = matrix.map(row => 
      row.map((value, colIndex) => value / columnSums[colIndex])
  );

  return normalizedMatrix;
}
