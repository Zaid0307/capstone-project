import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';

export const FormCard = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0 15px 15px;
  padding: 5px;
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

export const FormTitle = styled.h2`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 5px;
  border-radius: ${radii.small};
  background-color: ${colors.secondary};
  color: ${colors.text};
  font-size: 1.3rem;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
`;

export const Label = styled.label`
  color: ${colors.primary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.25rem 0 0 0.25rem;
  border: none;
  border-bottom: 0.5px solid ${colors.secondary};
  background-color: transparent;
  font-size: 1rem;
  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

export const ErrorText = styled.p`
  color: ${colors.error};
  font-size: 0.9rem;
`;
