import { useId, useRef } from 'react';
import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { FEELINGS } from '../../utils/workoutLog';

// "How was it?" 1–5 as a radio group: number with a word below, arrow keys move
// like native radio buttons. Choosing the selected value again clears it.
export default function FeelingPicker({ value, onChange }) {
  const { t } = useTranslation();
  const titleId = useId();
  const refs = useRef({});
  const focusable = value ?? FEELINGS[0];

  function handleKeyDown(event) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = FEELINGS.indexOf(value ?? FEELINGS[0]);
    const next = FEELINGS[(index + step + FEELINGS.length) % FEELINGS.length];
    onChange(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <Title id={titleId}>{t('workout.feeling.title')}</Title>
      <Group role="radiogroup" aria-labelledby={titleId} onKeyDown={handleKeyDown}>
        {FEELINGS.map(feeling => (
          <Choice
            key={feeling}
            ref={element => {
              refs.current[feeling] = element;
            }}
            type="button"
            role="radio"
            aria-checked={value === feeling}
            tabIndex={feeling === focusable ? 0 : -1}
            onClick={() => onChange(value === feeling ? null : feeling)}
          >
            <b>{feeling}</b> <small>{t(`workout.feeling.${feeling}`)}</small>
          </Choice>
        ))}
      </Group>
    </div>
  );
}

const Title = styled.h2`
  margin-bottom: ${space.sm};
  font-size: ${fontSizes.section};
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${space.xs};
`;

const Choice = styled.button`
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: ${sizes.touchTarget};
  padding: ${space.xs} 2px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  line-height: 1.2;
  b {
    font-size: ${fontSizes.lead};
  }
  small {
    font-size: ${fontSizes.caption};
    overflow-wrap: anywhere;
  }
  &[aria-checked='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.bold};
  }
`;
