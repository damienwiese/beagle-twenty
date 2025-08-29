import { Injectable } from '@nestjs/common';

import { CallLoggingService } from 'src/modules/calling/call-manager/services/call-logging.service';
import { RecordingDownloadService } from 'src/modules/calling/call-recording/services/recording-download.service';
import { RecordingTranscriptionService } from 'src/modules/calling/call-recording/services/recording-transcription.service';
import { TwilioCallData } from 'src/modules/calling/common/types/call.types';

@Injectable()
export class WebhookHandlerService {
  constructor(
    private readonly callLoggingService: CallLoggingService,
    private readonly recordingDownloadService: RecordingDownloadService,
    private readonly recordingTranscriptionService: RecordingTranscriptionService,
  ) {}

  async handleCallStatusUpdate(webhookData: TwilioCallData): Promise<void> {
    try {
      const workspaceId = this.extractWorkspaceId(webhookData);
      
      await this.callLoggingService.updateCallFromTwilioData(
        webhookData.callSid,
        webhookData,
        workspaceId,
      );

      await this.callLoggingService.logCallEvent(
        webhookData.callSid,
        `call-${webhookData.callStatus}`,
        workspaceId,
        webhookData,
      );
    } catch (error) {
      console.error('Failed to handle call status update:', error);
    }
  }

  async handleRecordingAvailable(webhookData: TwilioCallData): Promise<void> {
    try {
      if (!webhookData.recordingSid) return;

      const workspaceId = this.extractWorkspaceId(webhookData);
      const callId = webhookData.callSid;

      await this.recordingDownloadService.downloadAndStoreRecording(
        callId,
        webhookData.recordingSid,
        workspaceId,
      );

      setTimeout(async () => {
        await this.recordingTranscriptionService.transcribeRecording(
          callId,
          webhookData.recordingSid!,
          workspaceId,
        );
      }, 5000);
    } catch (error) {
      console.error('Failed to handle recording available:', error);
    }
  }

  private extractWorkspaceId(webhookData: TwilioCallData): string {
    // TODO: Extract workspace ID from call metadata or request context
    // For now, this is a placeholder that needs proper implementation
    return process.env.DEFAULT_WORKSPACE_ID || 'default-workspace';
  }
}
