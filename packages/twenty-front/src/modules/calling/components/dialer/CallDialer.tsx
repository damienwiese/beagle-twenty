import { Modal } from '@/ui/layout/modal/components/Modal';
import { ModalHeader } from '@/ui/layout/modal/components/ModalHeader';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import styled from '@emotion/styled';
import { IconPhone } from 'twenty-ui';

import { CallControls } from 'src/modules/calling/components/dialer/CallControls';
import { CallStatus } from 'src/modules/calling/components/dialer/CallStatus';
import { NumberPad } from 'src/modules/calling/components/dialer/NumberPad';
import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';

const StyledDialerContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  width: 320px;
`;

const StyledNumberDisplay = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  min-height: 32px;
  color: ${({ theme }) => theme.font.color.primary};
`;

const CALL_DIALER_MODAL_ID = 'call-dialer-modal';

export const CallDialer = () => {
  const { dialerState, activeCall } = useCallDialer();
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal(CALL_DIALER_MODAL_ID);
  };

  if (!dialerState.isOpen) return null;

  return (
    <Modal modalId={CALL_DIALER_MODAL_ID} isClosable onClose={handleClose}>
      <ModalHeader title="Phone Dialer" icon={<IconPhone />} />
      <StyledDialerContainer>
        {activeCall ? (
          <CallStatus call={activeCall} />
        ) : (
          <>
            <StyledNumberDisplay>
              {dialerState.number || 'Enter number'}
            </StyledNumberDisplay>
            <NumberPad />
          </>
        )}
        <CallControls />
      </StyledDialerContainer>
    </Modal>
  );
};
