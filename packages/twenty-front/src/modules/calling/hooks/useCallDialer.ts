import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useCallingApi } from 'src/modules/calling/services/calling-api.service';
import { activeCallState, callTimerState } from 'src/modules/calling/states/activeCallState';
import { callDialerState } from 'src/modules/calling/states/callDialerState';
import { CallInitiationRequest } from 'src/modules/calling/types/calling.types';

const CALL_DIALER_MODAL_ID = 'call-dialer-modal';

export const useCallDialer = () => {
  const [dialerState, setDialerState] = useRecoilState(callDialerState);
  const [activeCall, setActiveCall] = useRecoilState(activeCallState);
  const [callTimer, setCallTimer] = useRecoilState(callTimerState);
  const [error, setError] = useState<string | null>(null);

  const { openModal, closeModal } = useModal();
  const { initiateCall, hangupCall, setCallOutcome } = useCallingApi();

  const openDialer = () => {
    setDialerState(prev => ({ ...prev, isOpen: true }));
    openModal(CALL_DIALER_MODAL_ID);
  };

  const closeDialer = () => {
    setDialerState(prev => ({ 
      ...prev, 
      isOpen: false, 
      number: '', 
      isDialing: false 
    }));
    closeModal(CALL_DIALER_MODAL_ID);
  };

  const setNumber = (number: string) => {
    setDialerState(prev => ({ ...prev, number }));
  };

  const addDigit = (digit: string) => {
    setDialerState(prev => ({ ...prev, number: prev.number + digit }));
  };

  const removeDigit = () => {
    setDialerState(prev => ({ 
      ...prev, 
      number: prev.number.slice(0, -1) 
    }));
  };

  const startCall = async (request?: Partial<CallInitiationRequest>) => {
    if (!dialerState.number && !request?.to) {
      setError('Phone number is required');
      return;
    }

    setDialerState(prev => ({ ...prev, isDialing: true }));
    setError(null);

    try {
      const callRequest: CallInitiationRequest = {
        to: request?.to || dialerState.number,
        personId: request?.personId,
        companyId: request?.companyId,
        assignedUserId: request?.assignedUserId,
      };

      const call = await initiateCall(callRequest);
      
      setActiveCall(call);
      setDialerState(prev => ({ 
        ...prev, 
        activeCall: call, 
        isDialing: false 
      }));

      startCallTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start call');
      setDialerState(prev => ({ ...prev, isDialing: false }));
    }
  };

  const endCall = async () => {
    if (!activeCall) return;

    try {
      await hangupCall(activeCall.id);
      
      setActiveCall(null);
      setDialerState(prev => ({ 
        ...prev, 
        activeCall: undefined, 
        isDialing: false 
      }));
      
      stopCallTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end call');
    }
  };

  const toggleMute = () => {
    setDialerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleHold = () => {
    setDialerState(prev => ({ ...prev, isOnHold: !prev.isOnHold }));
  };

  const startCallTimer = () => {
    setCallTimer(0);
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);

    return interval;
  };

  const stopCallTimer = () => {
    setCallTimer(0);
  };

  const completeCall = async (outcome: string, notes?: string) => {
    if (!activeCall) return;

    try {
      await setCallOutcome(activeCall.id, outcome, notes);
      await endCall();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete call');
    }
  };

  return {
    dialerState,
    activeCall,
    callTimer,
    error,
    openDialer,
    closeDialer,
    setNumber,
    addDigit,
    removeDigit,
    startCall,
    endCall,
    toggleMute,
    toggleHold,
    completeCall,
  };
};
