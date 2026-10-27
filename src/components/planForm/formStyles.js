import styled, { css } from 'styled-components';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  shadows,
  sizes,
  space,
} from '../../styles/tokens';

export const FormCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.lg};
  min-width: 0;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

export const FormTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

// "Step 1 of 2" above a form title.
export const StepText = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

// A label above its field.
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  min-width: 0;
`;

export const Label = styled.label`
  font-weight: ${fontWeights.medium};
`;

const fieldStyle = css`
  width: 100%;
  min-height: ${sizes.inputHeight};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  &:hover {
    border-color: ${colors.textMuted};
  }
  &[aria-invalid='true'] {
    border: 2px solid ${colors.error};
  }
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

export const Input = styled.input`
  ${fieldStyle}
  &[type='number'] {
    font-variant-numeric: tabular-nums;
  }
`;

export const Select = styled.select`
  ${fieldStyle}
`;

export const ErrorText = styled.p`
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
  color: ${colors.error};
`;
