"use client"; // Pastikan ini berada di atas
import React, { useState } from 'react';
import InputForm from '../components/Input'; // Komponen InputForm umum
import AHPInputForm from '../components/AhpInput'; // Import komponen AHPInputForm
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';

const MainPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'saw' | 'wp' | 'topsis' | 'ahp'>('wp'); // Metode default
  const [weights, setWeights] = useState<number[]>([50, 50]); // Bobot default
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']); // Tipe default (benefit)
  const [tableData, setTableData] = useState<number[][]>([]); // Data tabel alternatif
  const [shouldCalculate, setShouldCalculate] = useState(false); // Pemicu untuk kalkulasi

  // State untuk menyimpan perbandingan kriteria dan alternatif untuk AHP
  const [criteriaComparison, setCriteriaComparison] = useState<number[][] | undefined>(undefined);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][] | undefined>(undefined);

  // Fungsi untuk menangani pemilihan metode
  const handleMethodSelect = (method: 'saw' | 'wp' | 'topsis' | 'ahp') => {
    setSelectedMethod(method);
    resetData();
  };

  // Fungsi untuk mereset data
  const resetData = () => {
    setTableData([]); // Reset data tabel
    setShouldCalculate(false); // Reset pemicu kalkulasi
    setCriteriaComparison(undefined); // Reset perbandingan kriteria
    setAlternativesComparison(undefined); // Reset perbandingan alternatif
  };

  // Fungsi untuk menangani pengiriman data dari InputForm
  const handleFormSubmit = (data: {
    rows: number;
    cols: number;
    weights: number[];
    types: string[];
    values: number[][]; // Format data input
  }) => {
    setWeights(data.weights);
    setTypes(data.types);
    setTableData(data.values);
    setShouldCalculate(true); // Pemicu kalkulasi
  };

  // Fungsi untuk menangani pengiriman data dari AHPInputForm
  const handleAHPFormSubmit = (data: {
    criteria: number[]; // Tipe kriteria valid
    alternatives: number[]; // Tipe alternatif valid
    criteriaComparison: number[][]; // Matriks perbandingan kriteria
    alternativesComparison: number[][][]; // Matriks perbandingan alternatif
  }) => {
    setWeights(Array(data.alternatives.length).fill(1)); // Bobot awal
    setTypes(Array(data.alternatives.length).fill('benefit')); // Anggap semua alternatif adalah 'benefit'
    setTableData([data.alternatives]); // Simpan alternatif
    setCriteriaComparison(data.criteriaComparison); // Set perbandingan kriteria
    setAlternativesComparison(data.alternativesComparison); // Set perbandingan alternatif
    setShouldCalculate(true); // Pemicu kalkulasi
  };

  // Fungsi untuk mereset input, menjaga state AHP
  const handleReset = () => {
    console.log("Mereset input..."); // Log untuk debugging
    if (selectedMethod === 'ahp') {
      console.log("Mereset perbandingan AHP..."); // Log untuk debugging
      setCriteriaComparison(undefined); // Reset perbandingan kriteria
      setAlternativesComparison(undefined); // Reset perbandingan alternatif
    } else {
      console.log("Mereset input lainnya..."); // Log untuk debugging
      setWeights([50, 50]); // Reset bobot ke default
      setTypes(['benefit', 'benefit']); // Reset tipe ke default
      setTableData([]); // Reset data tabel
    }
    setShouldCalculate(false); // Reset pemicu kalkulasi
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Komponen Method Selection dengan judul "Choose Method" yang diformat hitam dan bold */}
      <MethodSelection 
        onSelectMethod={handleMethodSelect} 
        selectedMethod={selectedMethod}
      />

      {/* Render InputForm atau AHPInputForm berdasarkan metode yang dipilih */}
      {selectedMethod === 'ahp' ? (
        <AHPInputForm onCalculate={handleAHPFormSubmit} onReset={handleReset} />
      ) : (
        <InputForm onCalculate={handleFormSubmit} onReset={handleReset} method={selectedMethod} />
      )}

      {/* Render komponen Calculator jika data tabel valid dan pemicu kalkulasi aktif */}
      {shouldCalculate && tableData.length > 0 && tableData[0].length > 0 && (
        <Calculator 
          tableData={tableData} 
          weights={weights} 
          types={types} 
          method={selectedMethod} 
          criteriaComparison={criteriaComparison} 
          alternativesComparison={alternativesComparison} 
        />
      )}
    </div>
  );
};

export default MainPage;