import { DevOptionsObject, DevOptionsFormat } from './utils';

export function parseSearchParamDevOptions(
  devOptions: string | undefined,
): DevOptionsObject | undefined {
  if (process.env.NODE_ENV !== 'development') return;
  if (devOptions === undefined) return;

  return DevOptionsFormat.parse(devOptions);
}
