import { Module } from '@nestjs/common';

import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { CallController } from 'src/modules/calling/call-manager/controllers/call.controller';
import { PhoneNumberController } from 'src/modules/calling/call-manager/controllers/phone-number.controller';
import { CallAssignmentService } from 'src/modules/calling/call-manager/services/call-assignment.service';
import { CallInitiationService } from 'src/modules/calling/call-manager/services/call-initiation.service';
import { CallLoggingService } from 'src/modules/calling/call-manager/services/call-logging.service';
import { CallOutcomeService } from 'src/modules/calling/call-manager/services/call-outcome.service';
import { CallRecordingModule } from 'src/modules/calling/call-recording/call-recording.module';
import { PhoneNumberManagerModule } from 'src/modules/calling/phone-number-manager/phone-number-manager.module';
import { TwilioProviderModule } from 'src/modules/calling/twilio-provider/twilio-provider.module';

@Module({
  imports: [WorkspaceDataSourceModule, TwilioProviderModule, CallRecordingModule, PhoneNumberManagerModule],
  controllers: [CallController, PhoneNumberController],
  providers: [
    CallInitiationService,
    CallLoggingService,
    CallAssignmentService,
    CallOutcomeService,
  ],
  exports: [
    CallInitiationService,
    CallLoggingService,
    CallAssignmentService,
    CallOutcomeService,
  ],
})
export class CallManagerModule {}
