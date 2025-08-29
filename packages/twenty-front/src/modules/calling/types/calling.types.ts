export type CallDirection = 'inbound' | 'outbound';

export type CallStatus = 
  | 'queued' 
  | 'ringing' 
  | 'in-progress' 
  | 'completed' 
  | 'busy' 
  | 'failed' 
  | 'no-answer' 
  | 'cancelled';

export type CallOutcome = 
  | 'connected' 
  | 'no-answer' 
  | 'busy' 
  | 'failed' 
  | 'left-voicemail' 
  | 'wrong-number' 
  | 'interested' 
  | 'not-interested';

export interface Call {
  id: string;
  externalId: string;
  direction: CallDirection;
  status: CallStatus;
  outcome?: CallOutcome;
  fromNumber: string;
  toNumber: string;
  duration?: number;
  recordingUrl?: string;
  recordingSid?: string;
  transcription?: string;
  notes?: string;
  startTime: Date;
  endTime?: Date;
  cost?: number;
  personId?: string;
  companyId?: string;
  assignedUserId?: string;
  createdById: string;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  twilioSid: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  isActive: boolean;
  isPrimary: boolean;
  assignedUserId?: string;
}

export interface CallDialerState {
  isOpen: boolean;
  number: string;
  activeCall?: Call;
  isDialing: boolean;
  isMuted: boolean;
  isOnHold: boolean;
}

export interface CallInitiationRequest {
  to: string;
  from?: string;
  personId?: string;
  companyId?: string;
  assignedUserId?: string;
}
