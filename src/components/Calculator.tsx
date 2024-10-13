import React from 'react';
import { calculateSAW } from '../utils/saw';
import { calculateWP } from '../utils/wp';
import { calculateTOPSIS } from '../utils/topsis';
import { calculateAHP } from '../utils/ahp';
import Result from './Result';
import AHPResult from './AHPResult';

interface CalculatorProps {
  tableData: number[][]; // Data tabel untuk alternatif
  weights: number[]; // Bobot untuk kriteria
  types: string[]; // Tipe untuk kriteria (benefit/cost)
  method: 'saw' | 'wp' | 'topsis' | 'ahp'; // Metode yang dipilih
  criteriaComparison?: number[][]; // Matriks perbandingan kriteria untuk AHP
  alternativesComparison?: number[][][]; // Matriks perbandingan alternatif untuk setiap kriteria
  criteria?: string[]; // Daftar kriteria
  alternatives?: string[]; // Daftar alternatif
}

const Calculator: React.FC<CalculatorProps> = ({ 
  tableData, 
  weights, 
  types, 
  method, 
  criteriaComparison, 
  alternativesComparison,
  criteria = [], // Default ke array kosong jika tidak diberikan
  alternatives = [], // Default ke array kosong jika tidak diberikan
}) => {
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (tableData.length > 0 && weights.length > 0 && types.length > 0) {
      const inputData = {
        rows: tableData.length,
        cols: tableData[0]?.length || 0,
        weights,
        types,
        values: tableData,
      };

      let calculationResult;

      // Tentukan metode perhitungan berdasarkan pilihan yang dipilih
      switch (method) {
        case 'saw':
          calculationResult = calculateSAW(inputData);
          break;
        case 'wp':
          calculationResult = calculateWP(inputData);
          break;
        case 'topsis':
          calculationResult = calculateTOPSIS(inputData);
          break;
        case 'ahp':
          // Periksa apakah criteriaComparison dan alternativesComparison diberikan untuk AHP
          if (criteriaComparison && alternativesComparison) {
            // Pastikan tidak ada input kosong
            if (criteriaComparison.length === 0 || alternativesComparison.length === 0) {
              console.error("Criteria and alternatives comparisons cannot be empty");
              return; // Hentikan eksekusi lebih lanjut
            }

            // Tampilkan matriks perbandingan kriteria dan alternatif
            console.log("Matriks Perbandingan Kriteria:");
            console.table(criteriaComparison);

            console.log("Matriks Perbandingan Alternatif:");
            alternativesComparison.forEach((comparison, index) => {
              console.log(`Matriks Perbandingan untuk Kriteria ${index + 1}:`);
              console.table(comparison);
            });

            console.log("Tipe Kriteria:");
            console.log(types);

            // Hitung AHP
            calculationResult = calculateAHP(alternatives, criteria, {
              criteria: criteriaComparison,
              alternatives: alternativesComparison,
            });
          } else {
            console.error("AHP requires criteriaComparison and alternativesComparison");
            return; // Hentikan eksekusi lebih lanjut
          }
          break;
        default:
          calculationResult = null;
          break;
      }

      // Set hasil perhitungan
      setResult(calculationResult);
    }
  }, [tableData, weights, types, method, criteriaComparison, alternativesComparison]);

  return (
    <div className="mt-4">
      {method === 'ahp' && result ? (
        <AHPResult
          steps={result.steps}
          result={result.result}
          consistencyResults={result.consistencyResults}
        />
      ) : (
        result && <Result steps={result.steps} />
      )}
    </div>
  );
};

export default Calculator;