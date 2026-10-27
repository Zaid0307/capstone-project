import styled from 'styled-components';
import Navigation from '../navigation/Navigation';
import { navigationOffset, sizes, space } from '../../styles/tokens';

export default function PageLayout({ children }) {
  return (
    <>
      <Main>{children}</Main>
      <Navigation />
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space.xl};
  width: 100%;
  min-width: 0;
  max-width: ${sizes.contentMax};
  margin: 0 auto;
  /* Room for the fixed navigation at the bottom. */
  padding: ${space.xl} ${space.lg} calc(${navigationOffset} + ${space.lg});
`;
