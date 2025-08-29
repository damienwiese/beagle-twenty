import styled from '@emotion/styled';
import { IconPhone } from 'twenty-ui';

import { CallLogFilters } from 'src/modules/calling/components/call-log/CallLogFilters';
import { CallLogItem } from 'src/modules/calling/components/call-log/CallLogItem';
import { useCallLog } from 'src/modules/calling/hooks/useCallLog';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCallList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)};
  color: ${({ theme }) => theme.font.color.secondary};
  text-align: center;
`;

const StyledStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(3, 4)};
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  font-size: 12px;
`;

const StyledStat = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  
  strong {
    color: ${({ theme }) => theme.font.color.primary};
    font-weight: 600;
  }
`;

export const CallLogList = () => {
  const { calls, loading, getCallStats } = useCallLog();
  const stats = getCallStats();

  if (loading) {
    return <div>Loading calls...</div>;
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <IconPhone size={20} />
          Call History
        </StyledTitle>
      </StyledHeader>

      <CallLogFilters />

      <StyledStats>
        <StyledStat>
          Total: <strong>{stats.totalCalls}</strong>
        </StyledStat>
        <StyledStat>
          Connected: <strong>{stats.connectedCalls}</strong>
        </StyledStat>
        <StyledStat>
          Success Rate: <strong>{stats.successRate.toFixed(1)}%</strong>
        </StyledStat>
        <StyledStat>
          Avg Duration: <strong>{Math.round(stats.avgDuration)}s</strong>
        </StyledStat>
      </StyledStats>

      <StyledCallList>
        {calls.length === 0 ? (
          <StyledEmptyState>
            <IconPhone size={48} />
            <h3>No calls found</h3>
            <p>Start making calls to see your call history here.</p>
          </StyledEmptyState>
        ) : (
          calls.map((call) => (
            <CallLogItem key={call.id} call={call} />
          ))
        )}
      </StyledCallList>
    </StyledContainer>
  );
};
