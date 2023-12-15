/**
 * You can test how it works with number = 0, number = 1, number = 2
 *
 * @example
 *  declinationOfNum(
 *    Object.keys(updatedUser).length,
 *    ['изменение', 'изменения', 'изменений'],
 *  )
 */
export function declinationOfNum(
  number: number,
  words: [
    string, // with number = 1
    string, // with number = 2
    string, // with number = 0
  ],
) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ];
}
