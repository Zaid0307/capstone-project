import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdEmojiEvents } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useUndo } from '../components/ui/UndoProvider';
import useNow from '../components/workout/useNow';
import FeelingPicker from '../components/workout/FeelingPicker';
import { formatDuration, workoutTitle } from '../components/workout/workoutText';
import { newRecordsOf } from '../components/workout/workoutRecords';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import { ON_PLAN_THRESHOLD } from '../utils/analysis/adherence';
import { roundToHalf } from '../utils/analysis/strength';
import {
  hasDoneSets,
  isWorkoutRunning,
  loggedExerciseName,
  updateWorkout,
  workoutDeviations,
  workoutDuration,
  workoutSummary,
} from '../utils/workoutLog';

const KG_RECORDS = ['heaviestWeight', 'bestE1rm'];

// Shown after "Finish training" (docs/ux/02-tagebuch.md, 3.3 and 4.6): duration,
// sets, volume, plan adherence, new personal records and the deviations from the plan.
export default function WorkoutSummaryPage({ workouts, onAddWorkout, onUpdateWorkout, onDeleteWorkout }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const showUndo = useUndo();
  const { workoutId } = useParams();
  const workout = workouts.find(item => item.id === workoutId);
  const now = useNow(Boolean(workout && isWorkoutRunning(workout)));

  if (!workout) {
    return (
      <PageLayout>
        <Message role="alert">
          <p>{t('workout.notFound')}</p>
          <Link to={routes.diary}>{t('workout.backToDiary')}</Link>
        </Message>
      </PageLayout>
    );
  }

  const format = value => value.toLocaleString(language, { maximumFractionDigits: 1 });
  const summary = workoutSummary(workout);
  const duration = formatDuration(workoutDuration(workout, now), t);
  const isEmpty = !hasDoneSets(workout);
  const records = isEmpty ? [] : newRecordsOf(workout, workouts);
  const deviations = workoutDeviations(workout);
  const nameOf = exercise => loggedExerciseName(exercise, language);
  const exerciseById = id => workout.exercises.find(item => item.id === id);
  const dateLabel = new Date(`${workout.date}T12:00:00`).toLocaleDateString(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const holdTime = `${Math.floor(summary.seconds / 60)}:${String(summary.seconds % 60).padStart(2, '0')}`;

  function recordValue(record) {
    if (record.type === 'longestHold') return `${format(record.value)} s`;
    if (KG_RECORDS.includes(record.type)) return `${format(roundToHalf(record.value))} kg`;
    return format(record.value);
  }

  function recordText(record) {
    const side = record.side ? ` (${t(`workout.sides.${record.side}`)})` : '';
    return t('summary.records.item', {
      exercise: `${nameOf(record.exercise)}${side}`,
      type: t(`analysis.record.${record.type}`),
      value: recordValue(record),
      previous: recordValue({ ...record, value: record.previous }),
    });
  }

  function deviationText(deviation) {
    const exercise = nameOf(exerciseById(deviation.exerciseId));
    if (deviation.type === 'skipped') return t('summary.deviations.skipped', { exercise });
    return deviation.count === 1
      ? t('summary.deviations.missingSet', { exercise })
      : t('summary.deviations.missingSets', { exercise, count: deviation.count });
  }

  function handleDiscard() {
    onDeleteWorkout(workout.id);
    showUndo(t('diary.running.discarded'), () => onAddWorkout(workout));
    navigate(routes.today);
  }

  return (
    <PageLayout>
      <div>
        <PageTitle>{t('summary.title')}</PageTitle>
        <Muted>
          {workoutTitle(workout, t)} · {dateLabel}
        </Muted>
      </div>

      {isEmpty && (
        <Message role="status">
          <p>{t('summary.empty')}</p>
        </Message>
      )}

      <Card aria-labelledby="summaryFiguresTitle">
        <SectionTitle id="summaryFiguresTitle">{t('summary.keyFigures')}</SectionTitle>
        <Figures>
          <div>
            <dt>{t('summary.duration')}</dt>
            <dd>{duration ?? t('summary.durationUnknown')}</dd>
          </div>
          <div>
            <dt>{t('summary.sets')}</dt>
            <dd>
              {summary.plannedSets
                ? t('summary.setsValue', { done: summary.doneSets, planned: summary.plannedSets })
                : summary.doneSets}
            </dd>
          </div>
          <div>
            <dt>{t('summary.volume')}</dt>
            <dd>{format(summary.volume)} kg</dd>
          </div>
          {summary.bodyweightReps > 0 && (
            <div>
              <dt>{t('summary.bodyweightReps')}</dt>
              <dd>{summary.bodyweightReps}</dd>
            </div>
          )}
          {summary.seconds > 0 && (
            <div>
              <dt>{t('summary.holdTime')}</dt>
              <dd>{holdTime} min</dd>
            </div>
          )}
          {summary.adherence !== null && (
            <div>
              <dt>{t('summary.adherence')}</dt>
              <dd>
                {Math.round(summary.adherence * 100)} %
                <Status>
                  {t(summary.adherence >= ON_PLAN_THRESHOLD ? 'summary.status.onPlan' : 'summary.status.deviated')}
                </Status>
              </dd>
            </div>
          )}
        </Figures>
      </Card>

      {!isEmpty && (
        <Card aria-labelledby="summaryRecordsTitle">
          <SectionTitle id="summaryRecordsTitle">{t('summary.records.title')}</SectionTitle>
          {records.length === 0 ? (
            <p>{t('summary.records.none')}</p>
          ) : (
            <List>
              {records.map(record => (
                <Record key={`${record.exercise.id}-${record.side}-${record.type}`}>
                  <MdEmojiEvents aria-hidden="true" />
                  <span>{recordText(record)}</span>
                </Record>
              ))}
            </List>
          )}
        </Card>
      )}

      {workout.plan && (
        <Card aria-labelledby="summaryDeviationsTitle">
          <SectionTitle id="summaryDeviationsTitle">{t('summary.deviations.title')}</SectionTitle>
          {deviations.length === 0 ? (
            <p>{t('summary.deviations.none')}</p>
          ) : (
            <List>
              {deviations.map(deviation => (
                <li key={`${deviation.exerciseId}-${deviation.type}`}>{deviationText(deviation)}</li>
              ))}
            </List>
          )}
        </Card>
      )}

      {/* Needs onUpdateWorkout; without it the rating is not offered. */}
      {onUpdateWorkout && !isEmpty && (
        <Card as="div">
          <FeelingPicker
            value={workout.feeling ?? null}
            onChange={feeling => onUpdateWorkout(updateWorkout(workout, { feeling }))}
          />
        </Card>
      )}

      {workout.note && (
        <Card aria-labelledby="summaryNoteTitle">
          <SectionTitle id="summaryNoteTitle">{t('summary.note')}</SectionTitle>
          <Note>{workout.note}</Note>
        </Card>
      )}

      <Buttons>
        <Button onClick={() => navigate(routes.today)}>{t('summary.done')}</Button>
        <Button $variant="secondary" onClick={() => navigate(routes.workout(workout.id))}>
          {t('summary.edit')}
        </Button>
        {isEmpty && (
          <Button $variant="secondary" onClick={handleDiscard}>
            {t('summary.discard')}
          </Button>
        )}
      </Buttons>
    </PageLayout>
  );
}

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const SectionTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

const Figures = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
  gap: ${space.sm};
  div {
    padding: ${space.sm};
    border-radius: ${radii.small};
    background-color: ${colors.surfaceMuted};
  }
  dt {
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
  }
  dd {
    font-size: ${fontSizes.lead};
    font-weight: ${fontWeights.bold};
    font-variant-numeric: tabular-nums;
  }
`;

const Status = styled.span`
  display: block;
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.medium};
`;

const List = styled.ul`
  display: grid;
  gap: ${space.xs};
  padding-left: ${space.lg};
`;

const Record = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  margin-left: calc(-1 * ${space.lg});
  list-style: none;
  overflow-wrap: anywhere;
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${colors.primary};
    font-size: 1.25rem;
  }
`;

const Note = styled.p`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
  & > * {
    min-height: ${sizes.touchTarget};
  }
`;
