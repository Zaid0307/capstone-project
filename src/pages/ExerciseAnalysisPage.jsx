import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdStar } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, sizes, space } from '../styles/tokens';
import { MUSCLES } from '../data/muscles';
import {
  defaultFilters,
  exerciseBests,
  exerciseKeyOf,
  filterRows,
  filterWorkouts,
  filtersToSearch,
  firstToLast,
  isCountable,
  parseFilters,
  personalRecords,
  rangeOf,
  repRecords,
  resetFilters,
  roundToHalf,
  sessionBest,
  sessionMetric,
  toSetRows,
} from '../utils/analysis';
import { isSetDone, toDateKey } from '../utils/workoutLog';
import { libraryExercise, migratePlan, summarizeSets } from '../utils/workoutPlan';
import ChartCard from '../components/analysis/ChartCard';
import ColumnChart from '../components/analysis/ColumnChart';
import DataTable from '../components/analysis/DataTable';
import FilterBar from '../components/analysis/FilterBar';
import LineChart, { yDomain } from '../components/analysis/LineChart';
import { planChoices } from '../components/analysis/PlanChips';
import { byDate } from '../components/analysis/dashboardData';
import { exerciseNameOf, paths, useFormat, workoutTitle } from '../components/analysis/format';
import { Card, CardTitle, Muted, PlainList, Segmented, Stats } from '../components/analysis/styles';

const KG_METRICS = ['e1rm', 'weight', 'volume'];
const LINE_METRICS = ['e1rm', 'weight', 'seconds'];
const SIDE_STYLE = { null: { marker: 'circle', dashed: false }, left: { marker: 'circle', dashed: false }, right: { marker: 'square', dashed: true } };

// History of one exercise (spec 4.4): key numbers, a chart per metric (estimated
// max, heaviest weight, volume, reps), records by type, set records for 1–12 reps
// and the list of sessions. Per-side exercises keep left and right apart.
// The exercise key comes from the route (/analysis/exercise/:exerciseKey).
export default function ExerciseAnalysisPage({ plans = [], workouts = [], today: todayProp }) {
  const { t, language } = useTranslation();
  const format = useFormat();
  const { exerciseKey = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayProp ?? toDateKey();
  const search = searchParams.toString();
  const filters = useMemo(() => parseFilters(search), [search]);
  const allPlans = useMemo(() => plans.map(migratePlan), [plans]);
  const sorted = useMemo(() => [...workouts].sort(byDate), [workouts]);
  const allRows = useMemo(() => toSetRows(sorted), [sorted]);
  const [chosenMetric, setChosenMetric] = useState(null);

  const name = exerciseNameOf(exerciseKey, language);
  const library = libraryExercise(exerciseKey);
  const exerciseRows = useMemo(
    () => filterRows(allRows.filter(row => row.exerciseKey === exerciseKey), { ...defaultFilters(), plans: filters.plans }, null),
    [allRows, exerciseKey, filters.plans]
  );
  const exerciseWorkouts = sorted.filter(workout => workout.exercises.some(item => exerciseKeyOf(item) === exerciseKey));
  const range = rangeOf(filters, today, { workouts: exerciseWorkouts, plans: allPlans });
  const rows = filterRows(exerciseRows, filters, range);
  const sessions = sessionBest(rows);
  const records = useMemo(() => personalRecords(exerciseRows), [exerciseRows]);

  const setFilters = next => setSearchParams(new URLSearchParams(filtersToSearch(next)));
  const header = (
    <>
      <BackLink to={paths.analysis}>
        <MdArrowBack aria-hidden="true" />
        {t('analysis.exercise.back')}
      </BackLink>
      <PageTitle>{name}</PageTitle>
      {library && (
        <Muted>
          {[
            t(`analysis.category.${library.category}`),
            library.muscles.primary.length
              ? t('analysis.exercise.primary', { muscles: library.muscles.primary.map(id => MUSCLES[id]?.[language] ?? id).join(', ') })
              : null,
            library.muscles.secondary.length
              ? t('analysis.exercise.secondary', { muscles: library.muscles.secondary.map(id => MUSCLES[id]?.[language] ?? id).join(', ') })
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Muted>
      )}
    </>
  );

  if (!exerciseRows.some(row => isCountable(row))) {
    return (
      <PageLayout>
        {header}
        <Message>
          <p>{t('analysis.exercise.empty')}</p>
          <Button as={Link} to={paths.plans}>
            {t('analysis.exercise.addToPlan')}
          </Button>
        </Message>
      </PageLayout>
    );
  }

  const perSide = exerciseRows.some(row => row.side);
  const sides = perSide ? ['left', 'right'] : [null];
  const hasWeight = exerciseRows.some(row => row.weight > 0);
  const onlySeconds = !exerciseRows.some(row => row.reps > 0) && exerciseRows.some(row => row.seconds > 0);
  const metrics = hasWeight ? ['e1rm', 'weight', 'volume', 'reps'] : onlySeconds ? ['seconds'] : ['reps'];
  const metric = metrics.includes(chosenMetric) ? chosenMetric : metrics[0];
  const sideLabel = side => (side ? t(`analysis.side.${side}`) : name);
  const showValue = (value, kind = metric) =>
    value === null || value === undefined
      ? '–'
      : KG_METRICS.includes(kind)
        ? format.kg(kind === 'e1rm' ? roundToHalf(value) : value)
        : kind === 'seconds'
          ? `${format.number(value)} s`
          : format.number(value);
  const bySide = (getValue, kind) =>
    sides
      .map(side => {
        const value = getValue(sessions.filter(session => session.side === side));
        return perSide ? `${t(`analysis.sideShort.${side}`)} ${showValue(value, kind)}` : showValue(value, kind);
      })
      .join(' · ');
  const maxOf = (items, kind) => {
    const values = items.map(item => sessionMetric(item, kind)).filter(value => value !== null);
    return values.length ? Math.max(...values) : null;
  };
  const workoutIds = new Set(rows.filter(row => isCountable(row)).map(row => row.workoutId));
  const recordKeys = new Set(
    records.filter(record => record.type === (metric === 'weight' ? 'heaviestWeight' : metric === 'e1rm' ? 'bestE1rm' : metric === 'seconds' ? 'longestHold' : 'mostReps'))
      .map(record => `${record.workoutId}|${record.side}`)
  );
  const recordWorkouts = new Set(records.map(record => record.workoutId));

  // Chart data
  const series = sides.map(side => ({
    key: String(side),
    label: sideLabel(side),
    ...SIDE_STYLE[side],
    points: sessions
      .filter(session => session.side === side && sessionMetric(session, metric) !== null)
      .map(session => ({ date: session.date, value: sessionMetric(session, metric), isRecord: recordKeys.has(`${session.workoutId}|${side}`) })),
  }));
  const isLine = LINE_METRICS.includes(metric);
  const pointCount = Math.max(...series.map(item => item.points.length));
  const perWorkout = [...new Set(sessions.map(session => session.workoutId))].map(workoutId => {
    const items = sessions.filter(session => session.workoutId === workoutId);
    return { key: workoutId, date: items[0].date, value: items.reduce((total, item) => total + (sessionMetric(item, metric) ?? 0), 0) };
  });
  const metricName = t(`analysis.metric.${metric}`);
  const chartTitle = t('analysis.exercise.chartTitle', { metric: metricName });
  const lineValues = series.flatMap(item => item.points.map(point => point.value));
  const summary = isLine
    ? series
        .filter(item => item.points.length)
        .map(item =>
          t('analysis.exercise.lineSummary', {
            name: item.label,
            count: item.points.length,
            first: showValue(item.points[0].value),
            last: showValue(item.points[item.points.length - 1].value),
          })
        )
        .join('; ')
    : t('analysis.exercise.barSummary', { count: perWorkout.length, last: showValue(perWorkout[perWorkout.length - 1]?.value) });
  const tableRows = isLine
    ? [...new Set(series.flatMap(item => item.points.map(point => point.date)))].sort().map(date => ({
        key: date,
        cells: [
          format.dateMedium(date),
          ...series.map(item => {
            const points = item.points.filter(point => point.date === date);
            return points.length ? points.map(point => `${showValue(point.value)}${point.isRecord ? ` (${t('analysis.exercise.record')})` : ''}`).join(', ') : '–';
          }),
        ],
      }))
    : perWorkout.map(item => ({ key: item.key, cells: [format.dateMedium(item.date), showValue(item.value)] }));

  let chartNote = null;
  if (metric === 'e1rm' && lineValues.length === 0) chartNote = t('analysis.lowData.e1rm');
  else if (!hasWeight && !onlySeconds) chartNote = t('analysis.lowData.noWeight');
  const enoughPoints = isLine ? pointCount >= 2 : perWorkout.length >= 2;

  // Session list, newest first.
  const sessionList = filterWorkouts(exerciseWorkouts, filters, range)
    .filter(workout => workout.status === 'done')
    .reverse()
    .map(workout => ({ workout, exercises: workout.exercises.filter(item => exerciseKeyOf(item) === exerciseKey && !item.skipped) }))
    .filter(item => item.exercises.some(exercise => exercise.sets.some(isSetDone)));
  const valuesText = values => {
    if (values.reps === null && values.seconds === null) return '–';
    if (values.reps === null) return `${format.number(values.seconds)} s`;
    return values.weight > 0 ? `${format.number(values.weight)} × ${format.number(values.reps)}` : format.number(values.reps);
  };
  const setsText = exercise =>
    exercise.sets
      .filter(set => set.type === 'working' && isSetDone(set))
      .map(set =>
        set.sides
          ? `${t('analysis.sideShort.left')} ${valuesText(set.sides.left)} / ${t('analysis.sideShort.right')} ${valuesText(set.sides.right)}`
          : valuesText(set)
      )
      .join(', ');
  const targetText = exercise => {
    const planned = exercise.sets.filter(set => set.planned).map(set => ({ type: set.type, dose: set.planned.dose, weight: set.planned.weight }));
    return planned.length ? summarizeSets(planned, language) : null;
  };

  const e1rmChange = sides.map(side => firstToLast(sessions.filter(session => session.side === side).map(session => session.e1rm)));
  const bests = exerciseBests(exerciseRows, exerciseKey);
  const setRecords = repRecords(exerciseRows, exerciseKey);
  const repsWithRecords = [...new Set(setRecords.map(record => record.reps))].sort((a, b) => a - b);

  return (
    <PageLayout>
      {header}
      <FilterBar
        filters={filters}
        choices={planChoices(allPlans, exerciseWorkouts, t)}
        onChange={setFilters}
        onReset={() => setFilters(resetFilters(filters))}
        count={workoutIds.size}
        rangeText={t('analysis.rangeText', { from: format.date(range.from), to: format.date(range.to) })}
      />

      <Card aria-labelledby="exerciseKpiTitle">
        <CardTitle id="exerciseKpiTitle">{t('analysis.kpi.title')}</CardTitle>
        {sessions.length === 0 ? (
          <p>{t('analysis.exercise.noneInRange')}</p>
        ) : (
          <Stats>
            {hasWeight && (
              <>
                <div>
                  <dt>{t('analysis.metric.bestE1rm')}</dt>
                  <dd>{bySide(items => maxOf(items, 'e1rm'), 'e1rm')}</dd>
                </div>
                <div>
                  <dt>{t('analysis.metric.heaviest')}</dt>
                  <dd>{bySide(items => maxOf(items, 'weight'), 'weight')}</dd>
                </div>
              </>
            )}
            {!hasWeight && (
              <div>
                <dt>{t(onlySeconds ? 'analysis.metric.longestHold' : 'analysis.metric.mostReps')}</dt>
                <dd>{bySide(items => maxOf(items, onlySeconds ? 'seconds' : 'reps'), onlySeconds ? 'seconds' : 'reps')}</dd>
              </div>
            )}
            <div>
              <dt>{t('analysis.exercise.sessions')}</dt>
              <dd>{format.number(workoutIds.size, 0)}</dd>
            </div>
            {hasWeight && (
              <div>
                <dt>{t('analysis.exercise.change')}</dt>
                <dd>
                  {sides
                    .map((side, index) => {
                      const change = e1rmChange[index];
                      const text = change ? `${change.difference >= 0 ? '+' : '−'}${format.kg(roundToHalf(Math.abs(change.difference)))}` : '–';
                      return perSide ? `${t(`analysis.sideShort.${side}`)} ${text}` : text;
                    })
                    .join(' · ')}
                </dd>
              </div>
            )}
          </Stats>
        )}
      </Card>

      <ChartCard
        title={chartTitle}
        summary={summary}
        renderChart={
          enoughPoints && !(metric === 'e1rm' && lineValues.length === 0)
            ? ids =>
                isLine ? (
                  <>
                    <LineChart series={series} formatValue={value => format.number(value)} formatDate={format.date} {...ids} />
                    {metric !== 'seconds' && <Muted>{t('analysis.exercise.axisFrom', { value: format.kg(roundToHalf(yDomain(lineValues)[0])) })}</Muted>}
                  </>
                ) : (
                  <ColumnChart
                    data={perWorkout.map(item => ({ key: item.key, label: format.date(item.date), value: item.value, valueLabel: format.number(item.value, 0) }))}
                    showValues={perWorkout.length <= 8}
                    {...ids}
                  />
                )
            : null
        }
        table={
          <DataTable
            caption={chartTitle}
            columns={[t('analysis.exercise.date'), ...(isLine ? series.map(item => item.label) : [metricName])]}
            rows={tableRows}
          />
        }
        footer={
          <>
            {isLine && pointCount > 0 && <Muted>{t(perSide ? 'analysis.exercise.legend' : 'analysis.exercise.legendSingle')}</Muted>}
            {chartNote && <Muted>{chartNote}</Muted>}
          </>
        }
      >
        {metrics.length > 1 && (
          <Segmented role="group" aria-label={t('analysis.exercise.metric')}>
            {metrics.map(item => (
              <button key={item} type="button" aria-pressed={item === metric} onClick={() => setChosenMetric(item)}>
                {t(`analysis.metric.${item}`)}
              </button>
            ))}
          </Segmented>
        )}
        {!enoughPoints && <p>{t('analysis.lowData.twoSessions')}</p>}
      </ChartCard>

      <Card aria-labelledby="exerciseBestsTitle">
        <CardTitle id="exerciseBestsTitle">{t('analysis.exercise.bests')}</CardTitle>
        <PlainList>
          {bests.map(best => (
            <li key={`${best.type}-${best.side}`}>
              {t(`analysis.record.${best.type}`)}
              {best.side ? ` (${t(`analysis.side.${best.side}`)})` : ''}: <strong>{showValue(best.value, best.type === 'longestHold' ? 'seconds' : best.type === 'mostReps' ? 'reps' : best.type === 'bestE1rm' ? 'e1rm' : 'weight')}</strong> ·{' '}
              {format.dateMedium(best.date)}
            </li>
          ))}
        </PlainList>
        {repsWithRecords.length > 0 && (
          <DataTable
            caption={t('analysis.exercise.repRecords')}
            columns={[t('analysis.exercise.reps'), ...sides.map(side => (side ? t(`analysis.side.${side}`) : t('analysis.exercise.heaviest')))]}
            rows={repsWithRecords.map(reps => ({
              key: reps,
              cells: [
                format.number(reps, 0),
                ...sides.map(side => {
                  const record = setRecords.find(item => item.reps === reps && item.side === side);
                  return record ? `${format.kg(record.weight)} (${format.date(record.date)})` : '–';
                }),
              ],
            }))}
          />
        )}
      </Card>

      <Card aria-labelledby="exerciseSessionsTitle">
        <CardTitle id="exerciseSessionsTitle">{t('analysis.exercise.sessionList')}</CardTitle>
        {sessionList.length === 0 ? (
          <p>{t('analysis.exercise.noneInRange')}</p>
        ) : (
          <PlainList>
            {sessionList.map(({ workout, exercises }) => (
              <Session key={workout.id}>
                <Link to={paths.workout(workout.id)}>
                  {format.dateMedium(workout.date)} · {workoutTitle(workout, t)}
                </Link>
                {exercises.map(exercise => (
                  <span key={exercise.id}>
                    {setsText(exercise)}
                    {targetText(exercise) && <Muted as="span"> · {t('analysis.exercise.target', { target: targetText(exercise) })}</Muted>}
                  </span>
                ))}
                {recordWorkouts.has(workout.id) && (
                  <RecordTag>
                    <MdStar aria-hidden="true" />
                    {t('analysis.exercise.record')}
                  </RecordTag>
                )}
              </Session>
            ))}
          </PlainList>
        )}
      </Card>
    </PageLayout>
  );
}

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  align-self: flex-start;
  min-height: ${sizes.touchTarget};
  color: ${colors.text};
`;

const Session = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  min-width: 0;
  padding-bottom: ${space.sm};
  border-bottom: 1px solid ${colors.surfaceMuted};
  overflow-wrap: anywhere;
`;

const RecordTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  svg {
    color: ${colors.primary};
  }
`;
