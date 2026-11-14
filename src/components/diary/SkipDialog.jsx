import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdEventBusy } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';
import { Input, Label } from '../planEditor/formStyles';
import Button from '../ui/Button';

export const SKIP_REASONS = ['sick', 'injured', 'noTime', 'travel', 'recovery', 'other'];

// The note saved with a skipped training: the chosen reason and the free text.
export function skipNote(reasonLabel, detail) {
  return [reasonLabel, detail.trim()].filter(Boolean).join(': ');
}

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

// Asks why a training did not take place (concept 4.4): one reason chip and an
// optional free text. Mount it to open it; onConfirm gets the note text.
// Focus starts on the first chip and goes back to the opener afterwards, or to
// `fallbackFocusRef` when the opener is gone (e.g. it was replaced by the entry).
export default function SkipDialog({ subject, onConfirm, onCancel, fallbackFocusRef }) {
  const { t } = useTranslation();
  const id = useId();
  const panelRef = useRef(null);
  const firstChipRef = useRef(null);
  const [reason, setReason] = useState(null);
  const [detail, setDetail] = useState('');

  const cancelRef = useRef(onCancel);
  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const opener = document.activeElement;
    // Read on closing: the fallback node may only exist by then.
    const fallback = fallbackFocusRef;
    firstChipRef.current?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelRef.current();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      // Restore after the commit that removed the dialog.
      setTimeout(() => {
        if (opener?.isConnected && opener !== document.body) opener.focus();
        else fallback?.current?.focus();
      });
    };
    // Runs once per opening; a ref object does not change.
  }, [fallbackFocusRef]);

  // Keeps Tab inside the dialog.
  function handleTab(event) {
    if (event.key !== 'Tab') return;
    const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
    if (items.length === 0) return;
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

  function handleSubmit(event) {
    event.preventDefault();
    onConfirm(skipNote(reason ? t(`diary.skip.reason.${reason}`) : '', detail));
  }

  return (
    <Overlay>
      <Backdrop aria-hidden="true" onClick={onCancel} />
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={subject ? `${id}-subject` : undefined}
        onKeyDown={handleTab}
      >
        <form onSubmit={handleSubmit}>
          <Title id={`${id}-title`}>{t('diary.skip.title')}</Title>
          {subject && <Subject id={`${id}-subject`}>{subject}</Subject>}

          <Fieldset>
            <legend>{t('diary.skip.reasonLabel')}</legend>
            <Chips>
              {SKIP_REASONS.map((item, index) => (
                <Chip
                  key={item}
                  ref={index === 0 ? firstChipRef : undefined}
                  type="button"
                  aria-pressed={reason === item}
                  onClick={() => setReason(reason === item ? null : item)}
                >
                  {t(`diary.skip.reason.${item}`)}
                </Chip>
              ))}
            </Chips>
          </Fieldset>

          <div>
            <Label htmlFor={`${id}-detail`}>{t('diary.skip.detailLabel')}</Label>
            <Input
              id={`${id}-detail`}
              type="text"
              maxLength={200}
              value={detail}
              onChange={event => setDetail(event.target.value)}
            />
          </div>

          <Buttons>
            <Button type="submit">
              <MdEventBusy aria-hidden="true" />
              {t('diary.skip.confirm')}
            </Button>
            <Button $variant="secondary" onClick={onCancel}>
              {t('diary.skip.cancel')}
            </Button>
          </Buttons>
        </form>
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
  width: 100%;
  max-width: 28rem;
  max-height: 100%;
  overflow-y: auto;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  form {
    display: flex;
    flex-direction: column;
    gap: ${space.md};
  }
`;

const Title = styled.h2`
  font-size: ${fontSizes.section};
`;

const Subject = styled.p`
  color: ${colors.textMuted};
  overflow-wrap: anywhere;
`;

const Fieldset = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  legend {
    margin-bottom: ${space.sm};
    font-weight: ${fontWeights.medium};
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const Chip = styled.button`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  color: ${colors.text};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;
