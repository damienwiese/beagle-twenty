import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallQueueWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call-queue.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@Injectable()
export class CallAssignmentService {
  constructor(
    @InjectWorkspaceRepository(WorkspaceMemberWorkspaceEntity)
    private readonly workspaceMemberRepository: WorkspaceRepository<WorkspaceMemberWorkspaceEntity>,
    @InjectWorkspaceRepository(CallQueueWorkspaceEntity)
    private readonly callQueueRepository: WorkspaceRepository<CallQueueWorkspaceEntity>,
  ) {}

  async validateUserAssignment(userId: string, workspaceId: string): Promise<string> {
    const user = await this.workspaceMemberRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found in workspace');
    }

    return userId;
  }

  async assignCallToQueue(
    callId: string,
    queueId: string,
    workspaceId: string,
  ): Promise<string | null> {
    const queue = await this.callQueueRepository.findOne({
      where: { id: queueId, isActive: true },
    });

    if (!queue) {
      throw new Error('Queue not found or inactive');
    }

    return await this.getNextAvailableUser(queueId, workspaceId);
  }

  async getNextAvailableUser(queueId: string, workspaceId: string): Promise<string | null> {
    const availableUsers = await this.workspaceMemberRepository.find({
      take: 1,
    });

    return availableUsers.length > 0 ? availableUsers[0].id : null;
  }

  async assignCallByRules(
    personId?: string,
    companyId?: string,
    workspaceId?: string,
  ): Promise<string | null> {
    return null;
  }
}
