import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MdAdd, MdArrowUpward, MdCancel, MdCheckCircle, MdChangeCircle, MdEventBusy, MdOutlineDeleteForever } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { setOutcome, workoutStatus } from '../../utils/analysis';
import { createSkippedWorkout, workoutSummary } from '../../utils/workoutLog';
import { entryName, formatDose } from '../../utils/workoutPlan';
import Button from '../ui/Button';
import { useUndo } from '../ui/UndoProvider';
import SkipDialog from '../diary/SkipDialog';
import { paths, useFormat, workoutTitle } from '../analysis/format';
import { Card, Muted, PlainList, SubTitle, Table, TableBox } from '../analysis/styles';
import { StatusText } from './StatusIcon';

const OUTCOME_ICONS = {
  met: MdCheckCircle,
  more: MdArrowUpward,
  repsBelow: MdChangeCircle,
  secondsBelow: MdChangeCircle,
  weightBelow: MdChangeCircle,
  notDone: MdCancel,
  extra: MdAdd,
};

// Plan and day name of a planned session.
export function sessionTitle(session, plansById, t) {
  const plan = plansById.get(session.planId);
  const day = plan?.days.find(item => item.id === session.dayId);
  const dayName = day ? day.name || (day.weekday ? t(`day.${day.weekday}`) : '') : '';
  return [plan?.nameOfWorkout ?? session.planId, dayName].filter(Boolean).join(' · ');
}

// Details of the selected day (spec 4.6): planned sessions and their state, every
// workout with status, numbers and plan versus actual per exercise and set.
// With onDeleteWorkout every workout can be deleted (with undo); with
// onAddWorkout a planned, untrained day up to today can be recorded as missed.
export default function DayDetails({ day, plansById, onAddWorkout, onDeleteWorkout }) {
  const { t, language } = useTranslation();
  const format = useFormat();
  const showUndo = useUndo();
  const headingId = `day-${day.date}`;
  const headingRef = useRef(null);
  const [skipping, setSkipping] = useState(null);

  const values = item => {
    if (item.reps === null && item.seconds === null) return '–';
    const amount = item.seconds !== null && item.reps === null ? `${format.number(item.seconds)} s` : format.number(item.reps);
    return item.weight > 0 ? `${format.number(item.weight)} kg × ${amount}` : item.seconds !== null && item.reps === null ? amount : t('calendar.reps', { count: amount });
  };
  const actual = set =>
    set.sides
      ? `${t('calendar.sideShort.left')} ${values(set.sides.left)} · ${t('calendar.sideShort.right')} ${values(set.sides.right)}`
      : values(set);
  const targetText = planned => {
    if (!planned) return '–';
    const dose = planned.dose.unit === 'seconds' ? formatDose(planned.dose) : t('calendar.reps', { count: formatDose(planned.dose) });
    return planned.weight > 0 ? `${format.number(planned.weight)} kg × ${dose}` : dose;
  };
  const sessionState = session => {
    if (session.state === 'done') {
      return session.coveredBy.date === session.date
        ? t('calendar.planned.done')
        : t('calendar.planned.doneOn', { date: format.dateShort(session.coveredBy.date) });
    }
    if (session.state === 'missed') {
      return session.skippedBy?.note ? t('calendar.planned.missedReason', { reason: session.skippedBy.note }) : t('calendar.planned.missed');
    }
    return t(`calendar.planned.${session.state}`);
  };

  const canRecord = !day.isFuture;
  const plannedToday = day.isToday ? day.planned.filter(session => session.state !== 'done') : [];

  // Planned sessions up to today that were neither trained nor recorded as missed.
  const planDayOf = session => plansById.get(session.planId)?.days.find(item => item.id === session.dayId) ?? null;
  const skippable = onAddWorkout && canRecord
    ? day.planned.filter(session => session.state !== 'done' && !session.skippedBy && planDayOf(session))
    : [];

  function handleSkip(note) {
    const session = skipping;
    setSkipping(null);
    onAddWorkout(createSkippedWorkout(plansById.get(session.planId), planDayOf(session), day.date, note));
  }

  function handleDelete(workout) {
    onDeleteWorkout(workout.id);
    // The button is gone with the workout; the day heading keeps the focus nearby.
    headingRef.current?.focus();
    showUndo(t('calendar.deleted', { name: workoutTitle(workout, t), date: format.dateShort(workout.date) }), () => onAddWorkout?.(workout));
  }

  return (
    <Card aria-labelledby={headingId}>
      <SubTitle id={headingId} ref={headingRef} tabIndex={-1}>
        {format.dateLong(day.date)}
      </SubTitle>
      <StatusText status={day.status} />

      {day.planned.length > 0 && (
        <div>
          <Muted>{t('calendar.plannedTitle')}</Muted>
          <PlainList>
            {day.planned.map(session => (
              <li key={`${session.planId}-${session.dayId}`}>
                {sessionTitle(session, plansById, t)} – {sessionState(session)}
              </li>
            ))}
          </PlainList>
        </div>
      )}

      {day.workouts.length === 0 && day.planned.length === 0 && <p>{t(day.isFuture ? 'calendar.nothingPlanned' : 'calendar.restDay')}</p>}

      {day.workouts.map(workout => (
        <WorkoutDetails
          key={workout.id}
          workout={workout}
          format={format}
          t={t}
          language={language}
          actual={actual}
          targetText={targetText}
          onDelete={onDeleteWorkout ? () => handleDelete(workout) : null}
        />
      ))}

      <Actions>
        {skippable.map(session => (
          <Button key={`skip-${session.planId}-${session.dayId}`} $variant="secondary" onClick={() => setSkipping(session)}>
            <MdEventBusy aria-hidden="true" />
            {skippable.length > 1 ? t('calendar.skipNamed', { name: sessionTitle(session, plansById, t) }) : t('calendar.skip')}
          </Button>
        ))}
        {plannedToday.map(session => (
          <Button key={session.planId} as={Link} to={`${paths.diary}?plan=${encodeURIComponent(session.planId)}`}>
            {t('calendar.startNow', { name: sessionTitle(session, plansById, t) })}
          </Button>
        ))}
        {canRecord && (
          <Button as={Link} to={paths.diary} $variant={plannedToday.length ? 'secondary' : 'primary'}>
            {t('calendar.record')}
          </Button>
        )}
      </Actions>

      {skipping && (
        <SkipDialog
          subject={`${sessionTitle(skipping, plansById, t)} · ${format.dateLong(day.date)}`}
          onConfirm={handleSkip}
          onCancel={() => setSkipping(null)}
          fallbackFocusRef={headingRef}
        />
      )}
    </Card>
  );
}

function WorkoutDetails({ workout, format, t, language, actual, targetText, onDelete }) {
  const status = workoutStatus(workout);
  const summary = workoutSummary(workout);
  const skipped = workout.status === 'skipped';
  return (
    <WorkoutBox>
      <h4>{workoutTitle(workout, t)}</h4>
      <StatusText status={status === 'skipped' ? 'missed' : status} />
      {skipped ? (
        workout.note && <p>{t('calendar.reason', { reason: workout.note })}</p>
      ) : (
        <>
          <Muted>
            {[
              summary.adherence !== null ? t('calendar.adherence', { percent: format.percent(summary.adherence) }) : null,
              t('calendar.sets', { done: summary.doneSets, planned: summary.plannedSets }),
              summary.volume ? t('calendar.volume', { volume: format.kg(summary.volume) }) : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Muted>
          {workout.note && <p>{workout.note}</p>}
          {workout.exercises.map(exercise => (
            <TableBox key={exercise.id}>
              <Table>
                <caption>
                  {entryName(exercise, language)}
                  {exercise.skipped ? ` · ${t('calendar.exerciseSkipped')}` : ''}
                  {!exercise.plannedEntryId ? ` · ${t('calendar.outcome.extra')}` : ''}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('calendar.table.set')}</th>
                    <th scope="col">{t('calendar.table.target')}</th>
                    <th scope="col">{t('calendar.table.actual')}</th>
                    <th scope="col">{t('calendar.table.result')}</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set, index) => {
                    const outcome = setOutcome(set, { skipped: exercise.skipped });
                    const Icon = OUTCOME_ICONS[outcome];
                    return (
                      <tr key={set.id}>
                        <th scope="row">{set.type === 'warmup' ? t('calendar.table.warmup', { number: index + 1 }) : index + 1}</th>
                        <td>{targetText(set.planned)}</td>
                        <td>{actual(set)}</td>
                        <td>
                          <Outcome>
                            <Icon aria-hidden="true" />
                            {t(`calendar.outcome.${outcome}`)}
                          </Outcome>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableBox>
          ))}
        </>
      )}
      <Actions>
        <Button as={Link} to={paths.workout(workout.id)} $variant="secondary">
          {t('calendar.openWorkout')}
        </Button>
        {onDelete && (
          <Button $variant="secondary" aria-label={t('calendar.deleteLabel', { name: workoutTitle(workout, t) })} onClick={onDelete}>
            <MdOutlineDeleteForever aria-hidden="true" />
            {t('calendar.delete')}
          </Button>
        )}
      </Actions>
    </WorkoutBox>
  );
}

const WorkoutBox = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  min-width: 0;
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.background};
  h4 {
    font-size: ${fontSizes.body};
    font-weight: ${fontWeights.bold};
  }
`;

const Outcome = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  svg {
    flex-shrink: 0;
    color: ${colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;
