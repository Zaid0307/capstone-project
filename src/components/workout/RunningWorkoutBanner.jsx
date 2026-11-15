import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdPlayCircleOutline } from 'react-icons/md';
import Button from '../ui/Button';
import { colors, fontSizes, fontWeights, radii, shadows, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';
import { hasDoneSets, workoutDuration } from '../../utils/workoutLog';
import useNow from './useNow';
import { formatDuration, workoutTitle } from './workoutText';

// "Training in progress · Push · Monday · for 42 min" with Continue, and Discard
// while nothing has been entered yet (docs/ux/02-tagebuch.md, 3.1).
export default function RunningWorkoutBanner({ workout, onDiscard }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const now = useNow();
  const duration = formatDuration(workoutDuration(workout, now), t);
  const canDiscard = Boolean(onDiscard) && !hasDoneSets(workout);

  return (
    <Banner aria-labelledby="runningWorkoutTitle">
      <Icon aria-hidden="true">
        <MdPlayCircleOutline />
      </Icon>
      <Text>
        <Title id="runningWorkoutTitle">{t('diary.running.title')}</Title>
        <p>{t('diary.running.text', { title: workoutTitle(workout, t), duration })}</p>
        <Hint>{t('diary.running.hint')}</Hint>
      </Text>
      <Buttons>
        <Button onClick={() => navigate(routes.workout(workout.id))}>{t('diary.running.continue')}</Button>
        {canDiscard && (
          <Button $variant="secondary" onClick={() => onDiscard(workout)}>
            {t('diary.running.discard')}
          </Button>
        )}
      </Buttons>
    </Banner>
  );
}

const Banner = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${space.md};
  padding: ${space.lg};
  border: 2px solid ${colors.primary};
  border-radius: ${radii.large};
  background-color: ${colors.highlight};
  box-shadow: ${shadows.card};
`;

const Icon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${colors.primary};
  font-size: 1.75rem;
`;

const Text = styled.div`
  flex: 1 1 12rem;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const Title = styled.h2`
  font-size: ${fontSizes.section};
  font-weight: ${fontWeights.bold};
`;

const Hint = styled.p`
  margin-top: ${space.xs};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
  width: 100%;
`;
