import styled from '@emotion/styled';
import { IconBackspace } from 'twenty-ui';

import { useCallDialer } from 'src/modules/calling/hooks/useCallDialer';

const StyledNumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledNumberButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.border.color.strong};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StyledActionButton = styled(StyledNumberButton)`
  grid-column: span 1;
  background: ${({ theme }) => theme.background.secondary};
`;

const numbers = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

export const NumberPad = () => {
  const { addDigit, removeDigit } = useCallDialer();

  return (
    <StyledNumberPad>
      {numbers.flat().map((digit) => (
        <StyledNumberButton
          key={digit}
          onClick={() => addDigit(digit)}
        >
          {digit}
        </StyledNumberButton>
      ))}
      <div />
      <StyledActionButton onClick={removeDigit}>
        <IconBackspace size={20} />
      </StyledActionButton>
    </StyledNumberPad>
  );
};
