import { Injectable } from '@nestjs/common';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { CallWorkspaceEntity } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-objects/call.workspace-entity';
import { CallOutcome } from 'src/modules/calling/common/types/call.types';

@Injectable()
export class CallOutcomeService {
  constructor(
    @InjectWorkspaceRepository(CallWorkspaceEntity)
    private readonly callRepository: WorkspaceRepository<CallWorkspaceEntity>,
  ) {}

  async setCallOutcome(
    callId: string,
    outcome: CallOutcome,
    notes?: string,
    workspaceId?: string,
  ): Promise<CallWorkspaceEntity> {
    const updateData: Partial<CallWorkspaceEntity> = { outcome };
    
    if (notes) {
      updateData.notes = notes;
    }

    await this.callRepository.update(callId, updateData);

    const updatedCall = await this.callRepository.findOne({
      where: { id: callId },
    });

    if (!updatedCall) {
      throw new Error(`Call with ID ${callId} not found`);
    }

    return updatedCall;
  }

  async getCallOutcomes(workspaceId: string): Promise<Record<string, number>> {
    const calls = await this.callRepository.find({
      select: ['outcome'],
    });

    const outcomes: Record<string, number> = {};
    calls.forEach(call => {
      if (call.outcome) {
        outcomes[call.outcome] = (outcomes[call.outcome] || 0) + 1;
      }
    });

    return outcomes;
  }

  async getCallSuccessRate(workspaceId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const whereClause: any = {};
    
    if (dateFrom) {
      whereClause.startTime = { gte: dateFrom };
    }
    if (dateTo) {
      whereClause.endTime = { lte: dateTo };
    }

    const totalCalls = await this.callRepository.count({ where: whereClause });
    
    const successfulCalls = await this.callRepository.count({
      where: {
        ...whereClause,
        outcome: 'connected',
      },
    });

    return totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
  }
}
