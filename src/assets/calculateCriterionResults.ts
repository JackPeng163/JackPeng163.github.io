import { Result, ItemList } from "./interfaces";

export function calculateCriterionResults(weights: number[][], itemList: ItemList): Result[] {
    const numOptions = weights.length;
    
    // Step 1: Calculate the sum of each row in the weights matrix
    const rowSums = weights.map(row => row.reduce((sum, weight) => sum + weight, 0));

    // Step 2: Normalize each row by dividing by the sum of that row
    const normalizedWeights = weights.map((row, rowIndex) =>
        row.map(weight => weight / rowSums[rowIndex])
    );

    // Step 3: Calculate the average of each column to get the final result for each option
    const results = new Array(numOptions).fill(0).map((_, colIndex) => {
        const sumColumn = normalizedWeights.reduce((sum, row) => sum + row[colIndex], 0);
        return sumColumn / numOptions;
    });

    // Step 4: Return the result for each option using the provided ItemList
    return results.map((result, index) => ({
        item: itemList.options[index],
        result: result
    }));
}
