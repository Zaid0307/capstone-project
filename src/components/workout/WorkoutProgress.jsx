import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, shadows, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { isWorkoutRunning, workoutDuration, workoutProgress } from '../../utils/workoutLog';
import useNow from './useNow';
import { formatDuration } from './workoutText';

// Header line of the training: "3 of 12 sets" with a bar (the bar only adds to
// the text) and the time since the start. Sticks to the top while scrolling.
export default function WorkoutProgress({ workout }) {
  const { t } = useTranslation();
  const isRunning = isWorkoutRunning(workout);
  const now = useNow(isRunning);
  const { done, total } = workoutProgress(workout);
  const duration = formatDuration(workoutDuration(workout, now), t);
  const share = total ? done / total : 0;

  return (
    <Bar role="group" aria-label={t('workout.progressLabel')}>
      <Row>
        <Count>{t('workout.progress', { done, total })}</Count>
        {duration && <Time>{t('workout.duration', { duration })}</Time>}
      </Row>
      <Track aria-hidden="true">
        <Fill style={{ transform: `scaleX(${share})` }} />
      </Track>
    </Bar>
  );
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 3;
  display: grid;
  gap: ${space.xs};
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${space.xs} ${space.md};
  font-variant-numeric: tabular-nums;
`;

const Count = styled.p`
  font-weight: ${fontWeights.bold};
`;

const Time = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  align-self: center;
`;

const Track = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: ${radii.pill};
  background-color: ${colors.surfaceMuted};
`;

const Fill = styled.div`
  height: 100%;
  background-color: ${colors.primary};
  transform-origin: left;
`;
