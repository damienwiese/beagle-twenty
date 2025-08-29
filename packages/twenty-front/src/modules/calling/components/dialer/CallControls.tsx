import styled from '@emotion/styled';
import {
    IconMicrophone,
    IconMicrophoneOff,
    IconPhone,
    IconPhoneOff,
    IconPlayerPause,
    IconPlayerPlay
} from 'twenty-ui';

import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';
import { Button } from 'twenty-ui/input';

const StyledControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;



export const CallControls = () => {
  const { 
    dialerState, 
    activeCall, 
    startCall, 
    endCall, 
    toggleMute, 
    toggleHold 
  } = useCallDialer();

  const isInCall = !!activeCall;
  const canCall = dialerState.number.length > 0 && !dialerState.isDialing;

  return (
    <StyledControlsContainer>
      {!isInCall ? (
        <Button
          variant="primary"
          accent="blue"
          onClick={() => startCall()}
          disabled={!canCall}
          Icon={IconPhone}
          title="Start Call"
        />
      ) : (
        <>
          <Button
            variant="secondary"
            accent={dialerState.isMuted ? "blue" : "default"}
            onClick={toggleMute}
            Icon={dialerState.isMuted ? IconMicrophoneOff : IconMicrophone}
            title={dialerState.isMuted ? "Unmute" : "Mute"}
          />

          <Button
            variant="primary"
            accent="danger"
            onClick={endCall}
            Icon={IconPhoneOff}
            title="End Call"
          />

          <Button
            variant="secondary"
            accent={dialerState.isOnHold ? "blue" : "default"}
            onClick={toggleHold}
            Icon={dialerState.isOnHold ? IconPlayerPlay : IconPlayerPause}
            title={dialerState.isOnHold ? "Resume" : "Hold"}
          />
        </>
      )}
    </StyledControlsContainer>
  );
};
