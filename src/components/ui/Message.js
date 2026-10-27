import styled from 'styled-components';
import { colors, radii, shadows, space } from '../../styles/tokens';

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${space.md};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  color: ${colors.text};
  text-align: center;
  box-shadow: ${shadows.card};
`;

export default Message;
