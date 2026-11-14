import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import { MdClose, MdOutlineDeleteForever, MdSkipNext } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import ExercisePicker from '../components/planEditor/ExercisePicker';
import { Field, FormCard, Input, Label, Select, Textarea } from '../components/planEditor/formStyles';
import Button from '../components/ui/Button';
import DecimalInput from '../components/ui/DecimalInput';
import RestTimer from '../components/workout/RestTimer';
import useRestTimer from '../hooks/useRestTimer';
import IconButton from '../components/ui/IconButton';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useUndo } from '../components/ui/UndoProvider';
import ScreenReaderOnly from '../components/ui/ScreenReaderOnly';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import {
  addLoggedExercise,
  addLoggedSet,
  extraExercise,
  insertLoggedExercise,
  insertLoggedSet,
  isMoved,
  loggedExerciseName,
  removeLoggedExercise,
  removeLoggedSet,
  SIDES,
  setExercisePerSide,
  setExerciseSkipped,
  updateLoggedSet,
  updateLoggedSide,
  updateWorkout,
  previousPerformance,
  workoutSummary,
} from '../utils/workoutLog';
import { formatDose, muscleLabel } from '../utils/workoutPlan';
import { usesWeight } from '../data/exerciseLibrary';

const toNumber = value => (value === '' ? null : Number(String(value).replace(',', '.')));
const asText = value => (value === null || value === undefined ? '' : String(value));

// One entry of the training diary: filled in during the training and editable later.
// Every change is saved right away.
export default function WorkoutPage({ workouts, onUpdateWorkout }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [isPicking, setIsPicking] = useState(false);
  const showUndo = useUndo();
  const restTimer = useRestTimer();
  const workout = workouts.find(item => item.id === workoutId);
  // Undo runs later, after other changes; it must start from the newest version.
  const latest = useRef(workout);
  useEffect(() => {
    latest.current = workout;
  }, [workout]);

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

  const change = update => onUpdateWorkout(update(workout));
  const summary = workoutSummary(workout);
  const format = value => value.toLocaleString(language, { maximumFractionDigits: 1 });
  const title = workout.plan
    ? `${workout.plan.planName} · ${workout.plan.dayName || t(`day.${workout.plan.weekday}`)}`
    : t('diary.freeWorkout');
  const isSkipped = workout.status === 'skipped';

  function formatShortDate(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-').map(Number);
    return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'numeric' }).format(new Date(year, month - 1, day));
  }

  // "60 × 10", "12" (no weight), "30 s", or "L 12 × 10 / R 12 × 9" per side.
  function formatPreviousSet(item) {
    const one = values => {
      if (!values) return '–';
      if (values.seconds !== null && values.seconds !== undefined) return `${format(values.seconds)} s`;
      const reps = values.reps ?? '–';
      return values.weight ? `${format(values.weight)} × ${reps}` : `${reps}`;
    };
    if ('left' in item) {
      return `${t('workout.sidesShort.left')} ${one(item.left)} / ${t('workout.sidesShort.right')} ${one(item.right)}`;
    }
    return one(item);
  }

  function target(set) {
    if (!set.planned) return t('workout.extraSet');
    const weight = set.planned.weight !== null ? ` · ${format(set.planned.weight)} kg` : '';
    const rir =
      set.planned.rirTarget !== null && set.planned.rirTarget !== undefined
        ? ` · ${t('workout.rirTarget', { rir: set.planned.rirTarget })}`
        : '';
    return `${formatDose(set.planned.dose)}${weight}${rir}`;
  }

  return (
    <PageLayout>
      <PageTitle>{title}</PageTitle>

      <FormCard aria-label={t('workout.details')}>
        <Fields>
          <Field>
            <Label htmlFor="workoutDate">{t('diary.date')}</Label>
            <Input
              id="workoutDate"
              type="date"
              value={workout.date}
              onChange={event => event.target.value && change(item => updateWorkout(item, { date: event.target.value }))}
            />
          </Field>
          <Field>
            <Label htmlFor="workoutStatus">{t('workout.status')}</Label>
            <Select
              id="workoutStatus"
              value={workout.status}
              onChange={event => change(item => updateWorkout(item, { status: event.target.value }))}
            >
              <option value="done">{t('diary.status.done')}</option>
              <option value="skipped">{t('diary.status.skipped')}</option>
            </Select>
          </Field>
        </Fields>
        {!isSkipped && isMoved(workout) && (
          <Muted>{t('diary.status.moved', { day: t(`day.${workout.plan.weekday}`) })}</Muted>
        )}
        <Field>
          <Label htmlFor="workoutNote">{t('workout.note')}</Label>
          <Textarea
            id="workoutNote"
            maxLength={500}
            value={workout.note}
            onChange={event => change(item => updateWorkout(item, { note: event.target.value }))}
          />
        </Field>
      </FormCard>

      {!isSkipped && (
        <>
          <ExerciseList aria-label={t('workout.exercises')}>
            {workout.exercises.map(exercise => {
              const hasWeight = usesWeight(exercise.exerciseId);
              const name = loggedExerciseName(exercise, language);
              const seconds = exercise.sets.some(set => set.planned?.dose.unit === 'seconds');
              const previous = previousPerformance(workouts, workout, exercise);
              return (
                <ExerciseCard key={exercise.id} $isSkipped={exercise.skipped}>
                  <Header>
                    <div>
                      <Name>{name}</Name>
                      <Muted>
                        {muscleLabel(exercise.muscle, t)}
                        {exercise.restSeconds !== null &&
                          ` · ${t('planEditor.entry.restShort', { seconds: exercise.restSeconds })}`}
                        {exercise.skipped && ` · ${t('workout.skipped')}`}
                      </Muted>
                      {previous && previous.sets.length > 0 && (
                        <Muted>
                          {t('workout.lastTime', {
                            date: formatShortDate(previous.date),
                            sets: previous.sets.map(item => formatPreviousSet(item)).join(' · '),
                          })}
                        </Muted>
                      )}
                      {previous?.suggestion && !exercise.skipped && (
                        <Suggestion>
                          {t('workout.suggestion', {
                            from: format(previous.suggestion.from),
                            to: format(previous.suggestion.to),
                          })}
                        </Suggestion>
                      )}
                    </div>
                    <Tools>
                      <SideToggle
                        type="button"
                        aria-label={t('workout.perSide', { name })}
                        title={t('workout.perSide', { name })}
                        aria-pressed={exercise.perSide}
                        onClick={() => change(item => setExercisePerSide(item, exercise.id, !exercise.perSide))}
                      >
                        L/R
                      </SideToggle>
                      <IconButton
                        aria-label={t(exercise.skipped ? 'workout.unskip' : 'workout.skip', { name })}
                        title={t(exercise.skipped ? 'workout.unskip' : 'workout.skip', { name })}
                        aria-pressed={exercise.skipped}
                        onClick={() => change(item => setExerciseSkipped(item, exercise.id, !exercise.skipped))}
                      >
                        <MdSkipNext />
                      </IconButton>
                      {/* Planned exercises are skipped, not deleted, so the comparison with the plan stays complete. */}
                      {exercise.plannedEntryId === null && (
                        <IconButton
                          aria-label={t('workout.removeExercise', { name })}
                          title={t('workout.removeExercise', { name })}
                          onClick={() => {
                            const index = workout.exercises.indexOf(exercise);
                            change(item => removeLoggedExercise(item, exercise.id));
                            showUndo(t('workout.exerciseRemoved', { name }), () =>
                              onUpdateWorkout(insertLoggedExercise(latest.current, exercise, index))
                            );
                          }}
                        >
                          <MdOutlineDeleteForever />
                        </IconButton>
                      )}
                    </Tools>
                  </Header>

                  {!exercise.skipped && (
                    <>
                      <SetTable>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            {exercise.perSide && (
                              <th scope="col">
                                <ScreenReaderOnly>{t('workout.side')}</ScreenReaderOnly>
                              </th>
                            )}
                            {hasWeight && <th scope="col">kg</th>}
                            <th scope="col">{seconds ? t('planEditor.set.seconds') : t('workout.reps')}</th>
                            <th scope="col">
                              <ScreenReaderOnly>{t('workout.removeSetColumn')}</ScreenReaderOnly>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.flatMap((set, index) => {
                            const label = t('planEditor.set.label', { number: index + 1 });
                            const isTimed = set.planned ? set.planned.dose.unit === 'seconds' : seconds;
                            const amountKey = isTimed ? 'seconds' : 'reps';
                            const rows = exercise.perSide ? SIDES : [null];
                            return rows.map((side, rowIndex) => {
                              const values = side ? set.sides[side] : set;
                              const fieldLabel = side ? `${label} ${t(`workout.sides.${side}`)}` : label;
                              const update = changes => {
                                // The rest starts when a set gets its first amount; not for the
                                // first side of a per-side set, only when both sides are entered.
                                const wasEmpty = values.reps === null && values.seconds === null;
                                const isFilled = changes[amountKey] !== null && changes[amountKey] !== undefined;
                                const otherSide = side ? set.sides[side === 'left' ? 'right' : 'left'] : null;
                                const otherDone = !side || otherSide?.reps !== null || otherSide?.seconds !== null;
                                if (amountKey in changes && wasEmpty && isFilled && otherDone) {
                                  restTimer.start(exercise.restSeconds);
                                }
                                change(item =>
                                  side
                                    ? updateLoggedSide(item, exercise.id, set.id, side, changes)
                                    : updateLoggedSet(item, exercise.id, set.id, changes)
                                );
                              };
                              return (
                                <SetRow
                                  key={`${set.id}-${side ?? 'set'}`}
                                  $isDone={values.reps !== null || values.seconds !== null}
                                  $startsSet={rowIndex === 0}
                                >
                                  {rowIndex === 0 && (
                                    <th scope="row" rowSpan={rows.length}>
                                      {set.type === 'warmup' ? t('workout.warmupShort') : index + 1}
                                    </th>
                                  )}
                                  {side && (
                                    <td>
                                      <SideLabel title={t(`workout.sides.${side}`)}>
                                        {t(`workout.sidesShort.${side}`)}
                                      </SideLabel>
                                    </td>
                                  )}
                                  {hasWeight && (
                                  <td>
                                    <DecimalInput
                                      as={SmallInput}
                                      aria-label={`${fieldLabel}: ${t('planEditor.set.weight')}`}
                                      aria-description={target(set)}
                                      placeholder={
                                        set.planned?.weight !== null && set.planned?.weight !== undefined
                                          ? format(set.planned.weight)
                                          : ''
                                      }
                                      value={values.weight}
                                      onValueChange={weight => update({ weight })}
                                    />
                                  </td>
                                  )}
                                  <td>
                                    <SmallInput
                                      type="number"
                                      min="0"
                                      inputMode="numeric"
                                      aria-label={`${fieldLabel}: ${isTimed ? t('planEditor.set.seconds') : t('workout.reps')}`}
                                      placeholder={set.planned ? formatDose(set.planned.dose).replace(' s', '') : ''}
                                      value={asText(values[amountKey])}
                                      onChange={event => update({ [amountKey]: toNumber(event.target.value) })}
                                    />
                                  </td>
                                  {rowIndex === 0 && (
                                    <td rowSpan={rows.length}>
                                      <IconButton
                                        aria-label={t('planEditor.set.remove', { number: index + 1 })}
                                        title={t('planEditor.set.remove', { number: index + 1 })}
                                        onClick={() => {
                                          change(item => removeLoggedSet(item, exercise.id, set.id));
                                          showUndo(t('workout.setRemoved', { number: index + 1, name }), () =>
                                            onUpdateWorkout(insertLoggedSet(latest.current, exercise.id, set, index))
                                          );
                                        }}
                                      >
                                        <MdClose />
                                      </IconButton>
                                    </td>
                                  )}
                                </SetRow>
                              );
                            });
                          })}
                        </tbody>
                      </SetTable>
                      <div>
                        <Button $variant="secondary" onClick={() => change(item => addLoggedSet(item, exercise.id))}>
                          <BiPlusCircle aria-hidden="true" />
                          {t('planEditor.set.add')}
                        </Button>
                      </div>
                    </>
                  )}
                </ExerciseCard>
              );
            })}
          </ExerciseList>

          {isPicking ? (
            <ExercisePicker
              onAdd={entries =>
                change(item =>
                  entries.reduce((result, entry) => addLoggedExercise(result, extraExercise(entry)), item)
                )
              }
              onClose={() => setIsPicking(false)}
            />
          ) : (
            <div>
              <Button $variant="secondary" onClick={() => setIsPicking(true)}>
                <BiPlusCircle aria-hidden="true" />
                {t('planEditor.day.addExercise')}
              </Button>
            </div>
          )}

          <FormCard aria-labelledby="workoutSummaryTitle">
            <SectionTitle id="workoutSummaryTitle">{t('workout.summary')}</SectionTitle>
            <p>
              {[
                t('diary.setsDone', { done: summary.doneSets, planned: summary.plannedSets }),
                summary.volume ? `${format(summary.volume)} kg` : null,
                summary.bodyweightReps ? t('workout.bodyweightReps', { count: summary.bodyweightReps }) : null,
                summary.seconds ? t('workout.holdTime', { time: `${Math.floor(summary.seconds / 60)}:${String(summary.seconds % 60).padStart(2, '0')}` }) : null,
                summary.adherence !== null ? t('diary.adherence', { percent: Math.round(summary.adherence * 100) }) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </FormCard>
        </>
      )}

      <div>
        <Button
          onClick={() => {
            restTimer.stop();
            navigate(routes.diary);
          }}
        >
          {t('workout.finish')}
        </Button>
      </div>
      <RestTimer timer={restTimer} />
    </PageLayout>
  );
}

const SectionTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.sm};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const ExerciseList = styled.ol`
  display: grid;
  gap: ${space.md};
  list-style: none;
`;

const ExerciseCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.large};
  background-color: ${props => (props.$isSkipped ? colors.surfaceMuted : colors.surface)};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  & > div:first-child {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const Name = styled.p`
  font-weight: ${fontWeights.medium};
`;

const Tools = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const SetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
  th,
  td {
    padding: 2px;
    text-align: left;
  }
  thead th {
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
    font-weight: ${fontWeights.regular};
  }
`;

// Rows with entered values are highlighted; that is how a set counts as done.
const SetRow = styled.tr`
  background-color: ${props => (props.$isDone ? colors.highlight : 'transparent')};
  border-top: ${props => (props.$startsSet ? `1px solid ${colors.surfaceMuted}` : 'none')};
`;

const SmallInput = styled(Input)`
  min-width: 3.5rem;
  padding: 0 ${space.sm};
`;

const SideToggle = styled.button`
  min-width: ${sizes.touchTarget};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.xs};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.bold};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
  }
`;

const SideLabel = styled.span`
  font-weight: ${fontWeights.bold};
`;

const Suggestion = styled.p`
  margin-top: ${space.xs};
  padding: ${space.xs} ${space.sm};
  border-radius: ${radii.small};
  background-color: ${colors.highlight};
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.medium};
`;
