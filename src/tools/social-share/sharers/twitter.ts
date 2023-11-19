import encodeParams from '../utils/encodeParams';

export function getSharingTwitter<Text extends string, Url extends string>({
  text,
  url,
  hashtags,
}: {
  /** Note: most Twitter post texts are limited by length of 280 characters */
  text?: Text;
  url?: Url;
  /** Note: hashtags can only contain latin letters and arabic numbers — otherwise, they won't be parsed by Twitter */
  hashtags?: string[];
}) {
  const params = encodeParams({
    text,
    url,
    hashtags: hashtags?.join(','),
  });

  return `https://twitter.com/intent/tweet?${
    params as `text=${Text}&url=${Url}&hashtags=${string}`
  }` as const;
}
