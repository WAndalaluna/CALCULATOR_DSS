import React from 'react';

interface MethodSelectionProps {
  selectedMethod: string; // Props untuk menerima metode yang dipilih
  onSelectMethod: (method: string) => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ selectedMethod, onSelectMethod }) => {
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectMethod(e.target.value); // Memanggil callback saat metode berubah
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Pilih Metode:
      </label>
      <select
        value={selectedMethod} // Gunakan selectedMethod dari props
        onChange={handleMethodChange}
        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500"
      >
        <option value="wp">Weighted Product (WP)</option>
        <option value="saw">Simple Additive Weighting (SAW)</option>
        <option value="topsis">TOPSIS</option>
        <option value="ahp">Analytic Hierarchy Process (AHP)</option>
      </select>
    </div>
  );
};

export default MethodSelection;
