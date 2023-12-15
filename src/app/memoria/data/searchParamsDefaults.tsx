import { AllowedSearchParams } from '../page';

export const searchParamsDefaults: Record<
  Extract<AllowedSearchParams, 'size' | 'moves' | 'mistakes'>,
  number
> = {
  size: 4,
  moves: 0,
  mistakes: 0,
};
