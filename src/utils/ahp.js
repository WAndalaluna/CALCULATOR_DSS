export const calculateAHP = (alternatives, criteria, pairwiseComparisons) => {
    const steps = [];
    const ri = {
        1: 0,
        2: 0,
        3: 0.58,
        4: 0.9,
        5: 1.12,
        6: 1.24,
        7: 1.32,
        8: 1.41,
        9: 1.45,
        10: 1.49,
        11: 1.51
    };

    // Validasi Input
    if (!pairwiseComparisons || typeof pairwiseComparisons !== 'object') {
        throw new Error("Invalid input: pairwise comparisons is required.");
    }

    const { criteria: criteriaComparison, alternatives: alternativesComparison } = pairwiseComparisons;

    if (!criteriaComparison || !Array.isArray(criteriaComparison)) {
        throw new Error("Invalid input: criteria comparison matrix is required.");
    }

    if (!alternativesComparison || !Array.isArray(alternativesComparison)) {
        throw new Error("Invalid input: alternatives comparison matrices are required.");
    }

    // Step: Isi otomatis alternatif jika kosong
    if (!alternatives || alternatives.length === 0) {
        // Menggunakan jumlah baris dari perbandingan alternatif pertama untuk membuat alternatif otomatis
        const numberOfAlternatives = alternativesComparison[0].length;
        alternatives = Array.from({ length: numberOfAlternatives }, (_, i) => `A${i + 1}`);
    }

    const normalizeMatrix = (matrix) => {
        const sumCols = matrix[0].map((_, colIndex) =>
            matrix.reduce((sum, row) => sum + row[colIndex], 0)
        );

        // Cek jika ada kolom dengan jumlah nol
        if (sumCols.some(colSum => colSum === 0)) {
            throw new Error("Normalization failed: one or more columns sum to zero.");
        }

        return matrix.map(row => row.map((value, index) => value / sumCols[index]));
    };

    const calculateWeights = (normalizedMatrix) => {
        const rowSums = normalizedMatrix.map(row => 
            row.reduce((sum, value) => sum + value, 0)
        );
        const totalSum = rowSums.reduce((sum, value) => sum + value, 0);
        return rowSums.map(sum => sum / totalSum);
    };

    const consistencyCheck = (matrix, weights) => {
        const n = matrix.length;
        
        if (n === 2) {
            return { cr: 0, ci: 0 }; // Set CR and CI ke 0 untuk 2x2 matrix
        }

        // Hitung WT (perkalian matriks asli dengan bobot yang dihitung)
        const t = matrix.map((row, i) =>
            row.reduce((sum, value, j) => sum + value * weights[j], 0)
        );

        // Hitung λ maks (lambda max adalah rata-rata dari t[i] / weights[i])
        const lambdaMax = t.reduce((sum, value, i) => sum + value / weights[i], 0) / n;

        // Hitung CI
        const ci = (lambdaMax - n) / (n - 1);

        // Hitung CR (jika n > 1)
        const cr = (n > 1) ? (ci / ri[n]) : null;
        return { cr, ci };
    };

    // Step 1: Input Data
    steps.push({
        title: "Input Data",
        data: { alternatives, criteria, pairwiseComparisons },
    });

    // Step 2: Use Provided Pairwise Comparison Matrices
    const criteriaMatrix = criteriaComparison; 
    const alternativesMatrices = alternativesComparison; 
    steps.push({
        title: "Pairwise Comparison Matrices",
        data: { criteriaMatrix, alternativesMatrices },
    });

    // Step 3: Normalize Matrices
    const normalizedCriteriaMatrix = normalizeMatrix(criteriaMatrix);
    const normalizedAlternativesMatrices = alternativesMatrices.map(matrix => normalizeMatrix(matrix));
    steps.push({
        title: "Normalized Matrices",
        data: { normalizedCriteriaMatrix, normalizedAlternativesMatrices },
    });

    

    // Step 4: Calculate Weights
    const criteriaWeights = calculateWeights(normalizedCriteriaMatrix);
    const alternativeWeights = normalizedAlternativesMatrices.map(matrix => calculateWeights(matrix));
    steps.push({
        title: "Calculated Weights",
        data: { criteriaWeights, alternativeWeights },
    });

        // Step 6: Consistency Check untuk kriteria
        const { cr: criteriaCR, ci: criteriaCI } = consistencyCheck(criteriaMatrix, criteriaWeights);
    
        let consistencyMessage = "";
       
    
        if (criteriaCR !== null && criteriaCR >= 0.1) {
            console.warn("Consistency check failed for criteria: CR is too high.");
        }
    
        steps.push({
            title: "Consistency Check",
            data: { criteriaCR, criteriaCI, consistencyMessage },
        });

    // Step 5: Final Scores Calculation
const finalScores = alternatives.map((alt, altIndex) => {
    const score = criteriaWeights.reduce((totalScore, criteriaWeight, i) => {
        const altWeightForCriteria = alternativeWeights[i][altIndex];
        return totalScore + altWeightForCriteria * criteriaWeight;
    }, 0);

    return {
        alternative: alt,
        score,
        rank: 0 // Inisialisasi rank
    };
});

// Sorting berdasarkan skor
finalScores.sort((a, b) => b.score - a.score);

// Menetapkan rank berdasarkan urutan
finalScores.forEach((result, index) => {
    result.rank = index + 1; // Peringkat dimulai dari 1
});

// Menambahkan langkah untuk final scores dengan rank
steps.push({
    title: "Final Scores",
    data: { finalScores },
});

// Output tabel dengan peringkat
console.table(finalScores.map((result) => ({
    Rank: result.rank,
    Alternative: result.alternative,
    Score: result.score.toFixed(4) // Tampilkan dengan 4 desimal
})));

return {
    steps,
    result: { criteriaWeights, finalScores },
    consistencyResults: { criteriaCR, criteriaCI }
};
};