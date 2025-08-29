export const CALLING_CONSTANTS = {
  DEFAULT_CALL_TIMEOUT: 30000,
  MAX_CALL_DURATION: 3600,
  RECORDING_FORMAT: 'mp3',
  TRANSCRIPTION_LANGUAGE: 'en-US',
  DEFAULT_COUNTRY_CODE: '+1',
  MAX_QUEUE_WAIT_TIME: 600,
} as const;

export const TWILIO_WEBHOOK_EVENTS = {
  CALL_INITIATED: 'call-initiated',
  CALL_RINGING: 'call-ringing',
  CALL_ANSWERED: 'call-answered',
  CALL_COMPLETED: 'call-completed',
  RECORDING_AVAILABLE: 'recording-available',
} as const;
