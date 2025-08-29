import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call.workspace-entity';
import { RecordingStorageService } from 'src/modules/calling/call-recording/services/recording-storage.service';
import { TwilioRecordingService } from 'src/modules/calling/twilio-provider/services/twilio-recording.service';

@Injectable()
export class RecordingDownloadService {
  constructor(
    @InjectWorkspaceRepository(CallWorkspaceEntity)
    private readonly callRepository: WorkspaceRepository<CallWorkspaceEntity>,
    private readonly twilioRecordingService: TwilioRecordingService,
    private readonly recordingStorageService: RecordingStorageService,
  ) {}

  async downloadAndStoreRecording(
    callId: string,
    recordingSid: string,
    workspaceId: string,
  ): Promise<string> {
    const recordingBuffer = await this.twilioRecordingService.downloadRecording(recordingSid);
    
    const fileName = `call-recording-${callId}-${Date.now()}.mp3`;
    const storedUrl = await this.recordingStorageService.storeRecording(
      recordingBuffer,
      fileName,
      workspaceId,
    );

    await this.callRepository.update(callId, {
      recordingUrl: storedUrl,
      recordingSid: recordingSid,
    });

    return storedUrl;
  }

  async getRecordingUrl(callId: string, workspaceId: string): Promise<string | null> {
    const call = await this.callRepository.findOne({
      where: { id: callId },
      select: ['recordingUrl'],
    });

    return call?.recordingUrl || null;
  }

  async deleteRecording(callId: string, workspaceId: string): Promise<void> {
    const call = await this.callRepository.findOne({
      where: { id: callId },
      select: ['recordingSid', 'recordingUrl'],
    });

    if (call?.recordingSid) {
      try {
        await this.twilioRecordingService.deleteRecording(call.recordingSid);
      } catch (error) {
        console.error('Failed to delete Twilio recording:', error);
      }
    }

    if (call?.recordingUrl) {
      await this.recordingStorageService.deleteRecording(call.recordingUrl, workspaceId);
    }

    await this.callRepository.update(callId, {
      recordingUrl: null,
      recordingSid: null,
    });
  }
}
