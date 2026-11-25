import { useEffect, useId, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, radii, shadows, space } from '../../styles/tokens';
import Button from '../ui/Button';

// Asks before finishing a training while planned sets are still open
// (docs/ux/02-tagebuch.md, 3.3). Mount it to open it. The focus starts on
// "Keep training", the choice that loses nothing; Escape means the same.
export default function FinishDialog({ openSets, onFinish, onContinue }) {
  const { t } = useTranslation();
  const id = useId();
  const panelRef = useRef(null);
  const continueRef = useRef(null);
  const continueAction = useRef(onContinue);
  useEffect(() => {
    continueAction.current = onContinue;
  }, [onContinue]);

  useEffect(() => {
    const opener = document.activeElement;
    continueRef.current?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        continueAction.current();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      setTimeout(() => {
        if (opener?.isConnected && opener !== document.body) opener.focus();
      });
    };
  }, []);

  // Keeps Tab between the two buttons.
  function handleTab(event) {
    if (event.key !== 'Tab') return;
    const items = [...panelRef.current.querySelectorAll('button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <Overlay>
      <Backdrop aria-hidden="true" onClick={onContinue} />
      <Panel
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-text`}
        onKeyDown={handleTab}
      >
        <Title id={`${id}-title`}>{t('workout.finishCheck.title')}</Title>
        <p id={`${id}-text`}>
          {openSets === 1
            ? t('workout.finishCheck.textOne')
            : t('workout.finishCheck.text', { count: openSets })}
        </p>
        <Buttons>
          <Button ref={continueRef} onClick={onContinue}>
            {t('workout.finishCheck.continue')}
          </Button>
          <Button $variant="secondary" onClick={onFinish}>
            {t('workout.finishCheck.finish')}
          </Button>
        </Buttons>
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${space.lg};
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${colors.dark};
  opacity: 0.5;
`;

const Panel = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  width: 100%;
  max-width: 28rem;
  max-height: 100%;
  overflow-y: auto;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Title = styled.h2`
  font-size: ${fontSizes.section};
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;
