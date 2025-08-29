import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { PhoneNumberWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/phone-number.workspace-entity';
import { TwilioClientService } from 'src/modules/calling/twilio-provider/services/twilio-client.service';

@Injectable()
export class PhoneNumberProvisioningService {
  constructor(
    @InjectWorkspaceRepository(PhoneNumberWorkspaceEntity)
    private readonly phoneNumberRepository: WorkspaceRepository<PhoneNumberWorkspaceEntity>,
    private readonly twilioClientService: TwilioClientService,
  ) {}

  async provisionPhoneNumber(
    areaCode: string,
    friendlyName: string,
    workspaceId: string,
  ): Promise<PhoneNumberWorkspaceEntity> {
    const client = this.twilioClientService.getClient();
    
    const availableNumbers = await client.availablePhoneNumbers('US')
      .local.list({ areaCode, limit: 1 });

    if (availableNumbers.length === 0) {
      throw new Error(`No available phone numbers in area code ${areaCode}`);
    }

    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: availableNumbers[0].phoneNumber,
      friendlyName: friendlyName,
      voiceUrl: `${process.env.APP_BASE_URL}/webhooks/twilio/voice`,
      statusCallback: `${process.env.APP_BASE_URL}/webhooks/twilio/status`,
    });

    return await this.phoneNumberRepository.save({
      phoneNumber: purchasedNumber.phoneNumber,
      friendlyName: friendlyName,
      twilioSid: purchasedNumber.sid,
      capabilities: {
        voice: purchasedNumber.capabilities.voice,
        sms: purchasedNumber.capabilities.sms,
        mms: purchasedNumber.capabilities.mms,
      },
      isActive: true,
      isPrimary: false,
    });
  }

  async releasePhoneNumber(phoneNumberId: string, workspaceId: string): Promise<void> {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
    });

    if (!phoneNumber) {
      throw new Error(`Phone number with ID ${phoneNumberId} not found`);
    }

    const client = this.twilioClientService.getClient();
    await client.incomingPhoneNumbers(phoneNumber.twilioSid).remove();

    await this.phoneNumberRepository.delete(phoneNumberId);
  }

  async getAvailablePhoneNumbers(areaCode: string, limit = 10) {
    const client = this.twilioClientService.getClient();
    
    const localNumbers = await client.availablePhoneNumbers('US')
      .local.list({ areaCode, limit });
    
    const tollFreeNumbers = await client.availablePhoneNumbers('US')
      .tollFree.list({ limit: Math.min(limit, 5) });
    
    return {
      local: localNumbers.map(num => ({
        phoneNumber: num.phoneNumber,
        friendlyName: num.friendlyName,
        locality: num.locality,
        region: num.region,
        capabilities: num.capabilities,
        type: 'local',
      })),
      tollFree: tollFreeNumbers.map(num => ({
        phoneNumber: num.phoneNumber,
        friendlyName: num.friendlyName,
        capabilities: num.capabilities,
        type: 'toll-free',
      })),
    };
  }

  async syncPhoneNumbers(workspaceId: string): Promise<void> {
    const client = this.twilioClientService.getClient();
    const twilioNumbers = await client.incomingPhoneNumbers.list();

    for (const twilioNumber of twilioNumbers) {
      const existingNumber = await this.phoneNumberRepository.findOne({
        where: { twilioSid: twilioNumber.sid },
      });

      if (!existingNumber) {
        await this.phoneNumberRepository.save({
          phoneNumber: twilioNumber.phoneNumber,
          friendlyName: twilioNumber.friendlyName || twilioNumber.phoneNumber,
          twilioSid: twilioNumber.sid,
          capabilities: {
            voice: twilioNumber.capabilities.voice,
            sms: twilioNumber.capabilities.sms,
            mms: twilioNumber.capabilities.mms,
          },
          isActive: true,
          isPrimary: false,
        });
      }
    }
  }
}
