import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { User } from 'src/engine/core-modules/user/user.entity';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { CallInitiationService } from 'src/modules/calling/call-manager/services/call-initiation.service';
import { CallOutcomeService } from 'src/modules/calling/call-manager/services/call-outcome.service';
import { RecordingDownloadService } from 'src/modules/calling/call-recording/services/recording-download.service';
import { CallInitiationRequest } from 'src/modules/calling/common/types/call.types';

@Controller('rest/calling')
@UseGuards(JwtAuthGuard)
export class CallController {
  constructor(
    private readonly callInitiationService: CallInitiationService,
    private readonly callOutcomeService: CallOutcomeService,
    private readonly recordingDownloadService: RecordingDownloadService,
  ) {}

  @Post('initiate')
  async initiateCall(
    @Body() request: CallInitiationRequest,
    @AuthWorkspace() workspace: Workspace,
    @AuthUser() user: User,
  ) {
    return await this.callInitiationService.initiateCall(request, workspace.id, user.id);
  }

  @Post(':callId/hangup')
  async hangupCall(
    @Param('callId') callId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    await this.callInitiationService.hangupCall(callId, workspace.id);
    return { success: true };
  }

  @Get(':callId/recording')
  async getCallRecording(
    @Param('callId') callId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    const recordingUrl = await this.recordingDownloadService.getRecordingUrl(callId, workspace.id);
    return { recordingUrl };
  }

  @Post(':callId/outcome')
  async setCallOutcome(
    @Param('callId') callId: string,
    @Body() body: { outcome: string; notes?: string },
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.callOutcomeService.setCallOutcome(
      callId,
      body.outcome as any,
      body.notes,
      workspace.id,
    );
  }
}
