import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call.workspace-entity';
import { TwilioCallData } from 'src/modules/calling/common/types/call.types';

@Injectable()
export class CallLoggingService {
  constructor(
    @InjectWorkspaceRepository(CallWorkspaceEntity)
    private readonly callRepository: WorkspaceRepository<CallWorkspaceEntity>,
  ) {}

  async updateCallFromTwilioData(
    externalId: string,
    twilioData: TwilioCallData,
    workspaceId: string,
  ): Promise<CallWorkspaceEntity> {
    const call = await this.callRepository.findOne({
      where: { externalId },
    });

    if (!call) {
      throw new Error(`Call with external ID ${externalId} not found`);
    }

    const updateData: Partial<CallWorkspaceEntity> = {
      status: this.mapTwilioStatusToCallStatus(twilioData.callStatus),
      duration: twilioData.duration ? parseInt(twilioData.duration) : undefined,
    };

    if (twilioData.callStatus === 'completed') {
      updateData.endTime = new Date();
    }

    if (twilioData.recordingUrl) {
      updateData.recordingUrl = twilioData.recordingUrl;
      updateData.recordingSid = twilioData.recordingSid;
    }

    await this.callRepository.update(call.id, updateData);

    return await this.callRepository.findOne({
      where: { id: call.id },
    }) as CallWorkspaceEntity;
  }

  async logCallEvent(
    callId: string,
    event: string,
    workspaceId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    console.log(`Call ${callId} - ${event}`, metadata);
  }

  async addCallNotes(
    callId: string,
    notes: string,
    workspaceId: string,
  ): Promise<void> {
    await this.callRepository.update(callId, { notes });
  }

  private mapTwilioStatusToCallStatus(twilioStatus: string): string {
    const statusMap: Record<string, string> = {
      'queued': 'queued',
      'ringing': 'ringing',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'busy': 'busy',
      'failed': 'failed',
      'no-answer': 'no-answer',
      'canceled': 'cancelled',
    };

    return statusMap[twilioStatus] || 'failed';
  }
}
