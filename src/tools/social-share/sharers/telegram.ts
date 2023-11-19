import encodeParams from '../utils/encodeParams';

export function getSharingTelegram(options: { text?: string; url: string }) {
  const params = encodeParams(options);

  return `https://t.me/share/url?${params}` as const;
}
