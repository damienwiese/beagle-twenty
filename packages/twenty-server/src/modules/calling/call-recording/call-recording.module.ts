import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { FileStorageModule } from 'src/engine/core-modules/file-storage/file-storage.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { RecordingDownloadService } from 'src/modules/calling/call-recording/services/recording-download.service';
import { RecordingStorageService } from 'src/modules/calling/call-recording/services/recording-storage.service';
import { RecordingTranscriptionService } from 'src/modules/calling/call-recording/services/recording-transcription.service';
import { TwilioProviderModule } from 'src/modules/calling/twilio-provider/twilio-provider.module';

@Module({
  imports: [
    HttpModule,
    WorkspaceDataSourceModule,
    FileStorageModule,
    TwilioProviderModule,
  ],
  providers: [
    RecordingDownloadService,
    RecordingTranscriptionService,
    RecordingStorageService,
  ],
  exports: [
    RecordingDownloadService,
    RecordingTranscriptionService,
    RecordingStorageService,
  ],
})
export class CallRecordingModule {}
