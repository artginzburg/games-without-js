export function getRandomOfAnySign(absoluteMax: number) {
  const num = Math.floor(Math.random() * absoluteMax);
  const randomSign = Math.sign(Math.random() - 0.5);
  return num * randomSign;
}
