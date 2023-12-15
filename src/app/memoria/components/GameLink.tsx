import Link, { LinkProps } from 'next/link';

import encodeParams from '@/tools/social-share/utils/encodeParams';

import { AllowedSearchParams } from '../page';
import { searchParamsDefaults } from '../data/searchParamsDefaults';

/** A helper wrapper around `next/link` */

export function GameLink<RouteType>({
  noFocus,
  accessKey,
  href,
  query,
  ...rest
}: (Omit<LinkProps<RouteType>, 'href'> &
  (
    | { href?: never; query: Parameters<typeof createGameQuery>[0] }
    | { href: LinkProps<RouteType>['href']; query?: never }
  )) & { noFocus?: boolean }): React.JSX.Element {
  return (
    <Link
      href={href ?? createGameQuery(query!)}
      tabIndex={noFocus ? -1 : undefined}
      accessKey={noFocus ? undefined : accessKey}
      scroll={false}
      {...rest}
    />
  );
}

function createGameQuery(
  params: Partial<Record<AllowedSearchParams, string | number | undefined>>,
) {
  const paramsWithoutDefaults = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      const defaultValue =
        key in searchParamsDefaults
          ? searchParamsDefaults[key as Extract<AllowedSearchParams, 'size' | 'moves'>]
          : undefined;
      return defaultValue === undefined || defaultValue !== value;
    }),
  );
  return `?${encodeParams(paramsWithoutDefaults)}` as const;
}
