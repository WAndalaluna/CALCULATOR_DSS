"use client";
import React from 'react';
import Table from './Table'; // Import the Table component
<<<<<<< HEAD
import { downloadResultsAsJSON, downloadResultsAsExcel } from '../utils/downloadUtils';
=======
import {downloadResultsAsJSON, downloadResultsAsExcel} from '../utils/downloadUtils';
>>>>>>> 01d86c89c059ae2932bb451d262c19b18c8de380

interface ResultProps {
  steps: { title: string; data: any }[];
}

const Result: React.FC<ResultProps> = ({ steps }) => {

  const renderStepData = (title: string, data: any) => {
    const tableHeaders: { [key: string]: string[] } = {
      "Normalized Weights": ["Criteria", "Weights"],
      "Normalized Matrix": ["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)],
      "Weighted Matrix": ["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)],
      "Weighted Sum": ["Item", "Value"],
      "Final Ranking": ["Item", "Value", "Rank"],
      "S Values": ["Item", "S Value"],
      "Normalized Decision Matrix": ["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)],
      "Weighted Decision Matrix": ["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)],
      "Ideal Solutions": ["Solution Type", ...data.idealPositive.map((_: any, index: number) => `C${index + 1}`)],
      "Distances to Ideal Solutions": ["Item", "Distance to Positive", "Distance to Negative"],
      "Preference Values": ["Item", "Value", "Rank"]
    };

    const tableData: { [key: string]: any[] } = {
      "Normalized Weights": data.map((weight: number, index: number) => [`C${index + 1}`, weight.toFixed(4)]),
      "Normalized Matrix": data.map((row: any, rowIndex: number) => [`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]),
      "Weighted Matrix": data.map((row: any, rowIndex: number) => [`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]),
      "Weighted Sum": data.map((value: number, index: number) => [`A${index + 1}`, value.toFixed(4)]),
      "Final Ranking": data.map((item: any) => [`A${item.index}`, item.value.toFixed(4), item.rank]),
      "S Values": data.map((value: number, index: number) => [`A${index + 1}`, value.toFixed(4)]),
      "Normalized Decision Matrix": data.map((row: any, rowIndex: number) => [`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]),
      "Weighted Decision Matrix": data.map((row: any, rowIndex: number) => [`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]),
      "Ideal Solutions": [
        ['Ideal Positive', ...data.idealPositive.map((val: number) => val.toFixed(4))],
        ['Ideal Negative', ...data.idealNegative.map((val: number) => val.toFixed(4))]
      ],
      "Distances to Ideal Solutions": data.distanceToPositive.map((distance: number, index: number) => [
        `A${index + 1}`, distance.toFixed(4), data.distanceToNegative[index].toFixed(4)
      ]),
      "Preference Values": data.map((item: any) => [`A${item.index}`, item.value.toFixed(4), item.rank])
    };

    if (title === "Input Data") {
      return <div></div>;
    }

    return (
      <Table
        headers={tableHeaders[title]}
        stepTitle={title}
        data={tableData[title]}
      />
    );
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Calculation Steps</h2>
      {steps.map((step, index) => (
        <div key={index} className="mb-6">
          {renderStepData(step.title, step.data)}
        </div>
      ))}
      <div className="flex mt-4">
        <button
          onClick={() => downloadResultsAsJSON(steps)}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Download as JSON
        </button>
        <button 
          onClick={() => downloadResultsAsExcel(steps)} 
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default Result;