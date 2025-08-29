import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TwilioClientService } from 'src/modules/calling/twilio-provider/services/twilio-client.service';
import { TwilioRecordingService } from 'src/modules/calling/twilio-provider/services/twilio-recording.service';
import { TwilioVoiceService } from 'src/modules/calling/twilio-provider/services/twilio-voice.service';
import { TwilioWebhookService } from 'src/modules/calling/twilio-provider/services/twilio-webhook.service';

@Module({
  imports: [HttpModule],
  providers: [
    TwilioClientService,
    TwilioVoiceService,
    TwilioRecordingService,
    TwilioWebhookService,
  ],
  exports: [
    TwilioClientService,
    TwilioVoiceService,
    TwilioRecordingService,
    TwilioWebhookService,
  ],
})
export class TwilioProviderModule {}
