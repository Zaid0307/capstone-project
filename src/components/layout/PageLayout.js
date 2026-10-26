import styled from 'styled-components';
import Navigation from '../navigation/Navigation';
import { pageBackground } from '../../styles/colors';

export default function PageLayout({ children }) {
  return (
    <GridWrap>
      <Main>{children}</Main>
      <Navigation />
    </GridWrap>
  );
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  background: ${pageBackground};
  padding-bottom: 15px;
`;
