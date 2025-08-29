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

export type QueueDistributionMethod = 'round-robin' | 'longest-idle' | 'simultaneous';

export interface TwilioCallData {
  callSid: string;
  accountSid: string;
  from: string;
  to: string;
  callStatus: string;
  direction: string;
  duration?: string;
  recordingUrl?: string;
  recordingSid?: string;
}

export interface CallInitiationRequest {
  to: string;
  from?: string;
  personId?: string;
  companyId?: string;
  assignedUserId?: string;
}

export interface CallAssignmentRule {
  id: string;
  name: string;
  conditions: Record<string, any>;
  action: 'assign-to-user' | 'assign-to-queue' | 'round-robin';
  targetUserId?: string;
  targetQueueId?: string;
  priority: number;
  isActive: boolean;
}
