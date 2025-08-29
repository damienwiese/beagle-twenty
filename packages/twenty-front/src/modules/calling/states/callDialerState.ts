import { atom } from 'recoil';

import { CallDialerState } from 'src/modules/calling/types/calling.types';

export const callDialerState = atom<CallDialerState>({
  key: 'callDialerState',
  default: {
    isOpen: false,
    number: '',
    activeCall: undefined,
    isDialing: false,
    isMuted: false,
    isOnHold: false,
  },
});
