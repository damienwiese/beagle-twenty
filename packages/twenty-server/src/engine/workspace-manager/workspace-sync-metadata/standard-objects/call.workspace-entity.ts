import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { RelationMetadataType, RelationOnDeleteAction } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { CALL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { FieldMetadataType } from 'twenty-shared/types';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.call,
  namePlural: 'calls',
  labelSingular: 'Call',
  labelPlural: 'Calls',
  description: 'A call record',
  icon: 'IconPhone',
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class CallWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.externalId,
    type: FieldMetadataType.TEXT,
    label: 'External ID',
    description: 'External provider call ID',
    icon: 'IconExternalLink',
  })
  externalId: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.direction,
    type: FieldMetadataType.SELECT,
    label: 'Direction',
    description: 'Call direction',
    icon: 'IconArrowUpRight',
    options: [
      { value: 'inbound', label: 'Inbound', position: 0, color: 'green' },
      { value: 'outbound', label: 'Outbound', position: 1, color: 'blue' },
    ],
    defaultValue: 'outbound',
  })
  direction: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: 'Status',
    description: 'Call status',
    icon: 'IconPhoneCall',
    options: [
      { value: 'queued', label: 'Queued', position: 0, color: 'yellow' },
      { value: 'ringing', label: 'Ringing', position: 1, color: 'blue' },
      { value: 'in-progress', label: 'In Progress', position: 2, color: 'green' },
      { value: 'completed', label: 'Completed', position: 3, color: 'gray' },
      { value: 'busy', label: 'Busy', position: 4, color: 'red' },
      { value: 'failed', label: 'Failed', position: 5, color: 'red' },
      { value: 'no-answer', label: 'No Answer', position: 6, color: 'orange' },
      { value: 'cancelled', label: 'Cancelled', position: 7, color: 'gray' },
    ],
    defaultValue: 'queued',
  })
  status: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.outcome,
    type: FieldMetadataType.SELECT,
    label: 'Outcome',
    description: 'Call outcome',
    icon: 'IconTarget',
    options: [
      { value: 'connected', label: 'Connected', position: 0, color: 'green' },
      { value: 'no-answer', label: 'No Answer', position: 1, color: 'orange' },
      { value: 'busy', label: 'Busy', position: 2, color: 'red' },
      { value: 'failed', label: 'Failed', position: 3, color: 'red' },
      { value: 'left-voicemail', label: 'Left Voicemail', position: 4, color: 'blue' },
      { value: 'wrong-number', label: 'Wrong Number', position: 5, color: 'gray' },
      { value: 'interested', label: 'Interested', position: 6, color: 'green' },
      { value: 'not-interested', label: 'Not Interested', position: 7, color: 'red' },
    ],
  })
  @WorkspaceIsNullable()
  outcome: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.fromNumber,
    type: FieldMetadataType.TEXT,
    label: 'From Number',
    description: 'Caller phone number',
    icon: 'IconPhone',
  })
  fromNumber: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.toNumber,
    type: FieldMetadataType.TEXT,
    label: 'To Number',
    description: 'Recipient phone number',
    icon: 'IconPhone',
  })
  toNumber: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.duration,
    type: FieldMetadataType.NUMBER,
    label: 'Duration',
    description: 'Call duration in seconds',
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  duration: number;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.recordingUrl,
    type: FieldMetadataType.TEXT,
    label: 'Recording URL',
    description: 'Call recording URL',
    icon: 'IconPlayerRecord',
  })
  @WorkspaceIsNullable()
  recordingUrl: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.recordingSid,
    type: FieldMetadataType.TEXT,
    label: 'Recording SID',
    description: 'Recording identifier',
    icon: 'IconId',
  })
  @WorkspaceIsNullable()
  recordingSid: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.transcription,
    type: FieldMetadataType.TEXT,
    label: 'Transcription',
    description: 'Call transcription',
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  transcription: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.notes,
    type: FieldMetadataType.TEXT,
    label: 'Notes',
    description: 'Call notes',
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  notes: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.startTime,
    type: FieldMetadataType.DATE_TIME,
    label: 'Start Time',
    description: 'Call start time',
    icon: 'IconCalendarTime',
  })
  startTime: Date;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.endTime,
    type: FieldMetadataType.DATE_TIME,
    label: 'End Time',
    description: 'Call end time',
    icon: 'IconCalendarTime',
  })
  @WorkspaceIsNullable()
  endTime: Date;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.cost,
    type: FieldMetadataType.NUMBER,
    label: 'Cost',
    description: 'Call cost',
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  cost: number;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.person,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Person',
    description: 'Call person',
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'calls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity>;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.company,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Company',
    description: 'Call company',
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'calls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity>;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.assignedUser,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Assigned User',
    description: 'Call assigned user',
    icon: 'IconUserCircle',
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'assignedCalls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  assignedUser: Relation<WorkspaceMemberWorkspaceEntity>;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.createdBy,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Created By',
    description: 'Call creator',
    icon: 'IconCreativeCommonsSa',
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'createdCalls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  createdBy: Relation<WorkspaceMemberWorkspaceEntity>;
}
