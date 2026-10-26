import styled, { css } from 'styled-components';
import { colors } from '../../styles/colors';

const variants = {
  primary: css`
    background-color: ${colors.text};
    color: ${colors.surface};
  `,
  secondary: css`
    background-color: ${colors.surface};
    color: ${colors.text};
  `,
};

const Button = styled.button.attrs(props => ({
  type: props.type ?? 'button',
}))`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px 10px;
  margin: 5px 0;
  ${props => variants[props.variant ?? 'primary']}
  &:hover {
    background-color: ${colors.primary};
    color: ${colors.hoverText};
  }
`;

export default Button;
