import { Injectable } from '@nestjs/common';

import { CallInitiationRequest, TwilioCallData } from 'src/modules/calling/common/types/call.types';
import { TwilioClientService } from 'src/modules/calling/twilio-provider/services/twilio-client.service';

@Injectable()
export class TwilioVoiceService {
  constructor(private readonly twilioClientService: TwilioClientService) {}

  async initiateCall(request: CallInitiationRequest): Promise<TwilioCallData> {
    const client = this.twilioClientService.getClient();
    
    const call = await client.calls.create({
      to: request.to,
      from: request.from || process.env.TWILIO_PHONE_NUMBER,
      url: `${process.env.APP_BASE_URL}/webhooks/twilio/voice`,
      statusCallback: `${process.env.APP_BASE_URL}/webhooks/twilio/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: true,
      recordingStatusCallback: `${process.env.APP_BASE_URL}/webhooks/twilio/recording`,
    });

    return {
      callSid: call.sid,
      accountSid: call.accountSid,
      from: call.from,
      to: call.to,
      callStatus: call.status,
      direction: call.direction,
    };
  }

  async hangupCall(callSid: string): Promise<void> {
    const client = this.twilioClientService.getClient();
    await client.calls(callSid).update({ status: 'completed' });
  }

  async getCallDetails(callSid: string): Promise<TwilioCallData> {
    const client = this.twilioClientService.getClient();
    const call = await client.calls(callSid).fetch();

    return {
      callSid: call.sid,
      accountSid: call.accountSid,
      from: call.from,
      to: call.to,
      callStatus: call.status,
      direction: call.direction,
      duration: call.duration,
    };
  }

  generateTwiML(action?: string): string {
    if (action === 'hangup') {
      return `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`;
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?><Response><Dial timeout="30">${process.env.TWILIO_PHONE_NUMBER}</Dial></Response>`;
  }
}
