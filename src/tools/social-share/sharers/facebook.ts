import encodeParams from '../utils/encodeParams';

export function getSharingFacebook(options: {
  /** url */
  u: string;
}) {
  const params = encodeParams(options);

  return `https://www.facebook.com/sharer/sharer.php?${params}` as const;
}
