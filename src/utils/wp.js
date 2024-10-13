// utils/wp.js

// Fungsi utama untuk menghitung Weighted Product (WP)
export function calculateWP(input) {
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

    // Langkah 3: Hitung Matriks Tertimbang
    const weightedMatrix = applyWeightsToValues(values, normalizedWeights, types);
    steps.push({
        title: "Weighted Matrix",
        data: weightedMatrix,
    });

    // Langkah 4: Hitung Nilai S
    const SValues = calculateSValues(weightedMatrix);
    steps.push({
        title: "S Values",
        data: SValues,
    });

    // Langkah 5: Hitung Nilai V (Peringkat)
    const VValues = calculateVValues(SValues);
    steps.push({
        title: "Final Ranking",
        data: VValues,
    });

    // Mengembalikan langkah-langkah proses dan hasil akhir
    return {
        steps,
        result: VValues,
    };
}

// Fungsi untuk normalisasi bobot
function normalizeWeights(weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    return weights.map(weight => weight / totalWeight);
}

// Fungsi untuk menghitung matriks tertimbang berdasarkan tipe kriteria (benefit atau cost)
function applyWeightsToValues(values, weights, types) {
    return values.map(row =>
        row.map((val, idx) => {
            const exponent = types[idx] === "benefit" ? weights[idx] : -weights[idx];
            return Math.pow(val, exponent);
        })
    );
}

// Fungsi untuk menghitung nilai S sebagai hasil perkalian tiap nilai dalam satu baris
function calculateSValues(weightedMatrix) {
    return weightedMatrix.map(row => 
        row.reduce((product, val) => product * val, 1) // Perkalian semua nilai dalam satu baris
    );
}

// Fungsi untuk menghitung nilai V dan mengurutkannya berdasarkan ranking
function calculateVValues(SValues) {
    const totalS = SValues.reduce((acc, s) => acc + s, 0);
    return SValues
        .map((s, idx) => ({ index: idx + 1, value: s / totalS })) // Normalisasi nilai S
        .sort((a, b) => b.value - a.value) // Urutkan dari nilai terbesar ke terkecil
        .map((item, idx) => ({ ...item, rank: idx + 1 })); // Tetapkan peringkat
}
