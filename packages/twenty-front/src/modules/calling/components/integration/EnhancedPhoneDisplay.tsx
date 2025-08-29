import styled from '@emotion/styled';
import { parsePhoneNumber, type PhoneNumber } from 'libphonenumber-js';
import { type MouseEvent } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconPhone } from 'twenty-ui';
import { ContactLink } from 'twenty-ui/navigation';

import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';

interface EnhancedPhoneDisplayProps {
  value: {
    number: string | null | undefined;
    callingCode: string | null | undefined;
  };
  personId?: string;
  companyId?: string;
  enableCalling?: boolean;
}

const StyledPhoneContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledCallButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;

  ${StyledPhoneContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.color.blue};
  }
`;

export const EnhancedPhoneDisplay = ({
  value: { number, callingCode },
  personId,
  companyId,
  enableCalling = true,
}: EnhancedPhoneDisplayProps) => {
  const { startCall } = useCallDialer();

  if (!isDefined(number)) return <ContactLink href="#">{number}</ContactLink>;

  const callingCodeSanitized = callingCode?.replace('+', '');

  let parsedPhoneNumber: PhoneNumber | null = null;

  try {
    parsedPhoneNumber = parsePhoneNumber(number, {
      defaultCallingCode: callingCodeSanitized || '1',
    });
  } catch (error) {
    if (!(error instanceof Error))
      return <ContactLink href="#">{number}</ContactLink>;
    if (error.message === 'NOT_A_NUMBER')
      return <ContactLink href="#">{`+${callingCodeSanitized}`}</ContactLink>;
    return <ContactLink href="#">{number}</ContactLink>;
  }

  const URI = parsedPhoneNumber.getURI();
  const formatedPhoneNumber = parsedPhoneNumber.formatInternational();
  const fullNumber = parsedPhoneNumber.format('E.164');

  const handleCallClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (enableCalling) {
      startCall({
        to: fullNumber,
        personId,
        companyId,
      });
    }
  };

  return (
    <StyledPhoneContainer>
      <ContactLink
        href={URI}
        onClick={(event: MouseEvent<HTMLElement>) => {
          event.stopPropagation();
        }}
      >
        {formatedPhoneNumber || number}
      </ContactLink>
      
      {enableCalling && (
        <StyledCallButton
          onClick={handleCallClick}
          title="Call with Twenty CRM"
        >
          <IconPhone size={14} />
        </StyledCallButton>
      )}
    </StyledPhoneContainer>
  );
};
