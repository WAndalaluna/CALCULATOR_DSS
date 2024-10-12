import React, { useState, useEffect, useRef } from "react";

interface AHPInputFormProps {
  onCalculate: (data: {
    criteria: string[];
    alternatives: string[];
    pairwiseComparison: number[][];
  }) => void;
}

const AHPInputForm: React.FC<AHPInputFormProps> = ({ onCalculate }) => {
  const [numCriteria, setNumCriteria] = useState(2);
  const [numAlternatives, setNumAlternatives] = useState(2);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [pairwiseComparison, setPairwiseComparison] = useState<number[][]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Explicit typing

  useEffect(() => {
    generateCriteria();
    generateAlternatives();
    generatePairwiseComparison();
  }, [numCriteria, numAlternatives]);

  const generateCriteria = () => {
    const newCriteria = Array(numCriteria).fill("");
    setCriteria(newCriteria);
  };

  const generateAlternatives = () => {
    const newAlternatives = Array(numAlternatives).fill("");
    setAlternatives(newAlternatives);
  };

  const generatePairwiseComparison = () => {
    const newComparison = Array(numCriteria)
      .fill(0)
      .map(() => Array(numCriteria).fill(1));
    setPairwiseComparison(newComparison);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCriteria = [...criteria];
    newCriteria[index] = e.target.value;
    setCriteria(newCriteria);
  };

  const handleAlternativesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = e.target.value;
    setAlternatives(newAlternatives);
  };

  const handlePairwiseComparisonChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newComparison = [...pairwiseComparison];
    newComparison[rowIndex][colIndex] = Number(e.target.value);
    setPairwiseComparison(newComparison);
  };

  const handleReset = () => {
    generateCriteria();
    generateAlternatives();
    generatePairwiseComparison();
  };

  const handleCalculate = () => {
    if (criteria.some(c => c === "") || alternatives.some(a => a === "")) {
      alert("Please fill all input fields before calculating.");
      return;
    }
    onCalculate({
      criteria,
      alternatives,
      pairwiseComparison,
    });
  };

  return (
    <div className="space-y-4 flex flex-col">
      {/* Criteria Input */}
      <div>
        <h2 className="text-lg font-semibold">Criteria</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setNumCriteria(Math.max(2, numCriteria - 1))}
            className={`px-2 py-1 rounded ${
              numCriteria <= 2 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            -
          </button>
          <span>{numCriteria}</span>
          <button
            onClick={() => setNumCriteria(Math.min(10, numCriteria + 1))}
            className={`px-2 py-1 rounded ${
              numCriteria >= 10 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            +
          </button>
        </div>
        {criteria.map((c, index) => (
          <input
            key={index}
            type="text"
            value={c}
            onChange={(e) => handleCriteriaChange(e, index)}
            placeholder={`Criterion ${index + 1}`}
            className="block w-full mt-2 p-2 bg-gray-700 text-white focus:outline-none"
          />
        ))}
      </div>

      {/* Alternatives Input */}
      <div>
        <h2 className="text-lg font-semibold">Alternatives</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setNumAlternatives(Math.max(2, numAlternatives - 1))}
            className={`px-2 py-1 rounded ${
              numAlternatives <= 2 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            -
          </button>
          <span>{numAlternatives}</span>
          <button
            onClick={() => setNumAlternatives(Math.min(10, numAlternatives + 1))}
            className={`px-2 py-1 rounded ${
              numAlternatives >= 10 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            +
          </button>
        </div>
        {alternatives.map((a, index) => (
          <input
            key={index}
            type="text"
            value={a}
            onChange={(e) => handleAlternativesChange(e, index)}
            placeholder={`Alternative ${index + 1}`}
            className="block w-full mt-2 p-2 bg-gray-700 text-white focus:outline-none"
          />
        ))}
      </div>

      {/* Pairwise Comparison Table */}
      <div>
        <h2 className="text-lg font-semibold">Pairwise Comparison</h2>
        <table className="min-w-full text-sm text-gray-400 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2">Criteria</th>
              {criteria.map((c, index) => (
                <th key={index} className="px-4 py-2">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairwiseComparison.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2">{criteria[rowIndex]}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <input
                      type="number"
                      value={cell}
                      onChange={(e) => handlePairwiseComparisonChange(e, rowIndex, colIndex)}
                      className="w-full bg-gray-700 text-white focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
        <button
          onClick={handleCalculate}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default AHPInputForm;
