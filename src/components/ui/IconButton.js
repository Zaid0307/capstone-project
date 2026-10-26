import styled from 'styled-components';
import { colors } from '../../styles/colors';

// Icon-only button. Always pass an aria-label.
const IconButton = styled.button.attrs(props => ({
  type: props.type ?? 'button',
}))`
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border: none;
  background-color: transparent;
  color: ${colors.text};
  font-size: 1.2rem;
`;

export default IconButton;
