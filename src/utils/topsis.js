// utils/topsis.js

// Fungsi utama untuk menghitung TOPSIS
export function calculateTOPSIS(input) {
    const { rows, cols, weights, types, values } = input;

    // Langkah 1: Input Data
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, weights, types, values },
        },
    ];

    // Langkah 2: Normalisasi Bobot
    const normalizedWeights = normalizeWeights(weights);
    steps.push({
        title: "Normalized Weights",
        data: normalizedWeights,
    });

    // Langkah 3: Normalisasi Matriks Keputusan
    const normalizedDecisionMatrix = normalizeDecisionMatrix(values);
    steps.push({
        title: "Normalized Decision Matrix",
        data: normalizedDecisionMatrix,
    });

    // Langkah 4: Matriks Keputusan Ternormalisasi dengan Bobot
    const weightedDecisionMatrix = applyWeights(normalizedDecisionMatrix, normalizedWeights);
    steps.push({
        title: "Weighted Decision Matrix",
        data: weightedDecisionMatrix,
    });

    // Langkah 5: Hitung Solusi Ideal Positif dan Negatif
    const { idealPositive, idealNegative } = calculateIdealSolutions(weightedDecisionMatrix, types);
    steps.push({
        title: "Ideal Solutions",
        data: { idealPositive, idealNegative },
    });

    // Langkah 6: Hitung Jarak ke Solusi Ideal Positif dan Negatif
    const distances = calculateDistances(weightedDecisionMatrix, idealPositive, idealNegative);
    steps.push({
        title: "Distances to Ideal Solutions",
        data: distances,
    });

    // Langkah 7: Hitung Nilai Preferensi (C)
    const preferenceValues = calculatePreferenceValues(distances);
    steps.push({
        title: "Preference Values",
        data: preferenceValues,
    });

    // Mengembalikan langkah-langkah proses dan hasil akhir
    return {
        steps,
        result: preferenceValues,
    };
}

// Fungsi untuk normalisasi bobot
function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

// Fungsi untuk normalisasi matriks keputusan
function normalizeDecisionMatrix(values) {
    const columnSums = values[0].map((_, colIndex) => 
        Math.sqrt(values.reduce((sum, row) => sum + Math.pow(row[colIndex], 2), 0))
    );

    return values.map(row => row.map((value, colIndex) => value / columnSums[colIndex]));
}

// Fungsi untuk menerapkan bobot pada matriks keputusan
function applyWeights(normalizedDecisionMatrix, weights) {
    return normalizedDecisionMatrix.map(row => 
        row.map((value, index) => value * weights[index])
    );
}

// Fungsi untuk menghitung solusi ideal positif dan negatif
function calculateIdealSolutions(weightedDecisionMatrix, types) {
    const idealPositive = weightedDecisionMatrix[0].map((_, colIndex) => 
        types[colIndex] === "benefit"
            ? Math.max(...weightedDecisionMatrix.map(row => row[colIndex]))
            : Math.min(...weightedDecisionMatrix.map(row => row[colIndex]))
    );

    const idealNegative = weightedDecisionMatrix[0].map((_, colIndex) => 
        types[colIndex] === "benefit"
            ? Math.min(...weightedDecisionMatrix.map(row => row[colIndex]))
            : Math.max(...weightedDecisionMatrix.map(row => row[colIndex]))
    );

    return { idealPositive, idealNegative };
}

// Fungsi untuk menghitung jarak ke solusi ideal
function calculateDistances(weightedDecisionMatrix, idealPositive, idealNegative) {
    const distanceToPositive = weightedDecisionMatrix.map(row => 
        Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealPositive[index], 2), 0))
    );

    const distanceToNegative = weightedDecisionMatrix.map(row => 
        Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealNegative[index], 2), 0))
    );

    return { distanceToPositive, distanceToNegative };
}

// Fungsi untuk menghitung nilai preferensi dan mengurutkan peringkat
function calculatePreferenceValues(distances) {
    const { distanceToPositive, distanceToNegative } = distances;
    return distanceToNegative.map((dNeg, index) => 
        dNeg / (dNeg + distanceToPositive[index])
    ).map((value, index) => ({ index: index + 1, value }))
      .sort((a, b) => b.value - a.value) // Urutkan berdasarkan nilai preferensi
      .map((item, rank) => ({ ...item, rank: rank + 1 })); // Tetapkan peringkat
}
