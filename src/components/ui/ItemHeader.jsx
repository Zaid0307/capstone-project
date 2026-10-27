import styled from 'styled-components';
import { space } from '../../styles/tokens';

// A title on the left with action buttons on the right. Both wrap when space is short.
export default function ItemHeader({ title, actions, className }) {
  return (
    <Header className={className}>
      <Title>{title}</Title>
      <Actions>{actions}</Actions>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
  width: 100%;
`;

const Title = styled.div`
  flex: 1 1 10rem;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${space.xs};
  margin-left: auto;
`;
