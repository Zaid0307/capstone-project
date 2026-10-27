import styled, { css } from 'styled-components';
import { colors, fontWeights, motion, radii, sizes, space } from '../../styles/tokens';

const variants = {
  primary: css`
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    &:hover:not(:disabled) {
      border-color: ${colors.primaryHover};
      background-color: ${colors.primaryHover};
    }
    &:active:not(:disabled) {
      border-color: ${colors.primaryActive};
      background-color: ${colors.primaryActive};
    }
  `,
  secondary: css`
    border-color: ${colors.border};
    background-color: ${colors.surface};
    color: ${colors.text};
    &:hover:not(:disabled) {
      background-color: ${colors.surfaceMuted};
    }
    &:active:not(:disabled) {
      background-color: ${colors.highlight};
    }
  `,
};

const Button = styled.button.attrs(props => ({
  type: props.type ?? 'button',
}))`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  max-width: 100%;
  padding: ${space.sm} ${space.lg};
  border: 1px solid;
  border-radius: ${radii.small};
  font-weight: ${fontWeights.medium};
  text-align: center;
  transition: background-color ${motion.fast}, border-color ${motion.fast};
  ${props => variants[props.$variant ?? 'primary']}
  &:disabled {
    border-color: ${colors.disabledSurface};
    background-color: ${colors.disabledSurface};
    color: ${colors.disabledText};
  }
`;

export default Button;
