export function generateRandomString(
  /** Max: 10 */
  length = 5,
) {
  /** To cut off the "0." at the start */
  const substringStart = 2;
  return Math.random()
    .toString(36)
    .substring(substringStart, substringStart + length);
}
