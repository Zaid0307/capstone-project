import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdContentCopy } from 'react-icons/md';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { createShareStore, shareLink } from './planSharing';
import { useAuth } from '../../auth/AuthContext';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

// Shares a plan: stores a copy under a code and shows code and link to pass on.
// Opened from the ⋮ menu of a plan; only for signed-in users with the backend.
export default function SharePlanPanel({ plan, onClose }) {
  const { t, language } = useTranslation();
  const { client } = useAuth();
  const titleRef = useRef(null);
  const [state, setState] = useState({ status: 'sharing' });
  const [copied, setCopied] = useState('');

  // Shared once per opening; a new opening makes a new code.
  useEffect(() => {
    titleRef.current?.focus();
    let isCurrent = true;
    createShareStore(client)
      .share(plan)
      .then(result => isCurrent && setState({ status: 'shared', ...result }))
      .catch(() => isCurrent && setState({ status: 'failed' }));
    return () => {
      isCurrent = false;
    };
  }, [client, plan]);

  async function copy(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(message);
    } catch {
      setCopied(t('planShare.copyFailed'));
    }
  }

  const link = state.status === 'shared' ? shareLink(state.code) : '';
  const expires =
    state.status === 'shared'
      ? new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(state.expiresAt))
      : '';

  return (
    <Panel aria-labelledby="sharePlanTitle">
      <Head>
        <Title id="sharePlanTitle" ref={titleRef} tabIndex={-1}>
          {t('planShare.title', { name: plan.nameOfWorkout })}
        </Title>
        <IconButton aria-label={t('planShare.close')} title={t('planShare.close')} onClick={onClose}>
          <MdClose />
        </IconButton>
      </Head>
      {state.status === 'sharing' && <p role="status">{t('planShare.sharing')}</p>}
      {state.status === 'failed' && <p role="alert">{t('planShare.failed')}</p>}
      {state.status === 'shared' && (
        <>
          <p>{t('planShare.text', { date: expires })}</p>
          <Code aria-label={t('planShare.code')}>{state.code}</Code>
          <Link>{link}</Link>
          <Actions>
            <Button onClick={() => copy(link, t('planShare.linkCopied'))}>
              <MdContentCopy aria-hidden="true" />
              {t('planShare.copyLink')}
            </Button>
            <Button $variant="secondary" onClick={() => copy(state.code, t('planShare.codeCopied'))}>
              {t('planShare.copyCode')}
            </Button>
          </Actions>
          <Muted>{t('planShare.note')}</Muted>
        </>
      )}
      <p role="status">{copied}</p>
    </Panel>
  );
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  overflow-wrap: anywhere;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;

const Title = styled.h3`
  font-size: ${fontSizes.lead};
`;

const Code = styled.p`
  font-size: ${fontSizes.section};
  font-variant-numeric: tabular-nums;
  font-weight: ${fontWeights.medium};
  letter-spacing: 0.15em;
`;

const Link = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
