import styled from '@emotion/styled';
import { IconFilter, IconX } from 'twenty-ui';

import { Select } from '@/ui/input/components/Select';
import { useCallLog } from 'src/modules/calling/hooks/useCallLog';
import { Button } from 'twenty-ui/input';

const StyledFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3, 4)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledFilterLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const directionOptions = [
  { label: 'All Directions', value: '' },
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' },
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'No Answer', value: 'no-answer' },
  { label: 'Busy', value: 'busy' },
];

const outcomeOptions = [
  { label: 'All Outcomes', value: '' },
  { label: 'Connected', value: 'connected' },
  { label: 'No Answer', value: 'no-answer' },
  { label: 'Left Voicemail', value: 'left-voicemail' },
  { label: 'Interested', value: 'interested' },
  { label: 'Not Interested', value: 'not-interested' },
];

export const CallLogFilters = () => {
  const {
    filters,
    setDirectionFilter,
    setStatusFilter,
    setOutcomeFilter,
    clearFilters,
  } = useCallLog();

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  return (
    <StyledFiltersContainer>
      <IconFilter size={16} />
      
      <StyledFilterGroup>
        <StyledFilterLabel>Direction:</StyledFilterLabel>
        <Select
          options={directionOptions}
          value={filters.direction || ''}
          onChange={(value) => setDirectionFilter(value || undefined)}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterLabel>Status:</StyledFilterLabel>
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(value) => setStatusFilter(value || undefined)}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterLabel>Outcome:</StyledFilterLabel>
        <Select
          options={outcomeOptions}
          value={filters.outcome || ''}
          onChange={(value) => setOutcomeFilter(value || undefined)}
        />
      </StyledFilterGroup>

      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="small"
          Icon={IconX}
          title="Clear filters"
          onClick={clearFilters}
        />
      )}
    </StyledFiltersContainer>
  );
};
