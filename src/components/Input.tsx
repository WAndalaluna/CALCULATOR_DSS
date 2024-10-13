import React, { useState, useRef, useEffect } from "react";

interface InputFormProps {
  onCalculate: (data: {
    rows: number;
    cols: number;
    weights: number[];

    types: string[];
    values: number[][];
    
  }) => void;
  onReset: () => void;
  method: string;
  isAHP?: boolean; // New prop to indicate if AHP is selected
  onAHPDataChange?: (data: number[][]) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate, onReset, method }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableData, setTableData] = useState<number[][]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const inputRefs = useRef<(React.RefObject<HTMLInputElement> | null)[]>(Array(rows * cols).fill(null).map(() => React.createRef<HTMLInputElement>()));
  const [values, setValues] = useState<number[][]>([[], []]);
  const incrementRows = () => setRows(rows + 1);
  const decrementRows = () => rows > 2 && setRows(rows - 1);
  const incrementCols = () => setCols(cols + 1);
  const decrementCols = () => cols > 2 && setCols(cols - 1);
  const [results, setResults] = useState(null);
  const [criteriaCount, setCriteriaCount] = useState(2);
  const [alternativesCount, setAlternativesCount] = useState(2);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [pairwiseComparison, setPairwiseComparison] = useState<number[][][]>([]);
  // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    generateTable();
  }, [rows, cols]);

  const generateTable = () => {
    const newTableData = Array.from({ length: rows }, (_, rowIndex) => {
      return Array.from({ length: cols }, (_, colIndex) => {
        // Preserve existing values if they exist
        return tableData[rowIndex] && tableData[rowIndex][colIndex] !== undefined
          ? tableData[rowIndex][colIndex]
          : 0;
      });
    });

    // Preserve existing weights and types
    setWeights(prevWeights => {
      const newWeights = Array(cols).fill(0);
      for (let i = 0; i < Math.min(prevWeights.length, newWeights.length); i++) {
        newWeights[i] = prevWeights[i];
      }
      return newWeights;
    });

    setTypes(prevTypes => {
      const newTypes = Array(cols).fill("benefit");
      for (let i = 0; i < Math.min(prevTypes.length, newTypes.length); i++) {
        newTypes[i] = prevTypes[i];
      }
      return newTypes;
    });

    setTableData(newTableData);
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    let value = Number(e.target.value);
    if (value < 0) {
      alert("Values cannot be negative");
      return;
    }
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = Number(e.target.value);
    if (value < 0) {
      alert("Weights cannot be negative");
      return;
    }
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newTypes = [...types];
    newTypes[index] = e.target.value;
    setTypes(newTypes);
  };

  const handleReset = () => {
    setWeights(Array(cols).fill(0));
    setTypes(Array(cols).fill('benefit'));
    const resetTableData = Array.from({ length: rows }, () => Array(cols).fill(0));
    setTableData(resetTableData);
    setResults(null);
    onReset();
  };


  const handleCalculate = () => {
    if (
      tableData.some((row) => row.some((cell) => cell === 0)) ||
      weights.some((w) => w === 0)
    ) {
      alert("Please fill all input fields.");
      return;
    }
    if (!method) {
      alert("Please select a method.");
      return;
    }
    const calculationResults = {
      rows,
      cols,
      weights,
      types,
      values: tableData,
      
    };

    
    onCalculate(calculationResults);



  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const currentIndex = rowIndex * cols + colIndex;
    switch (e.key) {
      case "ArrowUp":
        if (rowIndex > 0) {
          (inputRefs.current[currentIndex - cols] as React.RefObject<HTMLInputElement>).current?.focus();
        }
        break;
      case "ArrowDown":
        if (rowIndex < rows - 1) {
          (inputRefs.current[currentIndex + cols] as React.RefObject<HTMLInputElement>).current?.focus();
        }
        break;
      case "ArrowLeft":
        if (colIndex > 0) {
          (inputRefs.current[currentIndex - 1] as React.RefObject<HTMLInputElement>).current?.focus();
        }
        break;
      case "ArrowRight":
        if (colIndex < cols - 1) {
          (inputRefs.current[currentIndex + 1] as React.RefObject<HTMLInputElement>).current?.focus();
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (tableData.some(row => row.some(cell => cell === 0)) || weights.some(w => w === 0)) {
      alert('Please fill all input fields before calculating.');
      return;
    }
    if (!method) {
      alert('Please select a method before calculating.');
      return;
    }
    onCalculate({
      rows,
      cols,
      weights,
      types,
      values: tableData
    });

  };

  return (
    <div className="space-y-4 flex flex-col">
      <table className="max-w-20">
        <tbody>
          <tr>
            <td className="text-left pr-2">Baris</td>
            <td className="pr-2">:</td>
            <td className="flex items-center space-x-4">
              <button
                onClick={decrementRows}
                disabled={rows <= 2}
                className={`px-2 py-1 rounded ${rows <= 2
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                  }`}
              >
                -
              </button>
              <span>{rows}</span>
              <button
                onClick={incrementRows}
                disabled={rows >= 15}
                className={`px-2 py-1 rounded ${rows >= 15
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                  }`}
              >
                +
              </button>
            </td>
          </tr>
          <tr>
            <td className="text-left pr-2">Kolom</td>
            <td className="pr-2">:</td>
            <td className="flex items-center space-x-4">
              <button
                onClick={decrementCols}
                disabled={cols <= 2}
                className={`px-2 py-1 rounded ${cols <= 2
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                  }`}
              >
                -
              </button>
              <span>{cols}</span>
              <button
                onClick={incrementCols}
                disabled={cols >= 15}
                className={`px-2 py-1 rounded ${cols >= 10
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                  }`}
              >
                +
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Weights and Types Table */}
      <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
          <tr>
            {/* Header for the "Criteria", "Type", and "Weight" */}
            <th className="px-7 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
              Kriteria
            </th>
            {Array(types.length)
              .fill(0)
              .map((_, index) => (
                <th
                  key={index}
                  className="px-6 py-3 border-r border-gray-200 dark:border-gray-700"
                >
                  C{index + 1}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {/* Row for Type selection */}
          <tr className="bg-gray-50 dark:bg-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
            <td className="px-7 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
              Tipe
            </td>
            {types.map((type, index) => (
              <td key={index} className="px-6 py-3">
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e, index)}
                  className="block w-full text-center bg-gray-100 dark:bg-gray-700 focus:outline-none"
                >
                  <option value="benefit">Keuntungan</option>
                  <option value="cost">Biaya</option>
                </select>
              </td>
            ))}
          </tr>

          {/* Row for Weight inputs */}
          <tr className="bg-gray-50 dark:bg-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
            <td className="px-7 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
              Bobot
            </td>
            {weights.map((weight, index) => (
              <td key={index} className="px-6 py-3">
                <input
                 ref={inputRefs.current[index]} 
                  type="number"
                  value={weight}
                  onChange={(e) => handleWeightChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, 0, index)}
                  className="block w-full text-center focus:outline-none bg-gray-100 dark:bg-gray-700"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>


      {/* Data Table */}
      <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
          <tr>
            {/* Kolom 'Data' akan mengambil 2 baris */}
            <th
              rowSpan={2}
              className="px-9 py-3 border-r border-gray-200 dark:border-gray-700"
            >
              Data
            </th>
            {/* Header pertama yang mengambil tempat untuk kriteria */}
            <th
              colSpan={cols}
              className="px-6 py-3 border-r border-gray-200 dark:border-gray-700"
            >
              Kriteria
            </th>
          </tr>
          <tr>
            {/* Header kedua dengan kolom-kolom kriteria seperti C1, C2, dst. */}
            {Array(cols)
              .fill(0)
              .map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="px-6 py-3 border-r border-gray-200 dark:border-gray-700"
                >
                  C{colIndex + 1}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Kolom 'A1', 'A2', dst. di sisi kiri */}
              <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-700">
                A{rowIndex + 1}
              </td>
              {/* Input data untuk setiap sel di kolom */}
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-6 py-2">
                  <input
                    ref= {(inputRefs.current[rowIndex * cols + colIndex])}
                    type="number"
                    value={tableData[rowIndex][colIndex]}
                    onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    className="block w-full text-center focus:outline-none bg-gray-100 dark:bg-gray-700"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


      <div className="flex justify-between">
        <button onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
          Hapus
          </button>
          <button onClick={handleCalculate} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
            Hitung
            </button>
            </div>
            </div>
  );
};

export default InputForm;