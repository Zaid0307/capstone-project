import styled from 'styled-components';
import Navigation from '../navigation/Navigation';
import { navigationOffset, sizes, space } from '../../styles/tokens';

// `isWide` gives pages with side-by-side areas more room on large screens.
// `hideNavigation` is for focused tasks such as editing a plan.
export default function PageLayout({ children, isWide = false, hideNavigation = false }) {
  return (
    <>
      <Main $isWide={isWide} $hasNavigation={!hideNavigation}>
        {children}
      </Main>
      {!hideNavigation && <Navigation />}
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space.xl};
  width: 100%;
  min-width: 0;
  max-width: ${props => (props.$isWide ? '960px' : sizes.contentMax)};
  margin: 0 auto;
  /* Room for the fixed navigation at the bottom. */
  padding: ${space.xl} ${space.lg}
    ${props => (props.$hasNavigation ? `calc(${navigationOffset} + ${space.lg})` : space.xl)};
`;
