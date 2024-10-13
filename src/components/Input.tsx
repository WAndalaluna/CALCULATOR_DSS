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
  const [results, setResults] = useState(null);

  useEffect(() => {
    generateTable();
  }, [rows, cols]);

  const generateTable = () => {
    const newTableData = Array.from({ length: rows }, (_, rowIndex) => {
      return Array.from({ length: cols }, (_, colIndex) => {
        return tableData[rowIndex] && tableData[rowIndex][colIndex] !== undefined
          ? tableData[rowIndex][colIndex]
          : 0;
      });
    });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const value = Number(e.target.value);
    if (value < 0) {
      alert("Values cannot be negative");
      return;
    }
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    if (value < 0) {
      alert("Weights cannot be negative");
      return;
    }
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
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
    if (tableData.some(row => row.some(cell => cell === 0)) || weights.some(w => w === 0)) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
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

  const incrementRows = () => setRows(rows + 1);
  const decrementRows = () => rows > 2 && setRows(rows - 1);
  const incrementCols = () => setCols(cols + 1);
  const decrementCols = () => cols > 2 && setCols(cols - 1);

  return (
    <div className="space-y-4 flex flex-col px-5">
      <div className='w-full container mx-auto'>
        <TableControls
          rows={rows}
          cols={cols}
          incrementRows={incrementRows}
          decrementRows={decrementRows}
          incrementCols={incrementCols}
          decrementCols={decrementCols}
        />
        <WeightsAndTypesTable
          types={types}
          weights={weights}
          handleTypeChange={handleTypeChange}
          handleWeightChange={handleWeightChange}
          inputRefs={inputRefs.current as React.RefObject<HTMLInputElement>[]}
          handleKeyDown={handleKeyDown}
        />
        <DataTable
          tableData={tableData}
          cols={cols}
          handleInputChange={handleInputChange}
          inputRefs={inputRefs.current as React.RefObject<HTMLInputElement>[]}
          handleKeyDown={handleKeyDown}
        />
        <div className="flex justify mt-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md focus:outline-none mr-4"
          >
            Reset
          </button>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};

const TableControls: React.FC<{
  rows: number;
  cols: number;
  incrementRows: () => void;
  decrementRows: () => void;
  incrementCols: () => void;
  decrementCols: () => void;
}> = ({ rows, cols, incrementRows, decrementRows, incrementCols, decrementCols }) => (
  <table className="max-w-20 mb-4">
    <tbody>
      <tr>
        <td className="text-left pr-2">Rows</td>
        <td className="pr-2">:</td>
        <td className="flex items-center space-x-4">
          <button
            onClick={decrementRows}
            disabled={rows <= 2}
            className={`px-2 py-1 rounded ${rows <= 2 ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            -
          </button>
          <span>{rows}</span>
          <button
            onClick={incrementRows}
            disabled={rows >= 15}
            className={`px-2 py-1 rounded ${rows >= 15 ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            +
          </button>
        </td>
      </tr>
      <tr>
        <td className="text-left pr-2">Columns</td>
        <td className="pr-2">:</td>
        <td className="flex items-center space-x-4">
          <button
            onClick={decrementCols}
            disabled={cols <= 2}
            className={`px-2 py-1 rounded ${cols <= 2 ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            -
          </button>
          <span>{cols}</span>
          <button
            onClick={incrementCols}
            disabled={cols >= 15}
            className={`px-2 py-1 rounded ${cols >= 10 ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            +
          </button>
        </td>
      </tr>
    </tbody>
  </table>
);

const WeightsAndTypesTable: React.FC<{
  types: string[];
  weights: number[];
  handleTypeChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  inputRefs: React.RefObject<HTMLInputElement>[];
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => void;
}> = ({ types, weights, handleTypeChange, handleWeightChange, inputRefs, handleKeyDown }) => (
  <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
      <tr>
        <th className="px-7 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">Criteria</th>
        {Array(types.length).fill(0).map((_, index) => (
          <th key={index} className="px-6 py-3 border-r border-gray-200 dark:border-gray-700">C{index + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      <tr className="bg-gray-50 dark:bg-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
        <td className="px-7 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">Type</td>
        {types.map((type, index) => (
          <td key={index} className="px-6 py-3">
            <select
              value={type}
              onChange={(e) => handleTypeChange(e, index)}
              className="block w-full text-center bg-gray-100 dark:bg-gray-700 focus:outline-none"
            >
              <option value="benefit">Benefit</option>
              <option value="cost">Cost</option>
            </select>
          </td>
        ))}
      </tr>
      <tr className="bg-gray-50 dark:bg-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
        <td className="px-7 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">Weight</td>
        {weights.map((weight, index) => (
          <td key={index} className="px-6 py-3">
            <input
              ref={inputRefs[index]}
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
);

const DataTable: React.FC<{
  tableData: number[][];
  cols: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => void;
  inputRefs: React.RefObject<HTMLInputElement>[];
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => void;
}> = ({ tableData, cols, handleInputChange, inputRefs, handleKeyDown }) => (
  <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
      <tr>
        <th rowSpan={2} className="px-9 py-3 border-r border-gray-200 dark:border-gray-700">Data</th>
        <th colSpan={cols} className="px-6 py-3 border-r border-gray-200 dark:border-gray-700">Criteria</th>
      </tr>
      <tr>
        {Array(cols).fill(0).map((_, colIndex) => (
          <th key={colIndex} className="px-6 py-3 border-r border-gray-200 dark:border-gray-700">C{colIndex + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {tableData.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-700">A{rowIndex + 1}</td>
          {row.map((cell, colIndex) => (
            <td key={colIndex} className="px-6 py-2">
              <input
                ref={inputRefs[rowIndex * cols + colIndex]}
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
);

export default InputForm;