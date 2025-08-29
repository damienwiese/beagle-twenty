import styled from '@emotion/styled';
import {
    IconClock,
    IconNotes,
    IconPhone,
    IconPhoneIncoming,
    IconPhoneOutgoing,
    IconPlayerRecord
} from 'twenty-ui';

import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';
import { Call } from 'src/modules/calling/types/calling.types';

const StyledCallItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StyledCallIcon = styled.div<{ direction: string; status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing(3)};
  background: ${({ direction, status, theme }) => {
    if (status === 'failed' || status === 'no-answer') return theme.color.red10;
    if (direction === 'inbound') return theme.color.blue10;
    return theme.color.green10;
  }};
  color: ${({ direction, status, theme }) => {
    if (status === 'failed' || status === 'no-answer') return theme.color.red;
    if (direction === 'inbound') return theme.color.blue;
    return theme.color.green;
  }};
`;

const StyledCallInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledPhoneNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCallMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 12px;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledCallActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  opacity: 0;
  transition: opacity 0.2s;

  ${StyledCallItem}:hover & {
    opacity: 1;
  }
`;

const StyledActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledOutcome = styled.span<{ outcome?: string }>`
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  background: ${({ outcome, theme }) => {
    switch (outcome) {
      case 'connected':
        return theme.color.green10;
      case 'interested':
        return theme.color.blue10;
      case 'not-interested':
        return theme.color.red10;
      default:
        return theme.background.tertiary;
    }
  }};
  color: ${({ outcome, theme }) => {
    switch (outcome) {
      case 'connected':
        return theme.color.green;
      case 'interested':
        return theme.color.blue;
      case 'not-interested':
        return theme.color.red;
      default:
        return theme.font.color.secondary;
    }
  }};
`;

interface CallLogItemProps {
  call: Call;
}

export const CallLogItem = ({ call }: CallLogItemProps) => {
  const { startCall } = useCallDialer();

  const formatDate = (date: Date): string => {
    const now = new Date();
    const callDate = new Date(date);
    const diffInHours = (now.getTime() - callDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return callDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return callDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return callDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCallBack = () => {
    const number = call.direction === 'outbound' ? call.toNumber : call.fromNumber;
    startCall({
      to: number,
      personId: call.personId,
      companyId: call.companyId,
    });
  };

  return (
    <StyledCallItem>
      <StyledCallIcon direction={call.direction} status={call.status}>
        {call.direction === 'inbound' ? (
          <IconPhoneIncoming size={20} />
        ) : (
          <IconPhoneOutgoing size={20} />
        )}
      </StyledCallIcon>

      <StyledCallInfo>
        <StyledPhoneNumber>
          {call.direction === 'outbound' ? call.toNumber : call.fromNumber}
        </StyledPhoneNumber>
        
        <StyledCallMeta>
          <span>{formatDate(call.startTime)}</span>
          
          {call.duration && (
            <>
              <IconClock size={12} />
              <span>{formatDuration(call.duration)}</span>
            </>
          )}
          
          {call.recordingUrl && <IconPlayerRecord size={12} />}
          {call.notes && <IconNotes size={12} />}
          
          {call.outcome && (
            <StyledOutcome outcome={call.outcome}>
              {call.outcome.replace('-', ' ')}
            </StyledOutcome>
          )}
        </StyledCallMeta>
      </StyledCallInfo>

      <StyledCallActions>
        <StyledActionButton onClick={handleCallBack} title="Call back">
          <IconPhone size={16} />
        </StyledActionButton>
      </StyledCallActions>
    </StyledCallItem>
  );
};
