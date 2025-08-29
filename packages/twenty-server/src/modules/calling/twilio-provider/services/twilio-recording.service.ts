import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { TwilioClientService } from 'src/modules/calling/twilio-provider/services/twilio-client.service';

@Injectable()
export class TwilioRecordingService {
  constructor(
    private readonly twilioClientService: TwilioClientService,
    private readonly httpService: HttpService,
  ) {}

  async getRecording(recordingSid: string) {
    const client = this.twilioClientService.getClient();
    return await client.recordings(recordingSid).fetch();
  }

  async downloadRecording(recordingSid: string): Promise<Buffer> {
    const client = this.twilioClientService.getClient();
    const recording = await client.recordings(recordingSid).fetch();
    
    const response = await firstValueFrom(
      this.httpService.get(`https://api.twilio.com${recording.uri.replace('.json', '.mp3')}`, {
        responseType: 'arraybuffer',
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID!,
          password: process.env.TWILIO_AUTH_TOKEN!,
        },
      }),
    );

    return Buffer.from(response.data);
  }

  async getRecordingTranscription(recordingSid: string): Promise<string | null> {
    try {
      const client = this.twilioClientService.getClient();
      const transcriptions = await client.transcriptions.list({
        recordingSid: recordingSid,
        limit: 1,
      });

      return transcriptions.length > 0 ? transcriptions[0].transcriptionText : null;
    } catch (error) {
      return null;
    }
  }

  async deleteRecording(recordingSid: string): Promise<void> {
    const client = this.twilioClientService.getClient();
    await client.recordings(recordingSid).remove();
  }
}
