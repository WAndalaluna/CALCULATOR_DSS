import React from "react";

// Define the props interface
interface TableProps {
  headers?: string[]; // Optional headers prop
  data?: any[][]; // Optional data prop
  stepTitle?: string; // Optional step title prop
}

const Table: React.FC<TableProps> = ({ headers = [], data = [], stepTitle }) => {
  return (
    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 text-center divide-x divide-gray-300 dark:divide-gray-600">
      <thead>
        {/* Baris pertama untuk judul langkah */}
        {stepTitle && (
          <tr>
            <th colSpan={headers.length} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 font-semibold">
              {stepTitle}
            </th>
          </tr>
        )}
        {/* Baris kedua untuk header kolom */}
        <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 uppercase tracking-wide text-xs divide-x divide-gray-300 dark:divide-gray-600">
          {headers.length > 0 ? (
            headers.map((header, index) => (
              <th key={index} className="px-6 py-3 bg-gray-100 dark:bg-gray-800"> {/* Background hanya di header */}
                {header}
              </th>
            ))
          ) : (
            <th className="px-6 py-3">No headers provided</th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
        {/* Render table data */}
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="divide-x divide-gray-300 dark:divide-gray-600"> {/* Tidak ada background di baris data */}
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-6 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-6 py-3" colSpan={headers.length || 1}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
