import React from 'react';

interface AHPResultProps {
  steps: any[]; // Mengatur tipe data yang sesuai
  result: {
    criteriaWeights: number[]; // Hasil akhir bobot kriteria
    finalScores: { alternative: string; score: number }[]; // Hasil akhir alternatif
  };
  consistencyResults: {
    criteriaCR: number | null; // Konsistensi kriteria, bisa null
    criteriaCI: number | null; // Indeks konsistensi, bisa null
  };
}

const AHPResult: React.FC<AHPResultProps> = ({ steps, result, consistencyResults }) => {
  return (
    <div>
      <h2>Hasil AHP</h2>
      <p>
        Konsistensi Kriteria: {consistencyResults.criteriaCR !== null ? consistencyResults.criteriaCR.toFixed(4) : 'Data tidak tersedia'}
      </p>
      <p>
        Indeks Konsistensi: {consistencyResults.criteriaCI !== null ? consistencyResults.criteriaCI.toFixed(4) : 'Data tidak tersedia'}
      </p>
      
      {/* Menampilkan langkah-langkah */}
      {steps.map((step, index) => (
        <div key={index}>
          <h3>{step.title}</h3>
          <pre>{JSON.stringify(step.data, null, 2)}</pre>
        </div>
      ))}
      
      <h3>Hasil Akhir Kriteria:</h3>
      <p>
        {result.criteriaWeights.map((weight, index) => (
          <span key={index}>Kriteria {index + 1}: {weight.toFixed(4)}<br /></span>
        ))}
      </p>
      
      <h3>Hasil Akhir Alternatif:</h3>
      <p>
        {result.finalScores.map((alt, index) => (
          <span key={index}>Alternatif {alt.alternative}: {alt.score.toFixed(4)}<br /></span>
        ))}
      </p>
    </div>
  );
};

export default AHPResult;