import { getTokenPair } from '@/apollo/utils/getTokenPair';
import { Select } from '@/ui/input/components/Select';
import styled from '@emotion/styled';
import { useState } from 'react';
import { IconStar, IconTrash, IconUser } from 'twenty-ui';
import { Button } from 'twenty-ui/input';

import { useCallingApi } from 'src/modules/calling/services/calling-api.service';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledPhoneNumberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledPhoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledPhoneNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledAssignment = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const StyledPrimaryBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  background: ${({ theme }) => theme.color.blue10};
  color: ${({ theme }) => theme.color.blue};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

const StyledUserSelect = styled.div`
  min-width: 150px;
`;

export const PhoneNumberAssignment = () => {
  const { phoneNumbers, phoneNumbersLoading } = useCallingApi();
  const [assigningNumberId, setAssigningNumberId] = useState<string | null>(null);

  const mockUsers = [
    { value: '', label: 'Unassigned' },
    { value: 'user-1', label: 'John Doe' },
    { value: 'user-2', label: 'Jane Smith' },
    { value: 'user-3', label: 'Mike Johnson' },
  ];

  const assignPhoneNumber = async (phoneNumberId: string, userId: string) => {
    setAssigningNumberId(phoneNumberId);
    try {
      const tokenPair = getTokenPair();
      const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
      
      const endpoint = userId 
        ? `/rest/phone-numbers/${phoneNumberId}/assign`
        : `/rest/phone-numbers/${phoneNumberId}/unassign`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: userId ? JSON.stringify({ userId }) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to assign phone number');
      }

      alert('Phone number assignment updated!');
    } catch (error) {
      console.error('Failed to assign phone number:', error);
      alert('Failed to assign phone number');
    } finally {
      setAssigningNumberId(null);
    }
  };

  const setPrimaryNumber = async (phoneNumberId: string) => {
    try {
      const tokenPair = getTokenPair();
      const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
      
      const response = await fetch(`/rest/phone-numbers/${phoneNumberId}/set-primary`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set primary number');
      }

      alert('Primary phone number updated!');
    } catch (error) {
      console.error('Failed to set primary:', error);
      alert('Failed to set primary number');
    }
  };

  const releaseNumber = async (phoneNumberId: string) => {
    if (!confirm('Are you sure you want to release this phone number? This action cannot be undone.')) {
      return;
    }

    try {
      const tokenPair = getTokenPair();
      const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
      
      const response = await fetch(`/rest/phone-numbers/${phoneNumberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to release phone number');
      }

      alert('Phone number released successfully!');
    } catch (error) {
      console.error('Failed to release number:', error);
      alert('Failed to release phone number');
    }
  };

  if (phoneNumbersLoading) {
    return <div>Loading phone numbers...</div>;
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <h2>Phone Number Assignment</h2>
      </StyledHeader>

      {phoneNumbers?.map((phoneNumber) => (
        <StyledPhoneNumberItem key={phoneNumber.id}>
          <StyledPhoneInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StyledPhoneNumber>{phoneNumber.phoneNumber}</StyledPhoneNumber>
              {phoneNumber.isPrimary && (
                <StyledPrimaryBadge>Primary</StyledPrimaryBadge>
              )}
            </div>
            
            <StyledAssignment>
              <IconUser size={12} />
              {phoneNumber.assignedUserId ? 'Assigned to User' : 'Unassigned'}
              {phoneNumber.friendlyName && ` • ${phoneNumber.friendlyName}`}
            </StyledAssignment>
          </StyledPhoneInfo>
          
          <StyledActions>
            <StyledUserSelect>
              <Select
                options={mockUsers}
                value={phoneNumber.assignedUserId || ''}
                onChange={(userId) => assignPhoneNumber(phoneNumber.id, userId)}
                disabled={assigningNumberId === phoneNumber.id}
              />
            </StyledUserSelect>

            <Button
              variant="secondary"
              size="small"
              Icon={IconStar}
              title="Set as Primary"
              onClick={() => setPrimaryNumber(phoneNumber.id)}
              disabled={phoneNumber.isPrimary}
            />

            <Button
              variant="secondary"
              size="small"
              accent="danger"
              Icon={IconTrash}
              title="Release Number"
              onClick={() => releaseNumber(phoneNumber.id)}
            />
          </StyledActions>
        </StyledPhoneNumberItem>
      ))}
      
      {(!phoneNumbers || phoneNumbers.length === 0) && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
          No phone numbers found. Provision some numbers first.
        </div>
      )}
    </StyledContainer>
  );
};
