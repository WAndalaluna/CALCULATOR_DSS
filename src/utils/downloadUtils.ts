import * as XLSX from 'xlsx';
  
  // Fungsi untuk download dalam format JSON
  export const downloadResultsAsJSON = (steps: { title: string; data: any }[]) => {
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(steps, null, 2));
  
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", "calculation_results.json");
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
  };
  
export const downloadResultsAsExcel = (steps: { title: string; data: any }[]) => {
  const workbook = XLSX.utils.book_new(); 

  steps.forEach((step) => {
      const sheetData: any[] = []; 

      if (step.title === "Input Data" && typeof step.data === "object") {
          const { rows, cols, weights, types, values } = step.data;

          sheetData.push(["Parameter", "Value"]);
          sheetData.push(["Rows", rows]);
          sheetData.push(["Cols", cols]);

          const weightHeaders = Array.from({ length: cols }, (_, i) => `C${i + 1}`);
          sheetData.push([], ["Weights"], weightHeaders, weights);

          sheetData.push([], ["Types"], weightHeaders, types);

          sheetData.push([], ["Values"]);
          sheetData.push(["", ...weightHeaders]); 
          values.forEach((row: number[], index: number) => {
              sheetData.push([`A${index + 1}`, ...row]); 
          });

      } else if (step.title === "Normalized Weights") {
          sheetData.push(["Criteria", "Weights"]);
          step.data.forEach((weight: number, index: number) => {
              sheetData.push([`C${index + 1}`, weight.toFixed(4)]);
          });

      } else if (step.title === "Normalized Matrix" || step.title === "Weighted Matrix") {
          const headers = ["Item", ...step.data[0].map((_: any, index: number) => `C${index + 1}`)];
          sheetData.push(headers);
          step.data.forEach((row: any, rowIndex: number) => {
              sheetData.push([`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]);
          });

      } else if (step.title === "Weighted Sum") {
          sheetData.push(["Item", "Value"]);
          step.data.forEach((value: number, index: number) => {
              sheetData.push([`A${index + 1}`, value.toFixed(4)]);
          });

      } else if (step.title === "Final Ranking") {
          sheetData.push(["Item", "Value", "Rank"]);
          step.data.forEach((item: any) => {
              sheetData.push([`A${item.index}`, item.value.toFixed(4), item.rank]);
          });

      } else if (step.title === "S Values") {
          sheetData.push(["Item", "S Value"]);
          step.data.forEach((value: number, index: number) => {
              sheetData.push([`A${index + 1}`, value.toFixed(4)]);
          });

      } else if (step.title === "Normalized Decision Matrix") {
          const headers = ["Item", ...step.data[0].map((_: any, index: number) => `C${index + 1}`)];
          sheetData.push(headers);
          step.data.forEach((row: any, rowIndex: number) => {
              sheetData.push([`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]);
          });

      } else if (step.title === "Weighted Decision Matrix") {
          const headers = ["Item", ...step.data[0].map((_: any, index: number) => `C${index + 1}`)];
          sheetData.push(headers);
          step.data.forEach((row: any, rowIndex: number) => {
              sheetData.push([`A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))]);
          });

      } else if (step.title === "Ideal Solutions") {
          sheetData.push(["Solution Type", ...step.data.idealPositive.map((_: any, index: number) => `C${index + 1}`)]);
          sheetData.push(["Ideal Positive", ...step.data.idealPositive.map((val: number) => val.toFixed(4))]);
          sheetData.push(["Ideal Negative", ...step.data.idealNegative.map((val: number) => val.toFixed(4))]);

      } else if (step.title === "Distances to Ideal Solutions") {
          sheetData.push(["Item", "Distance to Positive", "Distance to Negative"]);
          step.data.distanceToPositive.forEach((distance: number, index: number) => {
              sheetData.push([`A${index + 1}`, distance.toFixed(4), step.data.distanceToNegative[index].toFixed(4)]);
          });

      } else if (step.title === "Preference Values") {
          sheetData.push(["Item", "Value", "Rank"]);
          step.data.forEach((item: any) => {
              sheetData.push([`A${item.index}`, item.value.toFixed(4), item.rank]);
          });

      } else {
          sheetData.push([`No data available for ${step.title}`]);
      }

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, step.title);
  });

  XLSX.writeFile(workbook, "calculation_results.xlsx");
};

