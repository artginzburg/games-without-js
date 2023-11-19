export function roundToDecimals(num: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
