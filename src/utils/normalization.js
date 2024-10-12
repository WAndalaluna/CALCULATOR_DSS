// src/utils/normalization.js
export function normalizeMatrix(matrix) {
    return matrix.map(row => 
      row.map((value, colIndex) => value / Math.sqrt(matrix.reduce((sum, row) => sum + row[colIndex] ** 2, 0))));
  }
  