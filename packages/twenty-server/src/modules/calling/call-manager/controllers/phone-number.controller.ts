import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { PhoneNumberAssignmentService } from 'src/modules/calling/phone-number-manager/services/phone-number-assignment.service';
import { PhoneNumberProvisioningService } from 'src/modules/calling/phone-number-manager/services/phone-number-provisioning.service';

@Controller('rest/phone-numbers')
@UseGuards(JwtAuthGuard)
export class PhoneNumberController {
  constructor(
    private readonly phoneNumberProvisioningService: PhoneNumberProvisioningService,
    private readonly phoneNumberAssignmentService: PhoneNumberAssignmentService,
  ) {}

  @Get('available')
  async getAvailableNumbers(
    @Query('areaCode') areaCode: string,
    @Query('limit') limit?: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.phoneNumberProvisioningService.getAvailablePhoneNumbers(
      areaCode,
      limit ? parseInt(limit) : 10,
    );
  }

  @Post('provision')
  async provisionPhoneNumber(
    @Body() body: { areaCode: string; friendlyName: string },
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.phoneNumberProvisioningService.provisionPhoneNumber(
      body.areaCode,
      body.friendlyName,
      workspace.id,
    );
  }

  @Post(':phoneNumberId/assign')
  async assignPhoneNumber(
    @Param('phoneNumberId') phoneNumberId: string,
    @Body() body: { userId: string },
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.phoneNumberAssignmentService.assignPhoneNumberToUser(
      phoneNumberId,
      body.userId,
      workspace.id,
    );
  }

  @Post(':phoneNumberId/unassign')
  async unassignPhoneNumber(
    @Param('phoneNumberId') phoneNumberId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.phoneNumberAssignmentService.unassignPhoneNumber(
      phoneNumberId,
      workspace.id,
    );
  }

  @Post(':phoneNumberId/set-primary')
  async setPrimaryPhoneNumber(
    @Param('phoneNumberId') phoneNumberId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    await this.phoneNumberAssignmentService.setPrimaryPhoneNumber(
      phoneNumberId,
      workspace.id,
    );
    
    return { success: true };
  }

  @Get('user/:userId')
  async getUserPhoneNumbers(
    @Param('userId') userId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    return await this.phoneNumberAssignmentService.getUserPhoneNumbers(
      userId,
      workspace.id,
    );
  }

  @Delete(':phoneNumberId')
  async releasePhoneNumber(
    @Param('phoneNumberId') phoneNumberId: string,
    @AuthWorkspace() workspace: Workspace,
  ) {
    await this.phoneNumberProvisioningService.releasePhoneNumber(
      phoneNumberId,
      workspace.id,
    );
    
    return { success: true };
  }

  @Post('sync')
  async syncPhoneNumbers(@AuthWorkspace() workspace: Workspace) {
    await this.phoneNumberProvisioningService.syncPhoneNumbers(workspace.id);
    return { success: true };
  }
}
