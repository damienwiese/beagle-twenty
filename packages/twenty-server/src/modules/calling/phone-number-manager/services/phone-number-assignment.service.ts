import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { PhoneNumberWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/phone-number.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@Injectable()
export class PhoneNumberAssignmentService {
  constructor(
    @InjectWorkspaceRepository(PhoneNumberWorkspaceEntity)
    private readonly phoneNumberRepository: WorkspaceRepository<PhoneNumberWorkspaceEntity>,
    @InjectWorkspaceRepository(WorkspaceMemberWorkspaceEntity)
    private readonly workspaceMemberRepository: WorkspaceRepository<WorkspaceMemberWorkspaceEntity>,
  ) {}

  async assignPhoneNumberToUser(
    phoneNumberId: string,
    userId: string,
    workspaceId: string,
  ): Promise<PhoneNumberWorkspaceEntity> {
    const user = await this.workspaceMemberRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
    });

    if (!phoneNumber) {
      throw new Error(`Phone number with ID ${phoneNumberId} not found`);
    }

    await this.phoneNumberRepository.update(phoneNumberId, {
      assignedUser: { id: userId },
    });

    return await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
    }) as PhoneNumberWorkspaceEntity;
  }

  async unassignPhoneNumber(
    phoneNumberId: string,
    workspaceId: string,
  ): Promise<PhoneNumberWorkspaceEntity> {
    await this.phoneNumberRepository.update(phoneNumberId, {
      assignedUser: null,
    });

    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
    });

    if (!phoneNumber) {
      throw new Error(`Phone number with ID ${phoneNumberId} not found`);
    }

    return phoneNumber;
  }

  async setPrimaryPhoneNumber(
    phoneNumberId: string,
    workspaceId: string,
  ): Promise<void> {
    const allNumbers = await this.phoneNumberRepository.find({});
    
    for (const number of allNumbers) {
      await this.phoneNumberRepository.update(number.id, { isPrimary: false });
    }

    await this.phoneNumberRepository.update(phoneNumberId, {
      isPrimary: true,
    });
  }

  async getUserPhoneNumbers(
    userId: string,
    workspaceId: string,
  ): Promise<PhoneNumberWorkspaceEntity[]> {
    return await this.phoneNumberRepository.find({
      where: { assignedUser: { id: userId }, isActive: true },
      order: { isPrimary: 'DESC' },
    });
  }

  async getPrimaryPhoneNumber(workspaceId: string): Promise<PhoneNumberWorkspaceEntity | null> {
    return await this.phoneNumberRepository.findOne({
      where: { isPrimary: true, isActive: true },
    });
  }
}
