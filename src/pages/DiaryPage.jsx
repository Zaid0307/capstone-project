import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdEventBusy,
  MdOutlineDeleteForever,
  MdRedo,
} from 'react-icons/md';
import SkipDialog from '../components/diary/SkipDialog';
import PageLayout from '../components/layout/PageLayout';
import { Field, FormCard, Input, Label, Select } from '../components/planEditor/formStyles';
import Button from '../components/ui/Button';
import IconButton from '../components/ui/IconButton';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useUndo } from '../components/ui/UndoProvider';
import RunningWorkoutBanner from '../components/workout/RunningWorkoutBanner';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import {
  countsAsTraining,
  createFreeWorkout,
  createSkippedWorkout,
  createWorkoutFromPlan,
  isMoved,
  isWorkoutRunning,
  runningWorkout,
  suggestDay,
  filterWorkoutsByPlans,
  toDateKey,
  weekdayOf,
  workoutSummary,
} from '../utils/workoutLog';
import { dayTitle, dayWeekdays, isPlanActive, migratePlan, orderedDays } from '../utils/workoutPlan';

// Monday of the week of a date, as date key.
function weekStart(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return toDateKey(date);
}

// The training diary: start or record a training, and every entry so far.
export default function DiaryPage({ plans, workouts, onAddWorkout, onDeleteWorkout }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const showUndo = useUndo();
  const [searchParams] = useSearchParams();
  // Only plans in use can be started; archived plans stay in the entries and filters.
  const allPlans = plans.map(migratePlan).filter(isPlanActive);
  // No plan is chosen in advance: with several plans (e.g. gym and mobility at
  // home) the training always starts with choosing the plan.
  const [planId, setPlanId] = useState(
    () => allPlans.find(plan => plan.id === searchParams.get('plan'))?.id ?? ''
  );
  const [filterPlanIds, setFilterPlanIds] = useState([]);
  const [date, setDate] = useState(() => toDateKey());
  const [chosenDayId, setChosenDayId] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);

  const running = runningWorkout(workouts);
  const plan = allPlans.find(item => item.id === planId) ?? null;
  const days = plan ? orderedDays(plan) : [];
  const suggested = plan ? suggestDay(plan, date, workouts) : null;
  const day = days.find(item => item.id === chosenDayId) ?? suggested;

  const formatDate = dateKey =>
    new Date(`${dateKey}T12:00:00`).toLocaleDateString(language, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const format = value => value.toLocaleString(language, { maximumFractionDigits: 1 });

  // Only one training runs at a time: while one runs, starting opens it instead
  // (an empty one can be discarded in the banner).
  function start(createWorkout) {
    if (running) {
      navigate(routes.workout(running.id));
      return;
    }
    const workout = createWorkout();
    onAddWorkout(workout);
    navigate(routes.workout(workout.id));
  }

  function discard(workout) {
    onDeleteWorkout(workout.id);
    showUndo(t('diary.running.discarded'), () => onAddWorkout(workout));
  }

  function recordSkipped(note) {
    setIsSkipping(false);
    onAddWorkout(createSkippedWorkout(plan, day, date, note));
  }

  function handleDelete(workout) {
    onDeleteWorkout(workout.id);
    showUndo(t('diary.deleted', { date: formatDate(workout.date) }), () => onAddWorkout(workout));
  }

  const shown = filterWorkoutsByPlans(workouts, filterPlanIds);
  const sorted = [...shown].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const thisWeek = shown.filter(workout => workout.date >= weekStart(toDateKey()));
  // Plans that have entries, also deleted ones, plus free training.
  const filterChoices = [
    ...new Map(
      workouts.filter(workout => workout.plan).map(workout => [workout.plan.planId, workout.plan.planName])
    ),
  ].concat(workouts.some(workout => !workout.plan) ? [['free', t('diary.freeWorkout')]] : []);
  const toggleFilter = id =>
    setFilterPlanIds(filterPlanIds.includes(id) ? filterPlanIds.filter(other => other !== id) : [...filterPlanIds, id]);
  // Trainings without a single done set do not count.
  const weekDone = thisWeek.filter(countsAsTraining);
  const weekSummaries = weekDone.map(workoutSummary);
  const withAdherence = weekSummaries.filter(summary => summary.adherence !== null);

  return (
    <PageLayout>
      <PageTitle>{t('diary.title')}</PageTitle>

      {running && <RunningWorkoutBanner workout={running} onDiscard={discard} />}

      <FormCard aria-labelledby="diaryStartTitle">
        <SectionTitle id="diaryStartTitle">{t('diary.startTitle')}</SectionTitle>
        {allPlans.length === 0 ? (
          <p>
            {t('diary.noPlans')} <Link to={routes.newPlan}>{t('diary.createPlan')}</Link>
          </p>
        ) : (
          <>
            <Fields>
              <Field>
                <Label htmlFor="diaryPlan">{t('diary.plan')}</Label>
                <Select
                  id="diaryPlan"
                  value={planId}
                  onChange={event => {
                    setPlanId(event.target.value);
                    setChosenDayId(null);
                  }}
                >
                  <option value="" disabled>
                    {t('diary.choosePlan')}
                  </option>
                  {allPlans.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nameOfWorkout}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label htmlFor="diaryDay">{t('diary.day')}</Label>
                <Select
                  id="diaryDay"
                  value={day?.id ?? ''}
                  disabled={!plan}
                  onChange={event => setChosenDayId(event.target.value)}
                >
                  {days.map(item => (
                    <option key={item.id} value={item.id}>
                      {dayTitle(item, plan.schedule, t)}
                      {item.name && plan.schedule.type !== 'rotation' ? ` – ${item.name}` : ''}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label htmlFor="diaryDate">{t('diary.date')}</Label>
                <Input id="diaryDate" type="date" value={date} onChange={event => event.target.value && setDate(event.target.value)} />
              </Field>
            </Fields>
            {day && plan.schedule.type !== 'rotation' && dayWeekdays(day).length > 0 && !dayWeekdays(day).includes(weekdayOf(date)) && (
              <Muted>{t('diary.movedHint', { day: dayTitle(day, plan.schedule, t) })}</Muted>
            )}
            <Buttons>
              <Button disabled={!day} onClick={() => start(() => createWorkoutFromPlan(plan, day, date, workouts))}>
                {t('diary.start')}
              </Button>
              <Button $variant="secondary" disabled={!day} aria-haspopup="dialog" onClick={() => setIsSkipping(true)}>
                <MdEventBusy aria-hidden="true" />
                {t('diary.recordSkipped')}
              </Button>
            </Buttons>
            {isSkipping && day && (
              <SkipDialog
                subject={`${plan.nameOfWorkout} · ${dayTitle(day, plan.schedule, t)} · ${formatDate(date)}`}
                onConfirm={recordSkipped}
                onCancel={() => setIsSkipping(false)}
              />
            )}
          </>
        )}
        <div>
          <Button $variant="secondary" onClick={() => start(() => createFreeWorkout(date))}>
            {t('diary.startFree')}
          </Button>
        </div>
      </FormCard>

      {filterChoices.length > 1 && (
        <FilterRow role="group" aria-label={t('diary.filterPlans')}>
          <FilterChip type="button" aria-pressed={filterPlanIds.length === 0} onClick={() => setFilterPlanIds([])}>
            {t('diary.allPlans')}
          </FilterChip>
          {filterChoices.map(([id, name]) => (
            <FilterChip key={id} type="button" aria-pressed={filterPlanIds.includes(id)} onClick={() => toggleFilter(id)}>
              {name}
            </FilterChip>
          ))}
        </FilterRow>
      )}

      <FormCard aria-labelledby="diaryWeekTitle">
        <SectionTitle id="diaryWeekTitle">{t('diary.weekTitle')}</SectionTitle>
        <Stats>
          <div>
            <dt>{t('diary.stats.trainings')}</dt>
            <dd>{weekDone.length}</dd>
          </div>
          <div>
            <dt>{t('diary.stats.skipped')}</dt>
            <dd>{thisWeek.filter(workout => workout.status === 'skipped').length}</dd>
          </div>
          <div>
            <dt>{t('diary.stats.sets')}</dt>
            <dd>{weekSummaries.reduce((total, summary) => total + summary.doneSets, 0)}</dd>
          </div>
          <div>
            <dt>{t('diary.stats.volume')}</dt>
            <dd>{format(weekSummaries.reduce((total, summary) => total + summary.volume, 0))} kg</dd>
          </div>
          <div>
            <dt>{t('diary.stats.adherence')}</dt>
            <dd>
              {withAdherence.length
                ? `${Math.round((withAdherence.reduce((total, summary) => total + summary.adherence, 0) / withAdherence.length) * 100)} %`
                : '–'}
            </dd>
          </div>
        </Stats>
      </FormCard>

      <section aria-labelledby="diaryEntriesTitle">
        <SectionTitle id="diaryEntriesTitle">{t('diary.entriesTitle')}</SectionTitle>
        {sorted.length === 0 ? (
          <Message>
            <p>{t('diary.empty')}</p>
          </Message>
        ) : (
          <EntryList>
            {sorted.map(workout => {
              const summary = workoutSummary(workout);
              const skipped = workout.status === 'skipped';
              const moved = !skipped && isMoved(workout);
              const title = workout.plan
                ? `${workout.plan.planName} · ${workout.plan.dayName || t(`day.${workout.plan.weekday}`)}`
                : t('diary.freeWorkout');
              return (
                <Entry key={workout.id} $isSkipped={skipped}>
                  <Status aria-hidden="true">
                    {skipped ? <MdEventBusy /> : moved ? <MdRedo /> : <MdCheckCircle />}
                  </Status>
                  <EntryText>
                    <Muted>{formatDate(workout.date)}</Muted>
                    <EntryLink to={routes.workout(workout.id)}>{title}</EntryLink>
                    <Muted>
                      {skipped
                        ? [t('diary.status.skipped'), workout.note].filter(Boolean).join(' · ')
                        : [
                            isWorkoutRunning(workout)
                              ? t('diary.running.title')
                              : moved
                                ? t('diary.status.moved', { day: t(`day.${workout.plan.weekday}`) })
                                : t('diary.status.done'),
                            t('diary.setsDone', { done: summary.doneSets, planned: summary.plannedSets }),
                            summary.volume ? `${format(summary.volume)} kg` : null,
                            summary.adherence !== null ? t('diary.adherence', { percent: Math.round(summary.adherence * 100) }) : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                    </Muted>
                  </EntryText>
                  <IconButton
                    aria-label={t('diary.delete', { date: formatDate(workout.date) })}
                    title={t('diary.delete', { date: formatDate(workout.date) })}
                    onClick={() => handleDelete(workout)}
                  >
                    <MdOutlineDeleteForever />
                  </IconButton>
                </Entry>
              );
            })}
          </EntryList>
        )}
      </section>
    </PageLayout>
  );
}

// One row that scrolls sideways on phones; the padding keeps focus rings visible.
const FilterRow = styled.div`
  display: flex;
  gap: ${space.sm};
  margin: calc(-1 * ${space.sm});
  padding: ${space.sm};
  overflow-x: auto;
  & > * {
    flex-shrink: 0;
  }
`;

const FilterChip = styled.button`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.sm};
  align-items: end;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
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

const EntryList = styled.ul`
  display: grid;
  gap: ${space.sm};
  margin-top: ${space.md};
  list-style: none;
`;

const Entry = styled.li`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.large};
  background-color: ${props => (props.$isSkipped ? colors.surfaceMuted : colors.surface)};
  box-shadow: ${shadows.card};
`;

const Status = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${colors.primary};
  font-size: 1.5rem;
`;

const EntryText = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

const EntryLink = styled(Link)`
  display: block;
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
`;
