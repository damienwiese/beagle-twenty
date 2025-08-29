import { atom } from 'recoil';

import { Call } from 'src/modules/calling/types/calling.types';

export const callLogState = atom<Call[]>({
  key: 'callLogState',
  default: [],
});

export const callLogFiltersState = atom<{
  direction?: string;
  status?: string;
  outcome?: string;
  dateRange?: { start: Date; end: Date };
}>({
  key: 'callLogFiltersState',
  default: {},
});
