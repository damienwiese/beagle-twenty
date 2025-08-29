import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call.workspace-entity';
import { TwilioRecordingService } from 'src/modules/calling/twilio-provider/services/twilio-recording.service';

@Injectable()
export class RecordingTranscriptionService {
  constructor(
    @InjectWorkspaceRepository(CallWorkspaceEntity)
    private readonly callRepository: WorkspaceRepository<CallWorkspaceEntity>,
    private readonly twilioRecordingService: TwilioRecordingService,
  ) {}

  async transcribeRecording(
    callId: string,
    recordingSid: string,
    workspaceId: string,
  ): Promise<string | null> {
    try {
      const transcription = await this.twilioRecordingService.getRecordingTranscription(recordingSid);
      
      if (transcription) {
        await this.callRepository.update(callId, {
          transcription: transcription,
        });
      }

      return transcription;
    } catch (error) {
      console.error('Failed to transcribe recording:', error);
      return null;
    }
  }

  async getTranscription(callId: string, workspaceId: string): Promise<string | null> {
    const call = await this.callRepository.findOne({
      where: { id: callId },
      select: ['transcription'],
    });

    return call?.transcription || null;
  }

  async updateTranscription(
    callId: string,
    transcription: string,
    workspaceId: string,
  ): Promise<void> {
    await this.callRepository.update(callId, { transcription });
  }
}
