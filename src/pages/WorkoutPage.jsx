import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import { MdCheck, MdClose, MdEditNote, MdOutlineDeleteForever, MdSkipNext } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import ExercisePicker from '../components/planEditor/ExercisePicker';
import { Field, FormCard, Input, Label, Select, Textarea } from '../components/planEditor/formStyles';
import Button from '../components/ui/Button';
import DecimalInput from '../components/ui/DecimalInput';
import RestTimer from '../components/workout/RestTimer';
import { FAST_ENTRY_SCOPE, fastEntryProps, focusNextField } from '../components/workout/fastEntry';
import FinishDialog from '../components/workout/FinishDialog';
import EditModeBanner from '../components/workout/EditModeBanner';
import PrefillToggle from '../components/workout/PrefillToggle';
import { usePrefillChoice } from '../components/workout/prefillChoice';
import WorkoutProgress from '../components/workout/WorkoutProgress';
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
  addWarmupSet,
  averagePerformance,
  extraExercise,
  isSetDone,
  setSuggestions,
  finishWorkout,
  insertLoggedExercise,
  isWorkoutRunning,
  insertLoggedSet,
  isMoved,
  loggedExerciseName,
  openPlannedSets,
  restsAfter,
  removeLoggedExercise,
  removeLoggedSet,
  RIR_CHOICES,
  SIDES,
  setExercisePerSide,
  setExerciseSkipped,
  updateLoggedExercise,
  updateLoggedSet,
  updateLoggedSide,
  updateWorkout,
  previousPerformance,
  workoutSummary,
} from '../utils/workoutLog';
import { formatDose, muscleLabel, supersetLabels } from '../utils/workoutPlan';
import { usesWeight } from '../data/exerciseLibrary';

const toNumber = value => (value === '' ? null : Number(String(value).replace(',', '.')));
const hasValue = value => value !== null && value !== undefined;
const asText = value => (value === null || value === undefined ? '' : String(value));

// One entry of the training diary: filled in during the training and editable later.
// Every change is saved right away.
export default function WorkoutPage({ workouts, onUpdateWorkout }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [isPicking, setIsPicking] = useState(false);
  const [isConfirmingFinish, setIsConfirmingFinish] = useState(false);
  // Exercises whose note field was opened; a note with text stays open anyway.
  const [openNotes, setOpenNotes] = useState([]);
  const focusNoteId = useRef(null);
  useEffect(() => {
    if (!focusNoteId.current) return;
    document.getElementById(focusNoteId.current)?.focus();
    focusNoteId.current = null;
  }, [openNotes]);
  const showUndo = useUndo();
  const restTimer = useRestTimer();
  const prefill = usePrefillChoice();
  const workout = workouts.find(item => item.id === workoutId);
  // Undo runs later, after other changes; it must start from the newest version.
  const latest = useRef(workout);
  useEffect(() => {
    latest.current = workout;
  }, [workout]);
  // A newly added set gets the focus, so its values can be typed right away.
  const focusSetId = useRef(null);
  useEffect(() => {
    if (!focusSetId.current) return;
    const field = document.querySelector(`[data-set-id="${focusSetId.current}"]`);
    focusSetId.current = null;
    field?.focus();
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
  const isRunning = isWorkoutRunning(workout);
  // A finished training opens in edit mode: no progress bar, no rest timer, and
  // its start and end time stay (02-tagebuch 3.5).
  const isEditing = !isSkipped && !isRunning;
  // Supersets of the plan: neighbours with the same groupId, labelled A1, A2 …
  const supersets = supersetLabels(workout.exercises);
  // The last field of the set table closes the keyboard on Enter.
  const lastSetId = workout.exercises.filter(item => !item.skipped).at(-1)?.sets.at(-1)?.id ?? null;

  // "Finish training" sets the end time and shows the summary; a finished entry
  // that is edited later keeps its end time.
  function finish() {
    setIsConfirmingFinish(false);
    restTimer.stop();
    if (isSkipped) {
      navigate(routes.diary);
      return;
    }
    if (isRunning) onUpdateWorkout(finishWorkout(workout));
    navigate(routes.workoutSummary(workout.id));
  }

  // A running training with open planned sets asks first.
  function handleFinish() {
    if (isRunning && openPlannedSets(workout) > 0) setIsConfirmingFinish(true);
    else finish();
  }

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

  // "60 kg × 10", "58,5 kg × 9,6", "12", "30 s"; per side "L … / R …".
  function formatValues(values) {
    if (!values) return '–';
    if ('left' in values) {
      return `${t('workout.sidesShort.left')} ${formatValues(values.left)} / ${t('workout.sidesShort.right')} ${formatValues(values.right)}`;
    }
    if (values.seconds !== null && values.seconds !== undefined) return `${format(values.seconds)} s`;
    const reps = values.reps === null || values.reps === undefined ? '–' : format(values.reps);
    return values.weight ? `${format(values.weight)} kg × ${reps}` : reps;
  }

  // Takes the suggestion of an open set over: fields already typed in stay, the
  // empty ones get the suggested values, and the rest starts.
  function takeOver(exercise, set, suggestion, amountKey, hasWeight) {
    const pick = (values, suggested) => ({
      ...(hasWeight ? { weight: values.weight ?? suggested?.weight ?? null } : {}),
      [amountKey]: values[amountKey] ?? suggested?.[amountKey] ?? null,
    });
    change(item =>
      exercise.perSide
        ? SIDES.reduce(
            (result, side) =>
              updateLoggedSide(result, exercise.id, set.id, side, pick(set.sides[side], suggestion?.[side])),
            item
          )
        : updateLoggedSet(item, exercise.id, set.id, pick(set, suggestion))
    );
    if (restsAfter(workout, exercise.id)) restTimer.start(exercise.restSeconds);
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
      {isEditing && <EditModeBanner workout={workout} />}
      {isRunning && <WorkoutProgress workout={workout} />}

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
          <ExerciseList aria-label={t('workout.exercises')} {...{ [FAST_ENTRY_SCOPE]: '' }}>
            {workout.exercises.map((exercise, exerciseIndex) => {
              const superset = supersets[exerciseIndex];
              const hasWeight = usesWeight(exercise.exerciseId);
              const name = loggedExerciseName(exercise, language);
              const seconds = exercise.sets.some(set => set.planned?.dose.unit === 'seconds');
              const previous = previousPerformance(workouts, workout, exercise);
              // While training, the open sets show suggested values (E48): last
              // time's or the average, as chosen; without history the plan's.
              const average = isRunning ? averagePerformance(workouts, workout, exercise) : null;
              const prefillKey = exercise.exerciseId ?? exercise.exercise;
              const prefillMode = prefill.modeOf(prefillKey);
              const suggestions = isRunning
                ? setSuggestions(exercise, prefillMode === 'average' && average ? average : previous)
                : {};
              const hasSuggestions = Object.keys(suggestions).length > 0;
              const plannedWorking = exercise.sets.filter(set => set.type === 'working' && set.planned);
              return (
                <ExerciseCard
                  key={exercise.id}
                  $isSkipped={exercise.skipped}
                  $superset={superset}
                  aria-label={superset ? `${superset.label} ${name}` : undefined}
                >
                  {superset && (
                    <SupersetLine>
                      <SupersetBadge>{superset.label}</SupersetBadge>
                      <span>
                        {t('workout.superset.badge', { group: superset.group })}
                        {' · '}
                        {superset.position === 0
                          ? t('workout.superset.flow', {
                              order: Array.from({ length: superset.size }, (_, index) => `${superset.group}${index + 1}`).join(' → '),
                            })
                          : superset.position < superset.size - 1
                            ? t('workout.superset.next', { label: `${superset.group}${superset.position + 2}` })
                            : t('workout.superset.rest')}
                      </span>
                    </SupersetLine>
                  )}
                  <Header>
                    <div>
                      <Name>{name}</Name>
                      <Muted>
                        {muscleLabel(exercise.muscle, t)}
                        {exercise.restSeconds !== null &&
                          ` · ${t('planEditor.entry.restShort', { seconds: exercise.restSeconds })}`}
                        {exercise.skipped && ` · ${t('workout.skipped')}`}
                      </Muted>
                      {plannedWorking.length > 0 && (
                        <Muted>
                          {t('workout.targetLine', {
                            target: `${plannedWorking.length} × ${target(plannedWorking[0])}`,
                          })}
                        </Muted>
                      )}
                      {/* While training, the toggle and the suggested values show last time. */}
                      {!isRunning && previous && previous.sets.length > 0 && (
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
                      {isRunning && previous && (
                        <PrefillToggle
                          name={name}
                          mode={average ? prefillMode : 'last'}
                          onChange={mode => prefill.choose(prefillKey, mode)}
                          lastText={previous.sets[0] && [formatValues(previous.sets[0]), formatShortDate(previous.date)]}
                          averageText={
                            average && [
                              t('workout.prefill.averageDetail', { values: formatValues(average.overall) }),
                              t('workout.prefill.averageCount', { count: average.sessions }),
                            ]
                          }
                        />
                      )}
                      {hasSuggestions && <Muted>{t('workout.prefill.hint')}</Muted>}
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
                              <abbr title={t('workout.rir.columnLong')}>{t('workout.rir.column')}</abbr>
                            </th>
                            <th scope="col">
                              <ScreenReaderOnly>{t('workout.prefill.doneColumn')}</ScreenReaderOnly>
                            </th>
                            <th scope="col">
                              <ScreenReaderOnly>{t('workout.removeSetColumn')}</ScreenReaderOnly>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.flatMap((set, index) => {
                            // Warm-up and working sets are numbered separately ("WU", "1", "2" …).
                            const isWarmup = set.type === 'warmup';
                            const number = exercise.sets
                              .slice(0, index + 1)
                              .filter(item => (item.type === 'warmup') === isWarmup).length;
                            const label = t(isWarmup ? 'workout.warmupLabel' : 'planEditor.set.label', { number });
                            const removeLabel = t(isWarmup ? 'workout.warmupRemove' : 'planEditor.set.remove', { number });
                            const isTimed = set.planned ? set.planned.dose.unit === 'seconds' : seconds;
                            const amountKey = isTimed ? 'seconds' : 'reps';
                            const rows = exercise.perSide ? SIDES : [null];
                            const suggestion = suggestions[set.id];
                            const setDone = isSetDone(set);
                            return rows.map((side, rowIndex) => {
                              const values = side ? set.sides[side] : set;
                              const suggested = side ? suggestion?.[side] : suggestion;
                              const suggestedWeight = values.weight === null && hasValue(suggested?.weight);
                              const suggestedAmount = values[amountKey] === null && hasValue(suggested?.[amountKey]);
                              const isLastRow = rowIndex === rows.length - 1;
                              const fieldLabel = side ? `${label} ${t(`workout.sides.${side}`)}` : label;
                              const update = changes => {
                                // The rest starts when a set gets its first amount; not for the
                                // first side of a per-side set, only when both sides are entered.
                                const wasEmpty = values.reps === null && values.seconds === null;
                                const isFilled = changes[amountKey] !== null && changes[amountKey] !== undefined;
                                const otherSide = side ? set.sides[side === 'left' ? 'right' : 'left'] : null;
                                const otherDone = !side || otherSide?.reps !== null || otherSide?.seconds !== null;
                                if (isRunning && amountKey in changes && wasEmpty && isFilled && otherDone) {
                                  // In a superset the rest waits for its last exercise.
                                  if (restsAfter(workout, exercise.id)) restTimer.start(exercise.restSeconds);
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
                                      {isWarmup ? (
                                        <WarmupTag title={label}>
                                          <span aria-hidden="true">{t('workout.warmupShort')}</span>
                                          <ScreenReaderOnly>{label}</ScreenReaderOnly>
                                        </WarmupTag>
                                      ) : (
                                        number
                                      )}
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
                                      {...fastEntryProps(false)}
                                      data-set-id={rowIndex === 0 ? set.id : undefined}
                                      aria-label={`${fieldLabel}: ${t('planEditor.set.weight')}`}
                                      aria-description={
                                        suggestedWeight
                                          ? `${t('workout.prefill.suggestion', { value: `${format(suggested.weight)} kg` })} · ${target(set)}`
                                          : target(set)
                                      }
                                      $isSuggested={suggestedWeight}
                                      placeholder={
                                        suggestedWeight
                                          ? format(suggested.weight)
                                          : hasValue(set.planned?.weight)
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
                                      {...fastEntryProps(set.id === lastSetId && isLastRow)}
                                      onKeyDown={event => {
                                        // Enter in the last empty field of an open set takes its suggestion over.
                                        if (
                                          event.key === 'Enter' &&
                                          isLastRow &&
                                          suggestion &&
                                          !setDone &&
                                          event.currentTarget.value === ''
                                        ) {
                                          takeOver(exercise, set, suggestion, amountKey, hasWeight);
                                        }
                                        focusNextField(event);
                                      }}
                                      data-set-id={rowIndex === 0 && !hasWeight ? set.id : undefined}
                                      aria-label={`${fieldLabel}: ${isTimed ? t('planEditor.set.seconds') : t('workout.reps')}`}
                                      aria-description={
                                        suggestedAmount
                                          ? t('workout.prefill.suggestion', { value: suggested[amountKey] })
                                          : undefined
                                      }
                                      $isSuggested={suggestedAmount}
                                      placeholder={
                                        suggestedAmount
                                          ? String(suggested[amountKey])
                                          : set.planned
                                            ? formatDose(set.planned.dose).replace(' s', '')
                                            : ''
                                      }
                                      value={asText(values[amountKey])}
                                      onChange={event => update({ [amountKey]: toNumber(event.target.value) })}
                                    />
                                  </td>
                                  {rowIndex === 0 && isWarmup && <td rowSpan={rows.length} />}
                                  {rowIndex === 0 && !isWarmup && (
                                    <td rowSpan={rows.length}>
                                      <RirSelect
                                        aria-label={t('workout.rir.label', { set: label })}
                                        aria-description={target(set)}
                                        $isEmpty={set.rir === null || set.rir === undefined}
                                        value={asText(set.rir)}
                                        onChange={event =>
                                          change(item =>
                                            updateLoggedSet(item, exercise.id, set.id, { rir: toNumber(event.target.value) })
                                          )
                                        }
                                      >
                                        {/* Open sets show the plan's target as a placeholder; done sets "–". */}
                                        <option value="">
                                          {!setDone && hasValue(set.planned?.rirTarget)
                                            ? set.planned.rirTarget
                                            : t('workout.rir.none')}
                                        </option>
                                        {RIR_CHOICES.map(rir => (
                                          <option key={rir} value={rir}>
                                            {rir}
                                          </option>
                                        ))}
                                      </RirSelect>
                                    </td>
                                  )}
                                  {rowIndex === 0 && (
                                    <td rowSpan={rows.length}>
                                      {setDone ? (
                                        <DoneMark title={t('workout.prefill.done', { set: label })}>
                                          <MdCheck aria-hidden="true" />
                                          <ScreenReaderOnly>{t('workout.prefill.done', { set: label })}</ScreenReaderOnly>
                                        </DoneMark>
                                      ) : (
                                        suggestion && (
                                          <TakeButton
                                            type="button"
                                            aria-label={t('workout.prefill.take', { set: label })}
                                            title={t('workout.prefill.take', { set: label })}
                                            onClick={() => takeOver(exercise, set, suggestion, amountKey, hasWeight)}
                                          >
                                            <MdCheck aria-hidden="true" />
                                          </TakeButton>
                                        )
                                      )}
                                    </td>
                                  )}
                                  {rowIndex === 0 && (
                                    <td rowSpan={rows.length}>
                                      <IconButton
                                        aria-label={removeLabel}
                                        title={removeLabel}
                                        onClick={() => {
                                          change(item => removeLoggedSet(item, exercise.id, set.id));
                                          showUndo(t(isWarmup ? 'workout.warmupRemoved' : 'workout.setRemoved', { number, name }), () =>
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
                      {exercise.sets.some(set => set.type === 'warmup') && <Muted>{t('workout.warmupHint')}</Muted>}
                      <SetButtons>
                        <Button
                          $variant="secondary"
                          onClick={() => {
                            const updated = addLoggedSet(workout, exercise.id);
                            const sets = updated.exercises.find(item => item.id === exercise.id).sets;
                            focusSetId.current = sets[sets.length - 1].id;
                            onUpdateWorkout(updated);
                          }}
                        >
                          <BiPlusCircle aria-hidden="true" />
                          {t('planEditor.set.add')}
                        </Button>
                        <Button
                          $variant="secondary"
                          aria-label={t('workout.warmupAddLabel', { name })}
                          onClick={() => {
                            const updated = addWarmupSet(workout, exercise.id);
                            const sets = updated.exercises.find(item => item.id === exercise.id).sets;
                            focusSetId.current = sets.filter(set => set.type === 'warmup').at(-1).id;
                            onUpdateWorkout(updated);
                          }}
                        >
                          <BiPlusCircle aria-hidden="true" />
                          {t('workout.warmupAdd')}
                        </Button>
                      </SetButtons>
                      {/* Note on this exercise; opened by the button, open while it has text. */}
                      {(() => {
                        const noteId = `note-${exercise.id}`;
                        const isOpen = Boolean(exercise.note) || openNotes.includes(exercise.id);
                        const noteLabel = t('workout.exerciseNote.label', { name });
                        return isOpen ? (
                          <Field>
                            <Label htmlFor={noteId}>{noteLabel}</Label>
                            <Textarea
                              id={noteId}
                              maxLength={300}
                              value={exercise.note ?? ''}
                              // Stays open while it is edited, even when the text is deleted.
                              onFocus={() =>
                                setOpenNotes(current => (current.includes(exercise.id) ? current : [...current, exercise.id]))
                              }
                              onChange={event =>
                                change(item => updateLoggedExercise(item, exercise.id, { note: event.target.value }))
                              }
                            />
                          </Field>
                        ) : (
                          <div>
                            <Button
                              $variant="secondary"
                              aria-label={noteLabel}
                              aria-expanded="false"
                              onClick={() => {
                                setOpenNotes(current => [...current, exercise.id]);
                                focusNoteId.current = noteId;
                              }}
                            >
                              <MdEditNote aria-hidden="true" />
                              {t('workout.exerciseNote.toggle')}
                            </Button>
                          </div>
                        );
                      })()}
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
        <Button onClick={handleFinish}>
          {t(isSkipped ? 'workout.finish' : isRunning ? 'workout.finishTraining' : 'workout.edit.done')}
        </Button>
      </div>
      <RestTimer timer={restTimer} />
      {isConfirmingFinish && (
        <FinishDialog
          openSets={openPlannedSets(workout)}
          onFinish={finish}
          onContinue={() => setIsConfirmingFinish(false)}
        />
      )}
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

// Exercises of one superset form a block: a bar on the left, and the cards
// inside the block sit closer together.
const ExerciseCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.large};
  background-color: ${props => (props.$isSkipped ? colors.surfaceMuted : colors.surface)};
  ${props =>
    props.$superset
      ? `border-left: 4px solid ${colors.primary};
  ${props.$superset.position > 0 ? `margin-top: calc(-1 * ${space.sm}); border-top-left-radius: 0; border-top-right-radius: 0;` : ''}
  ${props.$superset.position < props.$superset.size - 1 ? 'border-bottom-left-radius: 0; border-bottom-right-radius: 0;' : ''}`
      : ''}
`;

const SupersetLine = styled.p`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const SupersetBadge = styled.span`
  flex-shrink: 0;
  padding: 0 ${space.sm};
  border-radius: ${radii.pill};
  background-color: ${colors.primary};
  color: ${colors.onPrimary};
  font-weight: ${fontWeights.bold};
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
  min-width: 3.25rem;
  padding: 0 ${space.xs};
  /* A suggestion is not an entry yet: dashed border, muted placeholder. */
  border-style: ${props => (props.$isSuggested ? 'dashed' : 'solid')};
`;

// A done set: filled tick. An open set with a suggestion: outlined button with a
// dashed border like its suggested fields, so the two cannot be confused.
const DoneMark = styled.span`
  display: inline-grid;
  place-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border-radius: ${radii.small};
  background-color: ${colors.primary};
  color: ${colors.onPrimary};
  font-size: 1.25rem;
`;

const TakeButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border: 1px dashed ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  font-size: 1.25rem;
  &:hover {
    border-style: solid;
    background-color: ${colors.highlight};
  }
`;

// Narrow choice of the repetitions in reserve; an empty choice looks like a placeholder.
const RirSelect = styled(Select)`
  min-width: 3.25rem;
  padding: 0 ${space.xs};
  color: ${props => (props.$isEmpty ? colors.textMuted : colors.text)};
  option {
    color: ${colors.text};
  }
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

const SetButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const WarmupTag = styled.span`
  display: inline-block;
  padding: 0 ${space.xs};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.bold};
  white-space: nowrap;
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
