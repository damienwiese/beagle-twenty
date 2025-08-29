import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { RelationMetadataType, RelationOnDeleteAction } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PHONE_NUMBER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { FieldMetadataType } from 'twenty-shared/types';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.phoneNumber,
  namePlural: 'phoneNumbers',
  labelSingular: 'Phone Number',
  labelPlural: 'Phone Numbers',
  description: 'A phone number for calling',
  icon: 'IconPhone',
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class PhoneNumberWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.phoneNumber,
    type: FieldMetadataType.TEXT,
    label: 'Phone Number',
    description: 'Phone number in E.164 format',
    icon: 'IconPhone',
  })
  phoneNumber: string;

  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.friendlyName,
    type: FieldMetadataType.TEXT,
    label: 'Friendly Name',
    description: 'Human readable name',
    icon: 'IconTag',
  })
  friendlyName: string;

  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.twilioSid,
    type: FieldMetadataType.TEXT,
    label: 'Twilio SID',
    description: 'Twilio phone number SID',
    icon: 'IconExternalLink',
  })
  twilioSid: string;

  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.capabilities,
    type: FieldMetadataType.RAW_JSON,
    label: 'Capabilities',
    description: 'Phone number capabilities',
    icon: 'IconSettings',
  })
  capabilities: Record<string, any>;

  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: 'Is Active',
    description: 'Whether the phone number is active',
    icon: 'IconCheck',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.isPrimary,
    type: FieldMetadataType.BOOLEAN,
    label: 'Is Primary',
    description: 'Whether this is the primary phone number',
    icon: 'IconStar',
    defaultValue: false,
  })
  isPrimary: boolean;

  @WorkspaceRelation({
    standardId: PHONE_NUMBER_STANDARD_FIELD_IDS.assignedUser,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Assigned User',
    description: 'User assigned to this phone number',
    icon: 'IconUserCircle',
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'assignedPhoneNumbers',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  assignedUser: Relation<WorkspaceMemberWorkspaceEntity>;
}
