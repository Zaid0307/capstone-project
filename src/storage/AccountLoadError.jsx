import styled from 'styled-components';
import Button from '../components/ui/Button';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, fontSizes, radii, space } from '../styles/tokens';

// Shown when the account could not be loaded, e.g. at the first sign-in on a
// device without a connection. Offers to try again or to sign out.
export default function AccountLoadError({ isConnectionProblem, message, onRetry, onSignOut }) {
  const { t } = useTranslation();
  return (
    <Box role="alert">
      <h1>{t(isConnectionProblem ? 'account.syncOfflineTitle' : 'account.syncErrorTitle')}</h1>
      <p>{isConnectionProblem ? t('account.syncOffline') : t('account.syncError')}</p>
      {!isConnectionProblem && message && <Details>{message}</Details>}
      <Actions>
        <Button onClick={onRetry}>{t('saveError.retry')}</Button>
        {onSignOut && (
          <Button $variant="secondary" onClick={() => onSignOut().catch(() => {})}>
            {t('account.signOut')}
          </Button>
        )}
      </Actions>
    </Box>
  );
}

const Box = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  max-width: 40rem;
  margin: ${space.xl} auto;
  padding: ${space.lg};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  h1 {
    font-size: ${fontSizes.section};
  }
`;

const Details = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;
