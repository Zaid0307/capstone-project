import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import { useAuth } from './AuthContext';
import { SignInForms } from '../pages/AccountPage';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import { colors, fontSizes, fontWeights, sizes, space } from '../styles/tokens';

export const GUEST_KEY = 'continueWithoutAccount';

// With a backend, the app starts with signing in. At the top there is the way to
// continue without an account; that choice is remembered on this device and can
// be changed later in the settings. The privacy notice stays reachable.
export default function AuthGate({ children }) {
  const { t } = useTranslation();
  const auth = useAuth();
  const { pathname } = useLocation();
  const [isGuest, setIsGuest] = useLocalStorage(GUEST_KEY, false);

  if (!auth.isConfigured || auth.user || isGuest || pathname === routes.privacy) return children;

  return (
    <Screen>
      <Top>
        <Brand>GetFit!</Brand>
        <Skip type="button" onClick={() => setIsGuest(true)}>
          {t('account.continueWithout')}
        </Skip>
      </Top>
      <Main>
        <h1>{t('account.welcome')}</h1>
        <Muted>{t('account.testVersion')}</Muted>
        <SignInForms auth={auth} />
      </Main>
    </Screen>
  );
}

const Screen = styled.div`
  min-height: 100vh;
  padding: ${space.md} ${space.lg} ${space.xl};
  background-color: ${colors.background};
`;

const Top = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
  max-width: 40rem;
  margin: 0 auto ${space.lg};
`;

const Brand = styled.p`
  font-size: ${fontSizes.lead};
  font-weight: ${fontWeights.bold};
`;

const Skip = styled.button`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background-color: ${colors.surface};
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  max-width: 40rem;
  margin: 0 auto;
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
