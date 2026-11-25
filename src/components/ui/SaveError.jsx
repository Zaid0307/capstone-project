import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiErrorCircle } from 'react-icons/bi';
import { colors, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { describeFailure } from '../../lib/networkError';

// Tracks whether the device has a connection, so the message can change with it.
function useIsOnline() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine !== false);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine !== false);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return isOnline;
}

// Shown on every page when a plan or a training could not be saved or loaded,
// e.g. because the browser storage is full or the connection is gone. Nothing
// is lost silently; "Try again" repeats the failed action or loads again.
export default function SaveError({ error, onRetry }) {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const [isRetrying, setIsRetrying] = useState(false);
  const kind = describeFailure(error, isOnline);

  async function handleRetry() {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <Banner role="alert">
      <BiErrorCircle aria-hidden="true" />
      <Body>
        <p>
          <strong>{t('saveError.title')}</strong>{' '}
          {kind === 'offline' ? t('saveError.offline') : kind === 'network' ? t('saveError.network') : t('saveError.text')}
        </p>
        {onRetry && (
          <RetryButton type="button" onClick={handleRetry} disabled={isRetrying} aria-busy={isRetrying}>
            {isRetrying ? t('saveError.retrying') : t('saveError.retry')}
          </RetryButton>
        )}
      </Body>
    </Banner>
  );
}

const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  margin: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
  color: ${colors.error};
  box-shadow: ${shadows.card};
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
  strong {
    font-weight: ${fontWeights.bold};
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${space.sm};
`;

const RetryButton = styled.button`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 2px solid currentColor;
  border-radius: 999px;
  background: none;
  color: inherit;
  font-weight: ${fontWeights.bold};
  &:disabled {
    opacity: 0.6;
  }
`;
