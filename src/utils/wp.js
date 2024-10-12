// utils/wp.js

export function calculateWP(input) {
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

    // Step 3: Hitung Pangkat (Pemberian Bobot)
    const weightedMatrix = calculateWeightedMatrix(values, normalizedWeights, types);
    steps.push({
        title: "Weighted Matrix",
        data: weightedMatrix,
    });

    // Step 4: Hitung Nilai S
    const SValues = calculateSValues(weightedMatrix);
    steps.push({
        title: "S Values",
        data: SValues,
    });

    // Step 5: Hitung Nilai V (Ranking)
    const VValues = calculateVValues(SValues);
    steps.push({
        title: "Final Ranking",
        data: VValues,
    });

    return {
        steps,
        result: VValues,
    };
}

function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

function calculateWeightedMatrix(values, weights, types) {
    return values.map(row =>
        row.map((val, j) => {
            // Benefit -> pangkat positif, Cost -> pangkat negatif
            const exponent = types[j] === "benefit" ? weights[j] : -weights[j];
            return Math.pow(val, exponent);
        })
    );
}

function calculateSValues(weightedMatrix) {
    return weightedMatrix.map(row =>
        row.reduce((product, val) => product * val, 1) // Menghitung S = perkalian tiap baris
    );
}

function calculateVValues(SValues) {
    const totalS = SValues.reduce((a, b) => a + b, 0);
    return SValues
        .map((s, i) => ({ index: i + 1, value: s / totalS })) // V = S / ΣS
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}
