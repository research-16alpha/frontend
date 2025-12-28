/**
 * Utility function to shuffle an array using Fisher-Yates algorithm.
 * Returns a new shuffled array without mutating the original.
 * 
 * @param array - The array to shuffle
 * @returns A new array with shuffled elements
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array
  const shuffled = [...array];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

