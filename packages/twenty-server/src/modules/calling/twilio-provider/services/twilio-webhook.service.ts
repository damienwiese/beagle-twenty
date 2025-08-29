import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class TwilioWebhookService {
  validateWebhookSignature(
    signature: string,
    url: string,
    params: Record<string, any>,
  ): boolean {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) return false;

    const data = Object.keys(params)
      .sort()
      .reduce((acc, key) => acc + key + params[key], url);

    const expectedSignature = createHmac('sha1', authToken)
      .update(data)
      .digest('base64');

    return signature === expectedSignature;
  }

  parseWebhookPayload(body: any) {
    return {
      callSid: body.CallSid,
      accountSid: body.AccountSid,
      from: body.From,
      to: body.To,
      callStatus: body.CallStatus,
      direction: body.Direction,
      duration: body.CallDuration,
      recordingUrl: body.RecordingUrl,
      recordingSid: body.RecordingSid,
      transcriptionText: body.TranscriptionText,
    };
  }
}
