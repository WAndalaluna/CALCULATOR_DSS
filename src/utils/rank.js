// src/utils/rank.js
export function rankAlternatives(scores) {
    return scores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .map((item, rank) => ({ ...item, rank: rank + 1 }));
  }
  