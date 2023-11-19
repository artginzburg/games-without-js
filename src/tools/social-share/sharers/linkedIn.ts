import encodeParams from '../utils/encodeParams';

/** Not proved to work. LinkedIn says "Something went wrong" */
export function getSharingLinkedIn({
  url,
  title,
  summary,
}: {
  url: string;
  title?: string;
  summary?: string;
}) {
  const params = encodeParams({
    url,
    title,
    summary,
  });

  return `https://www.linkedin.com/shareArticle?mini=true&${params}` as const;
}
