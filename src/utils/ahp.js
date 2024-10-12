// src/utils/ahp.js
export const calculateAHP = (alternatives, criteria, weights) => {
    const normalizeMatrix = (matrix) => {
        const sumCols = matrix[0].map((_, colIndex) =>
            matrix.reduce((sum, row) => sum + row[colIndex], 0)
        );
        return matrix.map(row => row.map((value, index) => value / sumCols[index]));
    };

    const calculatePriorities = (normalizedMatrix) => {
        return normalizedMatrix.map(row => 
            row.reduce((sum, value) => sum + value, 0) / row.length
        );
    };

    const comparisonMatrix = criteria.map((criterion, index) => {
        return alternatives.map(alternative => alternative[index]);
    });

    const normalizedMatrix = normalizeMatrix(comparisonMatrix);
    const priorities = calculatePriorities(normalizedMatrix);

    const finalScores = alternatives.map(alternative => 
        priorities.reduce((sum, priority, index) => sum + priority * alternative[index], 0)
    );

    return {
        comparisonMatrix: {
            headers: criteria.map((_, index) => `C${index + 1}`),
            data: comparisonMatrix
        },
        weights: priorities,
        finalScores
    };
};
