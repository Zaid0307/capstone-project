import { useRef } from 'react';
import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { PREFILL_MODES } from './prefillChoice';

// Two choices as a radio group (docs: mockup-v3, training screen): "Last time"
// and "Average", each with its values in small type below. Arrow keys move
// between them like native radio buttons.
export default function PrefillToggle({ name, mode, onChange, lastText, averageText }) {
  const { t } = useTranslation();
  const refs = useRef({});
  const options = [
    { value: 'last', label: t('workout.prefill.last'), detail: lastText },
    { value: 'average', label: t('workout.prefill.average'), detail: averageText },
  ];

  function handleKeyDown(event) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = PREFILL_MODES.indexOf(mode);
    const next = PREFILL_MODES[(index + step + PREFILL_MODES.length) % PREFILL_MODES.length];
    onChange(next);
    refs.current[next]?.focus();
  }

  return (
    <Group role="radiogroup" aria-label={t('workout.prefill.label', { name })} onKeyDown={handleKeyDown}>
      {options.map(option => (
        <Choice
          key={option.value}
          ref={element => {
            refs.current[option.value] = element;
          }}
          type="button"
          role="radio"
          aria-checked={mode === option.value}
          tabIndex={mode === option.value ? 0 : -1}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {/* The details come as lines, e.g. values and date. */}
          {[option.detail ?? []].flat().filter(Boolean).map(line => (
            <small key={line}>{line}</small>
          ))}
        </Choice>
      ))}
    </Group>
  );
}

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${space.xs};
  padding: ${space.xs};
  border-radius: ${radii.large};
  background-color: ${colors.surfaceMuted};
`;

const Choice = styled.button`
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: ${sizes.touchTarget};
  padding: ${space.xs} ${space.sm};
  border: 1px solid transparent;
  border-radius: ${radii.small};
  background-color: transparent;
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
  line-height: 1.2;
  text-align: center;
  small {
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
    font-weight: ${fontWeights.regular};
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  &[aria-checked='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.surface};
    font-weight: ${fontWeights.bold};
  }
`;
