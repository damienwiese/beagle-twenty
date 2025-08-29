import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call.workspace-entity';
import { CallAssignmentService } from 'src/modules/calling/call-manager/services/call-assignment.service';
import { CallLoggingService } from 'src/modules/calling/call-manager/services/call-logging.service';
import { CallInitiationRequest } from 'src/modules/calling/common/types/call.types';
import { PhoneNumberAssignmentService } from 'src/modules/calling/phone-number-manager/services/phone-number-assignment.service';
import { TwilioVoiceService } from 'src/modules/calling/twilio-provider/services/twilio-voice.service';

@Injectable()
export class CallInitiationService {
  constructor(
    @InjectWorkspaceRepository(CallWorkspaceEntity)
    private readonly callRepository: WorkspaceRepository<CallWorkspaceEntity>,
    private readonly twilioVoiceService: TwilioVoiceService,
    private readonly callLoggingService: CallLoggingService,
    private readonly callAssignmentService: CallAssignmentService,
    private readonly phoneNumberAssignmentService: PhoneNumberAssignmentService,
  ) {}

  async initiateCall(
    request: CallInitiationRequest,
    workspaceId: string,
    userId: string,
  ): Promise<CallWorkspaceEntity> {
    const assignedUser = request.assignedUserId 
      ? await this.callAssignmentService.validateUserAssignment(request.assignedUserId, workspaceId)
      : userId;

    const fromNumber = await this.selectBestPhoneNumber(userId, request.to, workspaceId);
    
    const callData = await this.twilioVoiceService.initiateCall({
      ...request,
      from: fromNumber,
    });

    const call = await this.callRepository.save({
      externalId: callData.callSid,
      direction: 'outbound',
      status: 'queued',
      fromNumber: callData.from,
      toNumber: callData.to,
      person: request.personId ? { id: request.personId } : null,
      company: request.companyId ? { id: request.companyId } : null,
      assignedUser: { id: assignedUser },
      createdBy: { id: userId },
      startTime: new Date(),
    });

    await this.callLoggingService.logCallEvent(call.id, 'call-initiated', workspaceId);

    return call;
  }

  async hangupCall(callId: string, workspaceId: string): Promise<void> {
    const call = await this.callRepository.findOne({
      where: { id: callId },
    });

    if (!call) {
      throw new Error(`Call with ID ${callId} not found`);
    }

    await this.twilioVoiceService.hangupCall(call.externalId);
    
    await this.callRepository.update(call.id, {
      status: 'completed',
      endTime: new Date(),
    });

    await this.callLoggingService.logCallEvent(callId, 'call-completed', workspaceId);
  }

  private async selectBestPhoneNumber(
    userId: string,
    toNumber: string,
    workspaceId: string,
  ): Promise<string> {
    const userPhoneNumbers = await this.phoneNumberAssignmentService.getUserPhoneNumbers(
      userId,
      workspaceId,
    );

    if (userPhoneNumbers.length > 0) {
      const primaryNumber = userPhoneNumbers.find(num => num.isPrimary);
      return primaryNumber?.phoneNumber || userPhoneNumbers[0].phoneNumber;
    }

    const workspacePrimaryNumber = await this.phoneNumberAssignmentService.getPrimaryPhoneNumber(workspaceId);
    
    if (workspacePrimaryNumber) {
      return workspacePrimaryNumber.phoneNumber;
    }

    return process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }
}
