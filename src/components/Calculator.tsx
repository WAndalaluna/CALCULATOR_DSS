import React, { useState, useEffect } from 'react';
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
  criteria = [],
  alternatives = [],
}) => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (tableData.length > 0 && weights.length > 0 && types.length > 0) {
      const inputData = {
        rows: tableData.length,
        cols: tableData[0]?.length || 0,
        weights,
        types,
        values: tableData,
      };

      const calculateResult = () => {
        switch (method) {
          case 'saw':
            return calculateSAW(inputData);
          case 'wp':
            return calculateWP(inputData);
          case 'topsis':
            return calculateTOPSIS(inputData);
          case 'ahp':
            if (criteriaComparison && alternativesComparison) {
              if (criteriaComparison.length === 0 || alternativesComparison.length === 0) {
                return null;
              }
              return calculateAHP(alternatives, criteria, {
                criteria: criteriaComparison,
                alternatives: alternativesComparison,
              });
            } else {
              console.error("AHP requires criteriaComparison and alternativesComparison");
              return null;
            }
          default:
            return null;
        }
      };

      const calculationResult = calculateResult();
      setResult(calculationResult);
    }
  }, [tableData, weights, types, method, criteriaComparison, alternativesComparison]);

  if (!result) return null;

  return method === 'ahp' ? (
    <AHPResult
      steps={result.steps}
      result={result.result}
      consistencyResults={result.consistencyResults}
    />
  ) : (
    <Result steps={result.steps} />
  );
};

export default Calculator;