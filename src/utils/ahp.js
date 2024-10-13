// Fungsi utama AHP
export const calculateAHP = (alternatives, criteria, pairwiseComparisons) => {
    const steps = []; // Untuk mencatat langkah-langkah

    // Rasio Index untuk pengecekan konsistensi
    const ri = {
        1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49, 11: 1.51
    };

    // Validasi input awal
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

    // Fungsi normalisasi matriks
    const normalizeMatrix = (matrix) => {
        const sumCols = matrix[0].map((_, colIndex) =>
            matrix.reduce((sum, row) => sum + row[colIndex], 0)
        );

        if (sumCols.some(colSum => colSum === 0)) {
            throw new Error("Normalization failed: one or more columns sum to zero.");
        }

        return matrix.map(row => row.map((value, index) => value / sumCols[index]));
    };

    // Fungsi menghitung bobot dari matriks normalisasi
    const calculateWeights = (normalizedMatrix) => {
        const rowSums = normalizedMatrix.map(row =>
            row.reduce((sum, value) => sum + value, 0)
        );
        const totalSum = rowSums.reduce((sum, value) => sum + value, 0);
        return rowSums.map(sum => sum / totalSum);
    };

    // Fungsi untuk mengecek konsistensi
    const consistencyCheck = (matrix, weights) => {
        const n = matrix.length;
        if (n === 2) {
            return { cr: 0, ci: 0 }; // Untuk matriks 2x2, CR dan CI diatur ke 0
        }

        const t = matrix.map((row, i) =>
            row.reduce((sum, value, j) => sum + value * weights[j], 0)
        );

        const lambdaMax = t.reduce((sum, value, i) => sum + value / weights[i], 0) / n;
        const ci = (lambdaMax - n) / (n - 1);
        const cr = (n > 1) ? (ci / ri[n]) : null;
        return { cr, ci };
    };

    // Step 1: Input Data
    steps.push({
        title: "Input Data",
        data: { alternatives, criteria, pairwiseComparisons },
    });

    // Step 2: Pairwise Comparison Matrices
    const criteriaMatrix = criteriaComparison;
    const alternativesMatrices = alternativesComparison;
    steps.push({
        title: "Pairwise Comparison Matrices",
        data: { criteriaMatrix, alternativesMatrices },
    });

    // Step 3: Normalisasi Matriks
    const normalizedCriteriaMatrix = normalizeMatrix(criteriaMatrix);
    const normalizedAlternativesMatrices = alternativesMatrices.map(matrix => normalizeMatrix(matrix));
    steps.push({
        title: "Normalized Matrices",
        data: { normalizedCriteriaMatrix, normalizedAlternativesMatrices },
    });

    // Step 4: Hitung Bobot
    const criteriaWeights = calculateWeights(normalizedCriteriaMatrix);
    const alternativeWeights = normalizedAlternativesMatrices.map(matrix => calculateWeights(matrix));
    steps.push({
        title: "Calculated Weights",
        data: { criteriaWeights, alternativeWeights },
    });

    // Step 5: Hitung Skor Akhir
    const finalScores = alternatives.map((alt, altIndex) => {
        const score = criteriaWeights.reduce((totalScore, criteriaWeight, i) => {
            const altWeightForCriteria = normalizedAlternativesMatrices[i][altIndex].reduce((sum, value) => sum + value, 0) / normalizedAlternativesMatrices[i][altIndex].length;
            return totalScore + (altWeightForCriteria * criteriaWeight);
        }, 0);

        return {
            alternative: alt,
            score
        };
    });

    // Sortir berdasarkan skor
    finalScores.sort((a, b) => b.score - a.score);

    steps.push({
        title: "Final Scores",
        data: { finalScores },
    });

    // Step 6: Consistency Check
    const { cr: criteriaCR, ci: criteriaCI } = consistencyCheck(criteriaMatrix, criteriaWeights);
    if (criteriaCR !== null && criteriaCR >= 0.1) {
        console.warn("Consistency check failed for criteria: CR is too high.");
    }

    steps.push({
        title: "Consistency Check",
        data: { criteriaCR, criteriaCI },
    });

    // Logging untuk debugging
    console.log("Final Scores:", finalScores);
    console.log("Criteria Weights:", criteriaWeights);

    console.table(finalScores.map((result, index) => ({
        Rank: index + 1,
        Alternative: result.alternative,
        Score: result.score.toFixed(4)
    })));

    return {
        steps,
        result: { criteriaWeights, finalScores },
        consistencyResults: { criteriaCR, criteriaCI }
    };
};
