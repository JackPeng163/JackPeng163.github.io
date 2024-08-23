export function calculateSingleResult(weights: number[][]): number[] {
    // Sum the columns (instead of rows) to get the sum of weights for each option
    const sumWeights = weights[0].map((_, colIndex) =>
        weights.reduce((acc, row) => acc + row[colIndex], 0)
    );

    // Normalize the weights by dividing each weight by the sum of its column
    const normalizedWeights = weights.map(row =>
        row.map((weight, colIndex) => weight / sumWeights[colIndex])
    );

    // Average the rows of normalized weights to get the result for each option
    const result = normalizedWeights.map(row => 
        row.reduce((acc, weight) => acc + weight, 0) / row.length
    );

    return result;
}

export interface CriteriaResult {
    criterionId: number;
    optionResults: number[];
}

export function calculateFinalResult(
    criteriaResults: CriteriaResult[], 
    criteriaWeights: number[]
): number[] {
    const numOptions = criteriaResults[0].optionResults.length;
    
    // Initialize the final result array with zeros
    const finalResult = Array(numOptions).fill(0);

    // Calculate the final weighted result for each option
    criteriaResults.forEach((criteriaResult, index) => {
        criteriaResult.optionResults.forEach((optionResult, optionIndex) => {
            finalResult[optionIndex] += optionResult * criteriaWeights[index];
        });
    });

    return finalResult;
}
