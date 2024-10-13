"use client";
import React from 'react';
import Table from './Table'; // Import the Table component
import {downloadResultsAsJSON, downloadResultsAsExcel} from '../utils/downloadUtils';

interface ResultProps {
  steps: { title: string; data: any }[];
}

const Result: React.FC<ResultProps> = ({ steps }) => {

  // Fungsi untuk merender tabel sesuai langkah
  const renderStepData = (title: string, data: any) => {
    switch (title) {
      case "Input Data":
        return <div></div>;

      case "Normalized Weights":
        return (
          <Table
            headers={["Criteria", "Weights"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((weight: number, index: number) => [
              `C${index + 1}`, weight.toFixed(4)
            ])}
          />
        );

      case "Normalized Matrix":
        return (
          <Table
            headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((row: any, rowIndex: number) => [
              `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
            ])}
          />
        );
        case "Weighted Matrix":
        return (
          <Table
            headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((row: any, rowIndex: number) => [
              `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
            ])}
          />
        );
      case "Weighted Sum":
        return (
          <Table
            headers={["Item", "Value"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((value: number, index: number) => [
              `A${index + 1}`, value.toFixed(4)
            ])}
          />
        );

      case "Final Ranking":
        return (
          <Table
            headers={["Item", "Value", "Rank"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((item: any) => [
              `A${item.index}`, item.value.toFixed(4), item.rank
            ])}
          />
        );
      case "S Values":
        return (
          <Table
            headers={["Item", "S Value"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((value: number, index: number) => [
              `A${index + 1}`, value.toFixed(4)
            ])}
          />
        );
        case "Normalized Decision Matrix":
          return (
            <Table
              headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
              stepTitle={title} // Adding step title
              data={data.map((row: any, rowIndex: number) => [
                `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
              ])}
            />
          );
  
        case "Weighted Decision Matrix":
          return (
            <Table
              headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
              stepTitle={title} // Adding step title
              data={data.map((row: any, rowIndex: number) => [
                `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
              ])}
            />
          );
  
        case "Ideal Solutions":
          return (
            <Table
              headers={["Solution Type", ...data.idealPositive.map((_: any, index: number) => `C${index + 1}`)]}
              stepTitle={title} // Adding step title
              data={[
                ['Ideal Positive', ...data.idealPositive.map((val: number) => val.toFixed(4))],
                ['Ideal Negative', ...data.idealNegative.map((val: number) => val.toFixed(4))]
              ]}
            />
          );
  
        case "Distances to Ideal Solutions":
          return (
            <Table
              headers={["Item", "Distance to Positive", "Distance to Negative"]}
              stepTitle={title} // Adding step title
              data={data.distanceToPositive.map((distance: number, index: number) => [
                `A${index + 1}`, distance.toFixed(4), data.distanceToNegative[index].toFixed(4)
              ])}
            />
          );
  
        case "Preference Values":
          return (
            <Table
              headers={["Item", "Value", "Rank"]}
              stepTitle={title} // Adding step title
              data={data.map((item: any) => [
                `A${item.index}`, item.value.toFixed(4), item.rank
              ])}
            />
          );
  
        default:
          return <div>No data available</div>;
      }
    };

    return (
      <div className="mt-4">
        <div className='container mx-auto px-5'>
        <h2 className="text-xl font-bold mb-4">Calculation Steps</h2>
        {steps.map((step, index) => (
          <div key={index} className="mb-6">
            {renderStepData(step.title, step.data)}
          </div>
        ))}
        <button
          onClick={() => downloadResultsAsJSON(steps)}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Download as JSON
        </button>
        <button 
          onClick={() => downloadResultsAsExcel(steps)} 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Download as Excel
        </button>
        </div>
      </div>
    );
};

export default Result;
