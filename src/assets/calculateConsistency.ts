export function calculateConsistency(weights: number[][]): number {
    const n = weights.length;
    if (n < 3) {
      return 0; // Consistency index is not defined for matrices of size 1 or 2
    }
    const weightVector = calculateWeightVector(weights);
    const weightedSumVector = calculateWeightedSum(weights, weightVector);
    const consistencyVector = weightedSumVector.map((sum, i) => sum / weightVector[i]);
    const lambdaMax = consistencyVector.reduce((acc, val) => acc + val, 0) / n;
    
    const CI = (lambdaMax - n) / (n - 1);
    const RI = getRandomIndex(n);
    const CR = CI / RI;
  
    return CR;
  }
  
  function calculateWeightVector(weights: number[][]): number[] {
    const n = weights.length;
    const sumColumns = Array(n).fill(0);
  
    // Sum each column
    weights.forEach(row => {
      row.forEach((value, j) => {
        sumColumns[j] += value;
      });
    });
  
    // Normalize each row and compute the average
    const weightVector = weights.map(row => {
      return row.reduce((acc, value, j) => acc + value / sumColumns[j], 0) / n;
    });
  
    return weightVector;
  }
  
  function calculateWeightedSum(weights: number[][], weightVector: number[]): number[] {
    const weightedSum = weights.map(row => {
      return row.reduce((acc, value, i) => acc + value * weightVector[i], 0);
    });
  
    return weightedSum;
  }
  
  function getRandomIndex(n: number): number {
    // Random Index values for matrices of size 1 to 15
    const RIValues = [0.00, 0.00, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
    return RIValues[n - 1] || 0; // Return RI based on the size of the matrix
  }
  