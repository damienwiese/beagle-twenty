import styled from '@emotion/styled';
import { IconPhone, IconPlus, IconSettings } from 'twenty-ui';
import { Button } from 'twenty-ui/input';

import { useCallingApi } from 'src/modules/calling/services/calling-api.service';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledPhoneNumberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledPhoneNumberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledPhoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledPhoneNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledPhoneLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledPrimaryBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  background: ${({ theme }) => theme.color.blue10};
  color: ${({ theme }) => theme.color.blue};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

export const PhoneNumberSettings = () => {
  const { phoneNumbers, phoneNumbersLoading } = useCallingApi();

  if (phoneNumbersLoading) {
    return <div>Loading phone numbers...</div>;
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <IconPhone size={20} />
          Phone Numbers
        </StyledTitle>
        
        <Button
          variant="secondary"
          size="small"
          Icon={IconPlus}
          title="Add Phone Number"
        />
      </StyledHeader>

      <StyledPhoneNumberList>
        {phoneNumbers?.map((phoneNumber) => (
          <StyledPhoneNumberItem key={phoneNumber.id}>
            <StyledPhoneInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StyledPhoneNumber>{phoneNumber.phoneNumber}</StyledPhoneNumber>
                {phoneNumber.isPrimary && (
                  <StyledPrimaryBadge>Primary</StyledPrimaryBadge>
                )}
              </div>
              <StyledPhoneLabel>
                {phoneNumber.friendlyName}
                {!phoneNumber.isActive && ' (Inactive)'}
              </StyledPhoneLabel>
            </StyledPhoneInfo>
            
            <StyledActions>
              <Button
                variant="secondary"
                size="small"
                Icon={IconSettings}
                title="Settings"
              />
            </StyledActions>
          </StyledPhoneNumberItem>
        ))}
        
        {(!phoneNumbers || phoneNumbers.length === 0) && (
          <StyledPhoneNumberItem>
            <StyledPhoneInfo>
              <StyledPhoneNumber>No phone numbers configured</StyledPhoneNumber>
              <StyledPhoneLabel>Add a Twilio phone number to start calling</StyledPhoneLabel>
            </StyledPhoneInfo>
          </StyledPhoneNumberItem>
        )}
      </StyledPhoneNumberList>
    </StyledContainer>
  );
};
