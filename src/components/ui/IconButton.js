import styled from 'styled-components';
import { colors, motion, radii, sizes } from '../../styles/tokens';

// Icon-only button. Always pass an aria-label.
const IconButton = styled.button.attrs(props => ({
  type: props.type ?? 'button',
}))`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border: none;
  border-radius: ${radii.small};
  background-color: transparent;
  color: ${colors.text};
  font-size: 1.5rem;
  transition: background-color ${motion.fast};
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
  &:active {
    background-color: ${colors.highlight};
  }
`;

export default IconButton;
