import { Module } from '@nestjs/common';

import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { PhoneNumberAssignmentService } from 'src/modules/calling/phone-number-manager/services/phone-number-assignment.service';
import { PhoneNumberProvisioningService } from 'src/modules/calling/phone-number-manager/services/phone-number-provisioning.service';
import { TwilioProviderModule } from 'src/modules/calling/twilio-provider/twilio-provider.module';

@Module({
  imports: [WorkspaceDataSourceModule, TwilioProviderModule],
  providers: [PhoneNumberProvisioningService, PhoneNumberAssignmentService],
  exports: [PhoneNumberProvisioningService, PhoneNumberAssignmentService],
})
export class PhoneNumberManagerModule {}
