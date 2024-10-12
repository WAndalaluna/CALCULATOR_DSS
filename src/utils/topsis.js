// utils/topsis.js

export function calculateTOPSIS(input) {
    const { rows, cols, weights, types, values } = input;

    // Step 1: Input Data
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, weights, types, values },
        },
    ];

    // Step 2: Normalisasi Bobot
    const normalizedWeights = normalizeWeights(weights);
    steps.push({
        title: "Normalized Weights",
        data: normalizedWeights,
    });

    // Step 3: Normalisasi Matriks Keputusan
    const normalizedDecisionMatrix = normalizeDecisionMatrix(values);
    steps.push({
        title: "Normalized Decision Matrix",
        data: normalizedDecisionMatrix,
    });

    // Step 4: Matriks Keputusan Ternormalisasi dengan Bobot
    const weightedDecisionMatrix = applyWeights(normalizedDecisionMatrix, normalizedWeights);
    steps.push({
        title: "Weighted Decision Matrix",
        data: weightedDecisionMatrix,
    });

    // Step 5: Hitung Solusi Ideal Positif dan Negatif
    const { idealPositive, idealNegative } = calculateIdealSolutions(weightedDecisionMatrix, types);
    steps.push({
        title: "Ideal Solutions",
        data: { idealPositive, idealNegative },
    });

    // Step 6: Hitung Jarak ke Solusi Ideal Positif dan Negatif
    const distances = calculateDistances(weightedDecisionMatrix, idealPositive, idealNegative);
    steps.push({
        title: "Distances to Ideal Solutions",
        data: distances,
    });

    // Step 7: Hitung Nilai Preferensi (C)
    const preferenceValues = calculatePreferenceValues(distances);
    steps.push({
        title: "Preference Values",
        data: preferenceValues,
    });

    return {
        steps,
        result: preferenceValues,
    };
}

function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

function normalizeDecisionMatrix(values) {
    const columnSums = values[0].map((_, colIndex) => {
        return Math.sqrt(values.reduce((sum, row) => sum + Math.pow(row[colIndex], 2), 0));
    });

    return values.map(row => row.map((value, colIndex) => value / columnSums[colIndex]));
}

function applyWeights(normalizedDecisionMatrix, weights) {
    return normalizedDecisionMatrix.map(row => row.map((value, index) => value * weights[index]));
}

function calculateIdealSolutions(weightedDecisionMatrix, types) {
    const idealPositive = weightedDecisionMatrix[0].map((_, colIndex) => {
        return types[colIndex] === "benefit"
            ? Math.max(...weightedDecisionMatrix.map(row => row[colIndex]))
            : Math.min(...weightedDecisionMatrix.map(row => row[colIndex]));
    });

    const idealNegative = weightedDecisionMatrix[0].map((_, colIndex) => {
        return types[colIndex] === "benefit"
            ? Math.min(...weightedDecisionMatrix.map(row => row[colIndex]))
            : Math.max(...weightedDecisionMatrix.map(row => row[colIndex]));
    });

    return { idealPositive, idealNegative };
}

function calculateDistances(weightedDecisionMatrix, idealPositive, idealNegative) {
    const distanceToPositive = weightedDecisionMatrix.map(row => {
        return Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealPositive[index], 2), 0));
    });

    const distanceToNegative = weightedDecisionMatrix.map(row => {
        return Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealNegative[index], 2), 0));
    });

    return { distanceToPositive, distanceToNegative };
}

function calculatePreferenceValues(distances) {
    const { distanceToPositive, distanceToNegative } = distances;
    return distanceToNegative.map((dNeg, index) => {
        return dNeg / (dNeg + distanceToPositive[index]);
    }).map((value, index) => ({ index: index + 1, value }))
      .sort((a, b) => b.value - a.value) // Sort by preference value
      .map((item, rank) => ({ ...item, rank: rank + 1 })); // Assign ranks
}
