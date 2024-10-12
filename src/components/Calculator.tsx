import React from 'react';
import { calculateSAW } from '../utils/saw'; // Adjust the path as necessary
import { calculateWP } from '../utils/wp'; // Import calculateWP function
import Result from './Result';

interface CalculatorProps {
  tableData: number[][]; // Data tabel untuk alternatif
  weights: number[]; // Bobot untuk kriteria
  types: string[]; // Tipe untuk kriteria (benefit/cost)
  method: 'SAW' | 'WP'; // Metode yang dipilih
}

const Calculator: React.FC<CalculatorProps> = ({ tableData, weights, types, method }) => {
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
      // Determine which calculation to perform based on the selected method
      switch (method) {
        case 'saw':
          calculationResult = calculateSAW(inputData);
          break;
        case 'wp':
          calculationResult = calculateWP(inputData); // Call the WP calculation function
          break;
        default:
          calculationResult = null;
          break;
      }

      setResult(calculationResult);
    }
  }, [tableData, weights, types, method]);

  return (
    <div className="mt-4">
      {result && <Result steps={result.steps} />}
    </div>
  );
};

export default Calculator;
