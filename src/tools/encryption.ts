/**
 * @example
 * const dateToEncrypt = Date.now(); // Your date in ms, in the format 1700219398326
 * const secretKey = 'YourSecretKey'; // Replace this with your secret key
 *
 * const encryptedDate = encryptNumber(dateToEncrypt, secretKey);
 * console.log('Encrypted Date:', encryptedDate); // hXEBaTZA\LxWO
 *
 * const decryptedDate = decryptNumber(encryptedDate, secretKey);
 * console.log('Decrypted Date:', decryptedDate); // 1700219398326
 */
export function encryptNumber(num: number, key: string): string {
  const numStr = num.toString();
  let encrypted = '';
  for (let i = 0; i < numStr.length; i++) {
    const charCode = numStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  return encrypted;
}

export function decryptNumber(encryptedNum: string, key: string): number {
  let decrypted = '';
  for (let i = 0; i < encryptedNum.length; i++) {
    const charCode = encryptedNum.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(charCode);
  }
  return parseInt(decrypted, 10);
}
