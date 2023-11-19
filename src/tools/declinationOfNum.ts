/**
 * @example
 *  declinationOfNum(
 *    Object.keys(updatedUser).length,
 *    ['изменение', 'изменения', 'изменений'],
 *  )
 */
export function declinationOfNum(number: number, words: [string, string, string]) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ];
}
