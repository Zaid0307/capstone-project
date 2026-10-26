import styled from 'styled-components';

// A centered title with action buttons on the right.
export default function ItemHeader({ title, actions, className }) {
  return (
    <Header className={className}>
      <Spacer aria-hidden="true" />
      {title}
      <Actions>{actions}</Actions>
    </Header>
  );
}

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 5px;
  width: 100%;
  padding: 5px 10px;
  text-align: center;
`;

const Spacer = styled.span``;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;
