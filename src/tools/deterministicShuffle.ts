/**
 * @example
 * const inputArray = [1, 2, 3, 4, 5, 6];
 * const hashString = 'your_input_string';
 * const shuffledArray = deterministicShuffle(inputArray, hashString);
 * console.log(shuffledArray); // [ 2, 5, 4, 6, 3, 1 ]
 */
export function deterministicShuffle<T>(array: T[], hashString: string): T[] {
  const seed = simpleHash(hashString);
  const rng = deterministicRandom(seed);

  const shuffledArray = array.slice(); // Create a copy to avoid modifying the original array

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash;
}
function deterministicRandom(seed: number): () => number {
  let currentSeed = seed;

  return function () {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
}
