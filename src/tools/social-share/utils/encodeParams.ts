/**
 * Does not actually encode if not explicitly asked. Just formats into a string.
 *
 * With `encode: true`, this is almost equivalent to `String(new URLSearchParams(obj))`, except that the native way does not filter out undefined and empty strings. But the native way works with arrays.
 */
export default function encodeParams(
  obj: Record<string, string | number | undefined>,
  encode?: boolean,
) {
  return Object.keys(obj)
    .filter((k) => typeof obj[k] !== 'undefined' && obj[k] !== '')
    .map(
      encode
        ? (k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k]!)}`
        : (k) => `${k}=${obj[k]}`,
    )
    .join('&');
}

export function nativeEncodeParams(
  obj: Record<
    string,
    string | number | boolean | undefined | (string | number | boolean | undefined)[]
  >,
) {
  return String(new URLSearchParams(obj as Record<string, string>));
}
