import { useEffect, useState } from 'react';

import { useCallingApi } from 'src/modules/calling/services/calling-api.service';

export const useCallRecording = (callId?: string) => {
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { getCallRecording } = useCallingApi();

  useEffect(() => {
    if (callId) {
      loadRecording();
    }
  }, [callId]);

  const loadRecording = async () => {
    if (!callId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = await getCallRecording(callId);
      setRecordingUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recording');
    } finally {
      setIsLoading(false);
    }
  };

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    setCurrentTime(time);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadRecording = () => {
    if (!recordingUrl) return;

    const link = document.createElement('a');
    link.href = recordingUrl;
    link.download = `call-recording-${callId}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
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
    loadRecording,
  };
};
