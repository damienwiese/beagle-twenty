import styled from '@emotion/styled';
import { IconFileText, IconLoader } from 'twenty-ui';

const StyledTranscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.primary};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledTranscriptionText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.font.color.primary};
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.font.color.secondary};
  text-align: center;
`;

const StyledLoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.font.color.secondary};
`;

interface CallTranscriptionProps {
  transcription?: string;
  isLoading?: boolean;
}

export const CallTranscription = ({ transcription, isLoading }: CallTranscriptionProps) => {
  if (isLoading) {
    return (
      <StyledTranscriptionContainer>
        <StyledHeader>
          <IconFileText size={16} />
          Transcription
        </StyledHeader>
        <StyledLoadingState>
          <IconLoader size={16} />
          Generating transcription...
        </StyledLoadingState>
      </StyledTranscriptionContainer>
    );
  }

  if (!transcription) {
    return (
      <StyledTranscriptionContainer>
        <StyledHeader>
          <IconFileText size={16} />
          Transcription
        </StyledHeader>
        <StyledEmptyState>
          <IconFileText size={24} />
          <span>No transcription available</span>
          <small>Transcription will appear here when available</small>
        </StyledEmptyState>
      </StyledTranscriptionContainer>
    );
  }

  return (
    <StyledTranscriptionContainer>
      <StyledHeader>
        <IconFileText size={16} />
        Transcription
      </StyledHeader>
      <StyledTranscriptionText>
        {transcription}
      </StyledTranscriptionText>
    </StyledTranscriptionContainer>
  );
};
