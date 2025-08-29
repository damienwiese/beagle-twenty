import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import {
    IconDownload,
    IconLoader,
    IconPlayerPause,
    IconPlayerPlay,
    IconPlayerStop
} from 'twenty-ui';

import { useCallRecording } from 'src/modules/calling/hooks/useCallRecording';
import { Button } from 'twenty-ui/input';

const StyledPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme.border.color.medium};
  border-radius: 2px;
  cursor: pointer;
  position: relative;
`;

const StyledProgress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.color.blue};
  border-radius: 2px;
  transition: width 0.1s;
`;

const StyledTimeDisplay = styled.div`
  font-size: 12px;
  font-family: monospace;
  color: ${({ theme }) => theme.font.color.secondary};
  min-width: 80px;
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

const StyledErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.color.red};
  text-align: center;
`;

interface CallRecordingPlayerProps {
  callId: string;
}

export const CallRecordingPlayer = ({ callId }: CallRecordingPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    recordingUrl,
    isLoading,
    error,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek,
    formatTime,
    downloadRecording,
  } = useCallRecording(callId);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      // Update current time from audio element
    };

    const updateDuration = () => {
      // Update duration from audio element
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', stop);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', stop);
    };
  }, [recordingUrl]);

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  if (isLoading) {
    return (
      <StyledPlayerContainer>
        <StyledLoadingState>
          <IconLoader size={16} />
          Loading recording...
        </StyledLoadingState>
      </StyledPlayerContainer>
    );
  }

  if (error || !recordingUrl) {
    return (
      <StyledPlayerContainer>
        <StyledErrorState>
          {error || 'No recording available'}
        </StyledErrorState>
      </StyledPlayerContainer>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <StyledPlayerContainer>
      <audio ref={audioRef} src={recordingUrl} />
      
      <StyledControls>
        <Button
          variant="secondary"
          size="small"
          Icon={isPlaying ? IconPlayerPause : IconPlayerPlay}
          onClick={isPlaying ? pause : play}
        />
        
        <Button
          variant="secondary"
          size="small"
          Icon={IconPlayerStop}
          onClick={stop}
        />
        
        <Button
          variant="secondary"
          size="small"
          Icon={IconDownload}
          onClick={downloadRecording}
          title="Download recording"
        />
      </StyledControls>

      <StyledProgressContainer>
        <StyledTimeDisplay>
          {formatTime(currentTime)}
        </StyledTimeDisplay>
        
        <StyledProgressBar onClick={handleProgressClick}>
          <StyledProgress progress={progress} />
        </StyledProgressBar>
        
        <StyledTimeDisplay>
          {formatTime(duration)}
        </StyledTimeDisplay>
      </StyledProgressContainer>
    </StyledPlayerContainer>
  );
};
