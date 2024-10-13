import React from 'react';

interface MethodSelectionProps {
  selectedMethod: 'saw' | 'wp' | 'topsis' | 'ahp';
  onSelectMethod: (method: 'saw' | 'wp' | 'topsis' | 'ahp') => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ selectedMethod, onSelectMethod }) => {
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'saw' | 'wp' | 'topsis' | 'ahp';
    onSelectMethod(value);
  };

  return (
    <div className="w-full px-5 my-4 bg-background">
      <div className='container mx-auto'>
        <MethodLabel />
        <MethodDropdown selectedMethod={selectedMethod} handleMethodChange={handleMethodChange} />
      </div>
    </div>
  );
};

const MethodLabel: React.FC = () => (
  <label className="block text-md font-bold text-black dark:text-gray-300 mb-2">
    Please choose the method:
  </label>
);

interface MethodDropdownProps {
  selectedMethod: 'saw' | 'wp' | 'topsis' | 'ahp';
  handleMethodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MethodDropdown: React.FC<MethodDropdownProps> = ({ selectedMethod, handleMethodChange }) => (
  <select
    value={selectedMethod}
    onChange={handleMethodChange}
    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
  >
    <option value="wp">Weighted Product (WP)</option>
    <option value="saw">Simple Additive Weighting (SAW)</option>
    <option value="topsis">TOPSIS</option>
    <option value="ahp">Analytic Hierarchy Process (AHP)</option>
  </select>
);

export default MethodSelection;