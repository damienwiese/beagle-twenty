import { getTokenPair } from '@/apollo/utils/getTokenPair';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { Call, CallInitiationRequest, PhoneNumber } from 'src/modules/calling/types/calling.types';

export const useCallingApi = () => {
  const { createOneRecord: createCall } = useCreateOneRecord<Call>({
    objectNameSingular: CoreObjectNameSingular.Call,
  });

  const { updateOneRecord: updateCall } = useUpdateOneRecord<Call>({
    objectNameSingular: CoreObjectNameSingular.Call,
  });

  const { records: calls, loading: callsLoading } = useFindManyRecords<Call>({
    objectNameSingular: CoreObjectNameSingular.Call,
  });

  const { records: phoneNumbers, loading: phoneNumbersLoading } = useFindManyRecords<PhoneNumber>({
    objectNameSingular: CoreObjectNameSingular.PhoneNumber,
  });

  const initiateCall = async (request: CallInitiationRequest): Promise<Call> => {
    const tokenPair = getTokenPair();
    const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
    
    const response = await fetch('/rest/calling/initiate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }

    return response.json();
  };

  const hangupCall = async (callId: string): Promise<void> => {
    const tokenPair = getTokenPair();
    const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
    
    const response = await fetch(`/rest/calling/${callId}/hangup`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to hangup call');
    }
  };

  const setCallOutcome = async (
    callId: string,
    outcome: string,
    notes?: string,
  ): Promise<Call> => {
    return updateCall({
      idToUpdate: callId,
      updateOneRecordInput: { outcome, notes },
    });
  };

  const getCallRecording = async (callId: string): Promise<string | null> => {
    const tokenPair = getTokenPair();
    const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
    
    const response = await fetch(`/rest/calling/${callId}/recording`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.recordingUrl;
  };

  return {
    calls,
    callsLoading,
    phoneNumbers,
    phoneNumbersLoading,
    initiateCall,
    hangupCall,
    setCallOutcome,
    getCallRecording,
    createCall,
    updateCall,
  };
};
