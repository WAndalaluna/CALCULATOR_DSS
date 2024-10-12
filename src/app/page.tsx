"use client";
import React, { useState } from 'react';
import InputForm from '../components/Input'; // General InputForm
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';

const MainPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('wp'); // Ubah ke 'SAW' sebagai default
  const [weights, setWeights] = useState<number[]>([50, 50]);
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']);
  const [tableData, setTableData] = useState<number[][]>([]);
  const [shouldCalculate, setShouldCalculate] = useState(false); // New state for calculation trigger

  // Handle method selection change
  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setTableData([]); // Reset table data when method changes
    setShouldCalculate(false); // Reset calculation trigger when method changes
  };

  // Handle form submission with rows, columns, weights, types, and values
  const handleFormSubmit = (data: {
    rows: number;
    cols: number;
    weights: number[];
    types: string[];
    values: number[][];
  }) => {
    setWeights(data.weights); // Set weights
    setTypes(data.types); // Set types (benefit/cost)
    setTableData(data.values); // Set table data
    setShouldCalculate(true); // Trigger calculation after data submission
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Decision Support System (DSS)</h1>

      {/* Method Selection Component */}
      <MethodSelection onSelectMethod={handleMethodSelect} selectedMethod={selectedMethod} />

      {/* InputForm based on selected method */}
      <InputForm onCalculate={handleFormSubmit} method={selectedMethod} />

      {/* Render Calculator Component if valid table data and the calculate trigger is true */}
      {shouldCalculate && tableData.length > 0 && tableData[0].length > 0 && (
        <Calculator tableData={tableData} weights={weights} types={types} method={selectedMethod} />
      )}

      {/* Display input table data for debugging or interim results */}
      {tableData.length > 0 && tableData[0].length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Data yang Diinput</h2>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MainPage;
