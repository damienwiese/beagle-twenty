import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { CALL_QUEUE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { FieldMetadataType } from 'twenty-shared/types';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.callQueue,
  namePlural: 'callQueues',
  labelSingular: 'Call Queue',
  labelPlural: 'Call Queues',
  description: 'A call queue for lead assignment',
  icon: 'IconUsers',
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class CallQueueWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: CALL_QUEUE_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: 'Name',
    description: 'Queue name',
    icon: 'IconTag',
  })
  name: string;

  @WorkspaceField({
    standardId: CALL_QUEUE_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: 'Description',
    description: 'Queue description',
    icon: 'IconFileText',
  })
  description: string;

  @WorkspaceField({
    standardId: CALL_QUEUE_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: 'Is Active',
    description: 'Whether the queue is active',
    icon: 'IconCheck',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: CALL_QUEUE_STANDARD_FIELD_IDS.distributionMethod,
    type: FieldMetadataType.SELECT,
    label: 'Distribution Method',
    description: 'How calls are distributed',
    icon: 'IconArrowsShuffle',
    options: [
      { value: 'round-robin', label: 'Round Robin', position: 0, color: 'blue' },
      { value: 'longest-idle', label: 'Longest Idle', position: 1, color: 'green' },
      { value: 'simultaneous', label: 'Simultaneous', position: 2, color: 'orange' },
    ],
    defaultValue: 'round-robin',
  })
  distributionMethod: string;

  @WorkspaceField({
    standardId: CALL_QUEUE_STANDARD_FIELD_IDS.maxWaitTime,
    type: FieldMetadataType.NUMBER,
    label: 'Max Wait Time',
    description: 'Maximum wait time in seconds',
    icon: 'IconClock',
    defaultValue: 300,
  })
  maxWaitTime: number;
}
