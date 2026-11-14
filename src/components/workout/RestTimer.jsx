import styled from 'styled-components';
import { STEP_SECONDS } from '../../hooks/useRestTimer';
import { colors, fontSizes, fontWeights, navigationOffset, radii, shadows, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

const clock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Bar at the bottom of the training while a rest runs: time left, ±15 s, end.
// The time is read out only at the start and at the end, not every second.
export default function RestTimer({ timer }) {
  const { t } = useTranslation();
  if (!timer.isRunning) return null;
  const progress = timer.duration > 0 ? 1 - timer.remaining / timer.duration : 1;

  return (
    <Bar role="region" aria-label={t('restTimer.label')} $isDone={timer.isDone}>
      <Track aria-hidden="true">
        <Fill style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
      </Track>
      <Row>
        <Time>
          <span aria-hidden="true">{timer.isDone ? t('restTimer.done') : clock(timer.remaining)}</span>
        </Time>
        <Live aria-live="polite">
          {timer.isDone ? t('restTimer.doneAnnouncement') : t('restTimer.started', { time: clock(timer.duration) })}
        </Live>
        <Buttons>
          <Step
            type="button"
            aria-label={t('restTimer.less', { seconds: STEP_SECONDS })}
            disabled={timer.isDone}
            onClick={() => timer.adjust(-1)}
          >
            −{STEP_SECONDS}
          </Step>
          <Step
            type="button"
            aria-label={t('restTimer.more', { seconds: STEP_SECONDS })}
            onClick={() => timer.adjust(1)}
          >
            +{STEP_SECONDS}
          </Step>
          <End type="button" onClick={timer.stop}>
            {timer.isDone ? t('restTimer.close') : t('restTimer.skip')}
          </End>
        </Buttons>
      </Row>
    </Bar>
  );
}

const Bar = styled.div`
  position: sticky;
  bottom: calc(${navigationOffset} + ${space.sm});
  z-index: 4;
  overflow: hidden;
  border-radius: ${radii.large};
  background-color: ${props => (props.$isDone ? colors.primary : colors.surface)};
  color: ${props => (props.$isDone ? colors.onPrimary : colors.text)};
  box-shadow: ${shadows.card};
`;

const Track = styled.div`
  height: 4px;
  background-color: ${colors.surfaceMuted};
`;

const Fill = styled.div`
  height: 100%;
  background-color: ${colors.primary};
  transform-origin: left;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${space.sm};
  padding: ${space.sm} ${space.md};
`;

const Time = styled.p`
  font-size: ${fontSizes.section};
  font-weight: ${fontWeights.bold};
  font-variant-numeric: tabular-nums;
`;

const Live = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Buttons = styled.div`
  display: flex;
  gap: ${space.xs};
`;

const Step = styled.button`
  min-width: ${sizes.touchTarget};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.sm};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  font-variant-numeric: tabular-nums;
  &:disabled {
    opacity: 0.4;
  }
`;

const End = styled(Step)`
  border-color: transparent;
  font-weight: ${fontWeights.medium};
`;
