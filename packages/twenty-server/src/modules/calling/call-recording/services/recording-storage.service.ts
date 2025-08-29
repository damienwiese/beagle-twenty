import { Injectable } from '@nestjs/common';

import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';

@Injectable()
export class RecordingStorageService {
  constructor(private readonly fileStorageService: FileStorageService) {}

  async storeRecording(
    recordingBuffer: Buffer,
    fileName: string,
    workspaceId: string,
  ): Promise<string> {
    const folderPath = `workspace-${workspaceId}/call-recordings`;
    const fullPath = `${folderPath}/${fileName}`;

    await this.fileStorageService.write({
      file: recordingBuffer,
      name: fullPath,
      mimeType: 'audio/mpeg',
    });

    return fullPath;
  }

  async getRecording(filePath: string): Promise<Buffer> {
    const stream = await this.fileStorageService.read({ folderPath: '', filename: filePath });
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async deleteRecording(filePath: string, workspaceId: string): Promise<void> {
    try {
      await this.fileStorageService.delete({ folderPath: '', filename: filePath });
    } catch (error) {
      console.error('Failed to delete recording file:', error);
    }
  }

  async getRecordingUrl(filePath: string): Promise<string> {
    return await this.fileStorageService.getFileUrl({ folderPath: '', filename: filePath });
  }
}
