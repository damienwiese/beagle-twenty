import { Module } from '@nestjs/common';

import { CallingCommonModule } from 'src/modules/calling/common/calling-common.module';
import { CallManagerModule } from 'src/modules/calling/call-manager/call-manager.module';
import { CallRecordingModule } from 'src/modules/calling/call-recording/call-recording.module';
import { PhoneNumberManagerModule } from 'src/modules/calling/phone-number-manager/phone-number-manager.module';
import { TwilioProviderModule } from 'src/modules/calling/twilio-provider/twilio-provider.module';
import { CallingWebhookModule } from 'src/modules/calling/webhooks/calling-webhook.module';

@Module({
  imports: [
    CallingCommonModule,
    TwilioProviderModule,
    CallManagerModule,
    CallRecordingModule,
    PhoneNumberManagerModule,
    CallingWebhookModule,
  ],
  providers: [],
  exports: [CallManagerModule],
})
export class CallingModule {}
