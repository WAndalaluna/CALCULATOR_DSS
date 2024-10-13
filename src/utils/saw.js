// utils/saw.js

// Fungsi utama untuk menghitung Simple Additive Weighting (SAW)
export function calculateSAW(input) {
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

    // Langkah 3: Normalisasi Matriks
    const normalizedMatrix = normalizeMatrix(values, types);
    steps.push({
        title: "Normalized Matrix",
        data: normalizedMatrix,
    });

    // Langkah 4: Hitung Weighted Sum
    const weightedSum = calculateWeightedSum(normalizedMatrix, normalizedWeights);
    steps.push({
        title: "Weighted Sum",
        data: weightedSum,
    });

    // Langkah 5: Ranking
    const ranking = rankAlternatives(weightedSum);
    steps.push({
        title: "Final Ranking",
        data: ranking,
    });

    // Mengembalikan langkah-langkah proses dan hasil akhir
    return {
        steps,
        result: ranking,
    };
}

// Fungsi untuk normalisasi bobot
function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
}

// Fungsi untuk normalisasi matriks berdasarkan tipe kriteria (benefit atau cost)
function normalizeMatrix(values, types) {
    return values.map(row =>
        row.map((val, j) => {
            return types[j] === "benefit"
                ? val / Math.max(...values.map(r => r[j]))
                : Math.min(...values.map(r => r[j])) / val;
        })
    );
}

// Fungsi untuk menghitung Weighted Sum
function calculateWeightedSum(normalizedMatrix, weights) {
    return normalizedMatrix.map(row =>
        row.reduce((sum, val, j) => sum + val * weights[j], 0)
    );
}

// Fungsi untuk memberikan peringkat alternatif berdasarkan nilai Weighted Sum
function rankAlternatives(weightedSum) {
    return weightedSum
        .map((v, i) => ({ index: i + 1, value: v })) // Menyimpan nilai dan indeks asli
        .sort((a, b) => b.value - a.value) // Urutkan dari yang terbesar ke terkecil
        .map((item, index) => ({ ...item, rank: index + 1 })); // Berikan peringkat
}
