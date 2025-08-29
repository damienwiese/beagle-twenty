import { atom } from 'recoil';

import { Call } from 'src/modules/calling/types/calling.types';

export const activeCallState = atom<Call | null>({
  key: 'activeCallState',
  default: null,
});

export const callTimerState = atom<number>({
  key: 'callTimerState',
  default: 0,
});
