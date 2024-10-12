// src/utils/topsis.js
export const calculateTOPSIS = (alternatives, criteria, weights) => {
    const normalizeMatrix = (matrix) => {
        const squaredSum = criteria.map((_, index) =>
            Math.sqrt(matrix.reduce((sum, row) => sum + row[index] ** 2, 0))
        );
        return matrix.map(row =>
            row.map((value, index) => value / squaredSum[index])
        );
    };

    const weightedMatrix = (normalizedMatrix) => {
        return normalizedMatrix.map(row => 
            row.map((value, index) => value * weights[index])
        );
    };

    const findIdealSolutions = (weightedMatrix, types) => {
        const ideal = types.map((type, index) =>
            type === 'benefit' 
                ? Math.max(...weightedMatrix.map(row => row[index]))
                : Math.min(...weightedMatrix.map(row => row[index]))
        );
        const negativeIdeal = types.map((type, index) =>
            type === 'benefit' 
                ? Math.min(...weightedMatrix.map(row => row[index]))
                : Math.max(...weightedMatrix.map(row => row[index]))
        );
        return { ideal, negativeIdeal };
    };

    const calculateSeparationMeasures = (matrix, ideal, negativeIdeal) => {
        const separationFromIdeal = matrix.map(row =>
            Math.sqrt(row.reduce((sum, value, index) => sum + (value - ideal[index]) ** 2, 0))
        );
        const separationFromNegativeIdeal = matrix.map(row =>
            Math.sqrt(row.reduce((sum, value, index) => sum + (value - negativeIdeal[index]) ** 2, 0))
        );
        return { separationFromIdeal, separationFromNegativeIdeal };
    };

    const normalizedMatrix = normalizeMatrix(alternatives);
    const weightedMatrixResult = weightedMatrix(normalizedMatrix);
    const { ideal, negativeIdeal } = findIdealSolutions(weightedMatrixResult, criteria.types);
    const { separationFromIdeal, separationFromNegativeIdeal } = calculateSeparationMeasures(weightedMatrixResult, ideal, negativeIdeal);

    const relativeCloseness = separationFromNegativeIdeal.map((negative, index) => 
        negative / (negative + separationFromIdeal[index])
    );

    const finalRank = relativeCloseness
        .map((value, index) => ({ alternatif: index + 1, value }))
        .sort((a, b) => b.value - a.value);

    return {
        normalizedMatrix: {
            headers: criteria.map((_, index) => `C${index + 1}`),
            data: normalizedMatrix
        },
        weightedNormalizedMatrix: {
            headers: criteria.map((_, index) => `C${index + 1}`),
            data: weightedMatrixResult
        },
        ideal,
        negativeIdeal,
        separationFromIdeal,
        separationFromNegativeIdeal,
        relativeCloseness,
        finalRank
    };
};
