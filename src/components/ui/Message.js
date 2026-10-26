import styled from 'styled-components';
import { colors } from '../../styles/colors';

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px;
  padding: 15px;
  border-radius: 15px;
  background-color: ${colors.surface};
  color: ${colors.text};
  text-align: center;
`;

export default Message;
