import { Component, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, fontSizes, radii, space } from '../styles/tokens';

// Catches errors while rendering the app and shows a friendly page instead of a
// blank screen. Nothing is sent anywhere; the error text can be copied by hand.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, componentStack: '' };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ componentStack: info?.componentStack ?? '' });
    console.error('GetFit!: the app crashed.', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <CrashPage
        error={this.state.error}
        componentStack={this.state.componentStack}
        onReload={this.props.onReload ?? (() => window.location.reload())}
      />
    );
  }
}

export function describeError(error, componentStack = '') {
  const lines = [
    `${error?.name ?? 'Error'}: ${error?.message ?? String(error)}`,
    `URL: ${window.location.pathname}`,
    `Time: ${new Date().toISOString()}`,
    // The stack starts with the message again; keep only the call lines.
    (error?.stack ?? '')
      .split('\n')
      .filter(line => /^\s+at |@/.test(line))
      .join('\n'),
    componentStack,
  ];
  return lines.filter(Boolean).join('\n').trim();
}

function CrashPage({ error, componentStack, onReload }) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const details = describeError(error, componentStack);

  async function copy() {
    try {
      await navigator.clipboard.writeText(details);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <Page role="alert">
      <h1>{t('crash.title')}</h1>
      <p>{t('crash.text')}</p>
      <Actions>
        <Button onClick={onReload}>{t('crash.reload')}</Button>
        {navigator.clipboard && (
          <Button $variant="secondary" onClick={copy}>
            {t('crash.copy')}
          </Button>
        )}
        {isCopied && <span role="status">{t('crash.copied')}</span>}
      </Actions>
      <label htmlFor="crashDetails">{t('crash.details')}</label>
      <Details id="crashDetails" readOnly value={details} rows={8} onFocus={event => event.target.select()} />
    </Page>
  );
}

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  max-width: 40rem;
  margin: 0 auto;
  padding: ${space.xl} ${space.lg};
  color: ${colors.text};
  h1 {
    font-size: ${fontSizes.title};
  }
  label {
    font-size: ${fontSizes.caption};
    color: ${colors.textMuted};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space.sm};
`;

const Details = styled.textarea`
  width: 100%;
  padding: ${space.sm};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  font-family: ui-monospace, monospace;
  font-size: ${fontSizes.caption};
  color: ${colors.text};
  background-color: ${colors.surface};
`;
