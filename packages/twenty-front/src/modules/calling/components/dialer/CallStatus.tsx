import styled from '@emotion/styled';
import { IconBuilding, IconUser } from 'twenty-ui';

import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';
import { Call } from 'src/modules/calling/types/calling.types';

const StyledStatusContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledContactInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledPhoneNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledCallStatus = styled.div<{ status: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'ringing':
        return theme.color.blue;
      case 'in-progress':
        return theme.color.green;
      case 'completed':
        return theme.color.gray;
      default:
        return theme.font.color.secondary;
    }
  }};
  text-transform: capitalize;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTimer = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: monospace;
`;

interface CallStatusProps {
  call: Call;
}

export const CallStatus = ({ call }: CallStatusProps) => {
  const { callTimer } = useCallDialer();

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <StyledStatusContainer>
      <StyledContactInfo>
        {call.personId && <IconUser size={16} />}
        {call.companyId && <IconBuilding size={16} />}
      </StyledContactInfo>
      
      <StyledPhoneNumber>
        {call.direction === 'outbound' ? call.toNumber : call.fromNumber}
      </StyledPhoneNumber>
      
      <StyledCallStatus status={call.status}>
        {call.status.replace('-', ' ')}
      </StyledCallStatus>
      
      {call.status === 'in-progress' && (
        <StyledTimer>
          {formatTimer(callTimer)}
        </StyledTimer>
      )}
    </StyledStatusContainer>
  );
};
