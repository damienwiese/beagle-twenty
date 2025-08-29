import styled from '@emotion/styled';
import { IconPhone, IconSettings } from 'twenty-ui';

import { PhoneNumberAssignment } from 'src/modules/calling/components/phone-management/PhoneNumberAssignment';
import { PhoneNumberProvisioning } from 'src/modules/calling/components/phone-management/PhoneNumberProvisioning';
import { PhoneNumberSettings } from 'src/modules/calling/components/settings/PhoneNumberSettings';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(6)};
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing(2, 0, 0, 0)};
  font-size: 16px;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledSection = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 12px;
  background: ${({ theme }) => theme.background.primary};
`;

const StyledSectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

export const CallingSettings = () => {
  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <IconPhone size={32} />
          Calling & Phone Management
        </StyledTitle>
        <StyledSubtitle>
          Manage your Twilio phone numbers, assign them to team members, and configure calling preferences
        </StyledSubtitle>
      </StyledHeader>

      <StyledSection>
        <StyledSectionTitle>
          <IconPhone size={20} />
          Current Phone Numbers
        </StyledSectionTitle>
        <PhoneNumberSettings />
      </StyledSection>

      <StyledSection>
        <StyledSectionTitle>
          <IconSettings size={20} />
          Phone Number Assignment
        </StyledSectionTitle>
        <PhoneNumberAssignment />
      </StyledSection>

      <StyledSection>
        <StyledSectionTitle>
          <IconPhone size={20} />
          Provision New Numbers
        </StyledSectionTitle>
        <PhoneNumberProvisioning />
      </StyledSection>
    </StyledContainer>
  );
};
