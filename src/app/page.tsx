"use client"; // Pastikan ini ada di bagian paling atas
import React, { useState } from 'react';
import InputForm from '../components/Input'; // Komponen InputForm umum
import AHPInputForm from '../components/AhpInput'; // Import AHPInputForm
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';

const MainPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'saw' | 'wp' | 'topsis' | 'ahp'>('wp'); // Metode default
  const [weights, setWeights] = useState<number[]>([50, 50]); // Bobot default
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']); // Tipe default
  const [tableData, setTableData] = useState<number[][]>([]); // Data tabel alternatif
  const [shouldCalculate, setShouldCalculate] = useState(false); // State untuk pemicu perhitungan

  // State untuk menyimpan perbandingan kriteria dan alternatif untuk AHP
  const [criteriaComparison, setCriteriaComparison] = useState<number[][] | undefined>(undefined);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][] | undefined>(undefined);

  // Fungsi untuk menangani pemilihan metode
  const handleMethodSelect = (method: 'saw' | 'wp' | 'topsis' | 'ahp') => {
    setSelectedMethod(method);
    setTableData([]); // Reset data tabel saat metode berubah
    setShouldCalculate(false); // Reset pemicu perhitungan saat metode berubah
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
    setShouldCalculate(true); // Set pemicu perhitungan ke true
  };

  // Fungsi untuk menangani pengiriman data dari AHPInputForm
  const handleAHPFormSubmit = (data: {
    criteria: number[][]; // Tipe kriteria yang benar
    alternatives: number[][][]; // Tipe alternatif yang benar
    criteriaComparison: number[][]; // Matriks perbandingan kriteria
    alternativesComparison: number[][][]; // Matriks perbandingan alternatif
  }) => {
    setWeights(Array(data.alternatives.length).fill(1)); // Bobot awal
    setTypes(Array(data.alternatives.length).fill('benefit')); // Asumsi semua alternatif adalah 'benefit'
  
    // Set tableData dengan data alternatif
    setTableData(data.alternatives[0]); // Ambil alternatif dari index pertama untuk ditampilkan
    setCriteriaComparison(data.criteriaComparison); // Set perbandingan kriteria
    setAlternativesComparison(data.alternativesComparison); // Set perbandingan alternatif
    setShouldCalculate(true); // Set pemicu perhitungan ke true
  };

  // Fungsi untuk mereset semua input
  const handleReset = () => {
    setWeights([50, 50]); // Reset bobot ke nilai default
    setTypes(['benefit', 'benefit']); // Reset tipe ke nilai default
    setTableData([]); // Reset data tabel
    setShouldCalculate(false); // Reset pemicu perhitungan
    setCriteriaComparison(undefined); // Reset perbandingan kriteria
    setAlternativesComparison(undefined); // Reset perbandingan alternatif
  };

  return (
    <div className="container mx-auto p-4">
      {/* Kotak untuk Judul */}
      <div className="border p-4 rounded-lg shadow-lg mb-4 text-center bg-gray-500 text-white">
        <h1 className="text-2xl font-bold px-4 py-2">Kalkulator Pengambil Keputusan Multikriteria</h1>
      </div>
  
      {/* Komponen Pemilihan Metode */}
      <MethodSelection onSelectMethod={handleMethodSelect} selectedMethod={selectedMethod} />
  
      {/* Render InputForm atau AHPInputForm berdasarkan metode yang dipilih */}
      {selectedMethod === 'ahp' ? (
        <AHPInputForm onCalculate={handleAHPFormSubmit} />
      ) : (
        <InputForm onCalculate={handleFormSubmit} onReset={handleReset} method={selectedMethod} />
      )}
  
      {/* Render Komponen Calculator jika data tabel valid dan pemicu perhitungan true */}
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
