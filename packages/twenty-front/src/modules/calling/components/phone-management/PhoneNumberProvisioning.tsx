import { getTokenPair } from '@/apollo/utils/getTokenPair';
import styled from '@emotion/styled';
import { useState } from 'react';
import { IconPhone, IconPlus } from 'twenty-ui';
import { Button } from 'twenty-ui/input';

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

const StyledSearchForm = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: end;
`;

const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledInput = styled.input`
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledNumberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledNumberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledNumberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledPhoneNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledLocation = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledTypeBadge = styled.span<{ type: string }>`
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type, theme }) => 
    type === 'toll-free' ? theme.color.green10 : theme.color.blue10};
  color: ${({ type, theme }) => 
    type === 'toll-free' ? theme.color.green : theme.color.blue};
`;

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  type: 'local' | 'toll-free';
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

export const PhoneNumberProvisioning = () => {
  const [areaCode, setAreaCode] = useState('');
  const [friendlyName, setFriendlyName] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState<{
    local: AvailableNumber[];
    tollFree: AvailableNumber[];
  }>({ local: [], tollFree: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const searchAvailableNumbers = async () => {
    if (!areaCode || areaCode.length !== 3) {
      alert('Please enter a valid 3-digit area code');
      return;
    }

    setIsLoading(true);
    try {
      const tokenPair = getTokenPair();
      const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
      
      const response = await fetch(`/rest/phone-numbers/available?areaCode=${areaCode}&limit=10`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();
      setAvailableNumbers(data);
    } catch (error) {
      console.error('Failed to fetch available numbers:', error);
      alert('Failed to fetch available numbers');
    } finally {
      setIsLoading(false);
    }
  };

  const provisionNumber = async (phoneNumber: string) => {
    setIsProvisioning(true);
    try {
      const tokenPair = getTokenPair();
      const token = tokenPair?.accessOrWorkspaceAgnosticToken?.token;
      
      const response = await fetch('/rest/phone-numbers/provision', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          areaCode: areaCode,
          friendlyName: friendlyName || `${areaCode} Number`,
        }),
      });

      if (response.ok) {
        alert('Phone number provisioned successfully!');
        setAvailableNumbers({ local: [], tollFree: [] });
        setAreaCode('');
        setFriendlyName('');
      } else {
        alert('Failed to provision phone number');
      }
    } catch (error) {
      console.error('Failed to provision number:', error);
      alert('Failed to provision phone number');
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <IconPhone size={20} />
          Provision New Phone Number
        </StyledTitle>
      </StyledHeader>

      <StyledSearchForm>
        <StyledInputGroup>
          <StyledLabel>Area Code</StyledLabel>
          <StyledInput
            type="text"
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
            placeholder="415"
            maxLength={3}
          />
        </StyledInputGroup>

        <StyledInputGroup>
          <StyledLabel>Friendly Name (Optional)</StyledLabel>
          <StyledInput
            type="text"
            value={friendlyName}
            onChange={(e) => setFriendlyName(e.target.value)}
            placeholder="Sales Team Line"
          />
        </StyledInputGroup>

        <Button
          variant="primary"
          accent="blue"
          onClick={searchAvailableNumbers}
          disabled={isLoading || areaCode.length !== 3}
          title={isLoading ? "Searching..." : "Search Numbers"}
        />
      </StyledSearchForm>

      {(availableNumbers.local.length > 0 || availableNumbers.tollFree.length > 0) && (
        <StyledNumberList>
          <h3>Local Numbers ({availableNumbers.local.length})</h3>
          {availableNumbers.local.map((number) => (
            <StyledNumberItem key={number.phoneNumber}>
              <StyledNumberInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StyledPhoneNumber>{number.phoneNumber}</StyledPhoneNumber>
                  <StyledTypeBadge type={number.type}>Local</StyledTypeBadge>
                </div>
                <StyledLocation>
                  {number.locality}, {number.region}
                </StyledLocation>
              </StyledNumberInfo>
              
              <Button
                variant="secondary"
                size="small"
                Icon={IconPlus}
                title="Provision This Number"
                onClick={() => provisionNumber(number.phoneNumber)}
                disabled={isProvisioning}
              />
            </StyledNumberItem>
          ))}

          {availableNumbers.tollFree.length > 0 && (
            <>
              <h3>Toll-Free Numbers ({availableNumbers.tollFree.length})</h3>
              {availableNumbers.tollFree.map((number) => (
                <StyledNumberItem key={number.phoneNumber}>
                  <StyledNumberInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StyledPhoneNumber>{number.phoneNumber}</StyledPhoneNumber>
                      <StyledTypeBadge type={number.type}>Toll-Free</StyledTypeBadge>
                    </div>
                  </StyledNumberInfo>
                  
                  <Button
                    variant="secondary"
                    size="small"
                    Icon={IconPlus}
                    title="Provision This Number"
                    onClick={() => provisionNumber(number.phoneNumber)}
                    disabled={isProvisioning}
                  />
                </StyledNumberItem>
              ))}
            </>
          )}
        </StyledNumberList>
      )}
    </StyledContainer>
  );
};
