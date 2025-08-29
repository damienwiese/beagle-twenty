import { Module } from '@nestjs/common';

import { CallManagerModule } from 'src/modules/calling/call-manager/call-manager.module';
import { CallRecordingModule } from 'src/modules/calling/call-recording/call-recording.module';
import { TwilioProviderModule } from 'src/modules/calling/twilio-provider/twilio-provider.module';
import { TwilioWebhookController } from 'src/modules/calling/webhooks/controllers/twilio-webhook.controller';
import { WebhookHandlerService } from 'src/modules/calling/webhooks/services/webhook-handler.service';

@Module({
  imports: [CallManagerModule, CallRecordingModule, TwilioProviderModule],
  controllers: [TwilioWebhookController],
  providers: [WebhookHandlerService],
  exports: [WebhookHandlerService],
})
export class CallingWebhookModule {}
