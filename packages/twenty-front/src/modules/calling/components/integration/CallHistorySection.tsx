import styled from '@emotion/styled';
import { IconPhone, IconPlus } from 'twenty-ui';
import { Button } from 'twenty-ui/input';

import { CallLogItem } from 'src/modules/calling/components/call-log/CallLogItem';
import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';
import { useCallLog } from 'src/modules/calling/hooks/useCallLog';

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCallList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.font.color.secondary};
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
`;

interface CallHistorySectionProps {
  personId?: string;
  companyId?: string;
  primaryPhoneNumber?: string;
}

export const CallHistorySection = ({
  personId,
  companyId,
  primaryPhoneNumber,
}: CallHistorySectionProps) => {
  const { getCallsByPerson, getCallsByCompany } = useCallLog();
  const { openDialer, startCall } = useCallDialer();

  const calls = personId 
    ? getCallsByPerson(personId)
    : companyId 
    ? getCallsByCompany(companyId)
    : [];

  const handleNewCall = () => {
    if (primaryPhoneNumber) {
      startCall({
        to: primaryPhoneNumber,
        personId,
        companyId,
      });
    } else {
      openDialer();
    }
  };

  return (
    <StyledSection>
      <StyledHeader>
        <StyledTitle>
          <IconPhone size={16} />
          Call History ({calls.length})
        </StyledTitle>
        
        <Button
          variant="secondary"
          size="small"
          Icon={IconPlus}
          title={primaryPhoneNumber ? `Call ${primaryPhoneNumber}` : 'New Call'}
          onClick={handleNewCall}
        />
      </StyledHeader>

      {calls.length === 0 ? (
        <StyledEmptyState>
          <IconPhone size={24} />
          <span>No calls yet</span>
          <small>Start calling to build call history</small>
        </StyledEmptyState>
      ) : (
        <StyledCallList>
          {calls.slice(0, 5).map((call) => (
            <CallLogItem key={call.id} call={call} />
          ))}
        </StyledCallList>
      )}
    </StyledSection>
  );
};
