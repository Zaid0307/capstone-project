import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BiBody } from 'react-icons/bi';
import { MdArrowDownward, MdArrowUpward, MdRemove, MdStar } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, radii, space } from '../../styles/tokens';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { compareValues, loadLevel } from '../../utils/analysis';
import BulletBars from './BulletBars';
import ChartCard from './ChartCard';
import ColumnChart from './ColumnChart';
import DataTable from './DataTable';
import { exerciseNameOf, paths, tCount, useFormat } from './format';
import { Card, CardTitle, Muted, PlainList, Stats } from './styles';

export const GUIDE_BAND = [10, 20];
const ON_PLAN_LINE = 0.8;

// Label of a week or month bucket: short on the axis, longer in the table.
export function useBucketLabels() {
  const { t } = useTranslation();
  const format = useFormat();
  return {
    axis: bucket => (bucket.unit === 'week' ? format.date(bucket.from) : format.monthShort(bucket.key)),
    table: bucket =>
      bucket.unit === 'week'
        ? t('analysis.weekOf', { number: Number.parseInt(bucket.key.slice(6), 10), date: format.date(bucket.from) })
        : format.month(bucket.key),
  };
}

const mean = values => (values.length ? values.reduce((total, value) => total + value, 0) / values.length : null);

// 1 – Key numbers with the comparison to the previous period (3.10).
export function KpiCard({ kpis, compare, emptyText }) {
  const { t } = useTranslation();
  const format = useFormat();
  const show = (key, value) =>
    key === 'volume' ? format.kg(value) : key === 'adherence' ? format.percent(value) : format.number(value, 0);

  function comparison(kpi) {
    const result = compareValues(kpi.value, kpi.previous);
    if (!result) return t('analysis.kpi.noComparison');
    if (result.isNew) return t('analysis.kpi.new');
    if (result.difference === 0 || result.percent === null) return t('analysis.kpi.same');
    const up = result.difference > 0;
    // Plan adherence is a share already: the change is shown in percentage points.
    const amount =
      kpi.key === 'adherence'
        ? t('analysis.kpi.points', { value: format.number(Math.abs(result.difference) * 100, 0) })
        : `${format.number(Math.abs(result.percent) * 100, 0)} %`;
    return t('analysis.kpi.vsPrevious', { arrow: up ? '▲' : '▼', percent: amount });
  }

  return (
    <Card aria-labelledby="kpiTitle">
      <CardTitle id="kpiTitle">{t('analysis.kpi.title')}</CardTitle>
      {emptyText ? (
        <p>{emptyText}</p>
      ) : (
        <Stats>
          {kpis.map(kpi => {
            const result = compare ? compareValues(kpi.value, kpi.previous) : null;
            const Icon = !result || result.difference === 0 ? MdRemove : result.difference > 0 ? MdArrowUpward : MdArrowDownward;
            return (
              <div key={kpi.key}>
                <dt>{t(`analysis.kpi.${kpi.key}`)}</dt>
                <dd>{show(kpi.key, kpi.value)}</dd>
                {compare && (
                  <dd>
                    <Icon aria-hidden="true" /> {comparison(kpi)}
                  </dd>
                )}
              </div>
            );
          })}
        </Stats>
      )}
      {!emptyText && !compare && <Muted>{t('analysis.kpi.comparisonHint')}</Muted>}
    </Card>
  );
}

// 2 – Weekly streak and schedule adherence (3.5).
export function StreakCard({ streak, schedule, emptyText }) {
  const { t } = useTranslation();
  const format = useFormat();
  return (
    <Card aria-labelledby="streakTitle">
      <CardTitle id="streakTitle">{t('analysis.streak.title')}</CardTitle>
      {emptyText ? (
        <p>{emptyText}</p>
      ) : (
        <>
          <Stats>
            <div>
              <dt>{t('analysis.streak.current')}</dt>
              <dd>{tCount(t, 'analysis.streak.weeks', streak.current)}</dd>
              <dd>{tCount(t, 'analysis.streak.target', streak.weeklyTarget)}</dd>
            </div>
            <div>
              <dt>{t('analysis.streak.longest')}</dt>
              <dd>{tCount(t, 'analysis.streak.weeks', streak.longest)}</dd>
            </div>
            <div>
              <dt>{t('analysis.schedule.title')}</dt>
              <dd>{format.percent(schedule.value)}</dd>
              <dd>
                {schedule.planned
                  ? t('analysis.schedule.text', { done: schedule.done, planned: schedule.planned })
                  : t('analysis.schedule.none')}
              </dd>
            </div>
          </Stats>
          <Muted>{t('stats.streak.targetRule')}</Muted>
          {schedule.startFromFirstWorkout && schedule.planned > 0 && <Muted>{t('analysis.schedule.fromFirstWorkout')}</Muted>}
        </>
      )}
    </Card>
  );
}

// A chart over weeks or months with its table (cards 3, 7 and volume).
export function SeriesCard({ title, series, format: formatValue, valueName, reference, max, emptyText, enoughWeeks, showValues, children }) {
  const { t } = useTranslation();
  const labels = useBucketLabels();
  const finished = series.filter(item => !item.inProgress && item.value !== null);
  const average = mean(finished.map(item => item.value));
  const last = series.length ? series[series.length - 1] : null;
  const unit = series[0]?.unit === 'month' ? 'month' : 'week';
  const summary = t('analysis.chart.summary', {
    name: title,
    count: series.length,
    unit: t(`analysis.unit.${unit}`),
    average: enoughWeeks && average !== null ? formatValue(average) : '–',
    last: last && last.value !== null ? formatValue(last.value) : '–',
  });
  const data = series.map(item => ({
    key: item.key,
    label: labels.axis(item),
    value: item.value,
    valueLabel: item.value === null ? '' : formatValue(item.value),
    inProgress: item.inProgress,
  }));

  return (
    <ChartCard
      title={title}
      summary={summary}
      renderChart={
        emptyText
          ? null
          : ids => (
              <ColumnChart
                data={data}
                reference={reference}
                max={max}
                showValues={showValues ?? series.length <= 13}
                inProgressLabel={t('analysis.inProgress')}
                {...ids}
              />
            )
      }
      table={
        <DataTable
          caption={title}
          columns={[t(`analysis.unit.${unit}Column`), valueName ?? title]}
          rows={series.map(item => ({
            key: item.key,
            cells: [
              `${labels.table(item)}${item.inProgress ? ` (${t('analysis.inProgress')})` : ''}`,
              item.value === null ? '–' : formatValue(item.value),
            ],
          }))}
        />
      }
      footer={
        emptyText ? null : (
          <>
            <Muted>
              {enoughWeeks && average !== null
                ? t('analysis.chart.average', { value: formatValue(average), unit: t(`analysis.unit.${unit}`) })
                : t('analysis.lowData.weeks')}
            </Muted>
            {children}
          </>
        )
      }
    >
      {emptyText && <p>{emptyText}</p>}
    </ChartCard>
  );
}

// 4 – Muscle figure placeholder with the full list of groups (4.9).
export function MuscleCard({ groupSets, customSets, emptyText }) {
  const { t } = useTranslation();
  const format = useFormat();
  const customTotal = Object.values(customSets).reduce((total, sets) => total + sets, 0);
  return (
    <Card aria-labelledby="muscleTitle">
      <CardTitle id="muscleTitle">{t('analysis.muscleMap.title')}</CardTitle>
      <Figure>
        <BiBody aria-hidden="true" />
        <span>{t('analysis.muscleMap.placeholder')}</span>
      </Figure>
      {emptyText ? (
        <p>{emptyText}</p>
      ) : (
        <>
          <GroupList>
            {MUSCLE_GROUP_NAMES.map(group => {
              const sets = groupSets[group] ?? 0;
              return (
                <div key={group}>
                  <dt>{t(`muscle.${group}`)}</dt>
                  <dd>
                    {t('analysis.setsPerWeek', { value: format.number(sets) })} · {t(`analysis.level.${loadLevel(sets)}`)}
                  </dd>
                </div>
              );
            })}
          </GroupList>
          <Muted>{t('analysis.muscleMap.legend')}</Muted>
          {customTotal > 0 && <Muted>{tCount(t, 'analysis.muscleMap.custom', customTotal)}</Muted>}
        </>
      )}
    </Card>
  );
}

// 5 – Effective sets per muscle group: actual per week, target of the plans, band 10–20.
export function GroupSetsCard({ groupSets, plannedSets, emptyText, enoughWeeks }) {
  const { t } = useTranslation();
  const format = useFormat();
  const title = t('analysis.groupSets.title');
  const items = MUSCLE_GROUP_NAMES.map(group => ({
    key: group,
    label: t(`muscle.${group}`),
    value: groupSets[group] ?? 0,
    valueLabel: format.number(groupSets[group] ?? 0),
    target: plannedSets[group] ?? 0,
  }));
  const hasTarget = items.some(item => item.target > 0);
  const summary = items
    .map(item =>
      hasTarget
        ? t('analysis.groupSets.itemWithTarget', { group: item.label, value: item.valueLabel, target: format.number(item.target) })
        : t('analysis.groupSets.item', { group: item.label, value: item.valueLabel })
    )
    .join('; ');
  return (
    <ChartCard
      title={title}
      summary={summary}
      renderChart={emptyText ? null : ids => <BulletBars items={items} band={GUIDE_BAND} {...ids} />}
      table={
        <DataTable
          caption={title}
          columns={[t('analysis.groupSets.group'), t('analysis.groupSets.actual'), t('analysis.groupSets.target')]}
          rows={items.map(item => ({ key: item.key, cells: [item.label, item.valueLabel, hasTarget ? format.number(item.target) : '–'] }))}
        />
      }
      footer={
        emptyText ? null : (
          <>
            <Muted>{t('analysis.groupSets.note')}</Muted>
            <Muted>{t(hasTarget ? 'analysis.groupSets.legendTarget' : 'analysis.groupSets.legend')}</Muted>
            {!enoughWeeks && <Muted>{t('analysis.lowData.weeks')}</Muted>}
          </>
        )
      }
    >
      {emptyText && <p>{emptyText}</p>}
    </ChartCard>
  );
}

// 6 – New personal records in the range, newest first.
export function RecordsCard({ records, emptyText }) {
  const { t, language } = useTranslation();
  const format = useFormat();
  const value = record =>
    ['heaviestWeight', 'bestE1rm', 'bestSetVolume', 'bestSessionVolume'].includes(record.type)
      ? format.kg(record.type === 'bestE1rm' ? Math.round(record.value * 2) / 2 : record.value)
      : record.type === 'longestHold'
        ? `${format.number(record.value)} s`
        : format.number(record.value);
  return (
    <Card aria-labelledby="recordsTitle">
      <CardTitle id="recordsTitle">{t('analysis.prs.title')}</CardTitle>
      {emptyText ? (
        <p>{emptyText}</p>
      ) : records.length === 0 ? (
        <p>{t('analysis.prs.empty')}</p>
      ) : (
        <PlainList>
          {records.map(group => (
            <Record key={group.key}>
              <MdStar aria-hidden="true" />
              <span>
                <Link to={paths.exercise(group.exerciseKey)}>{exerciseNameOf(group.exerciseKey, language)}</Link>
                {group.side ? ` (${t(`analysis.side.${group.side}`)})` : ''} ·{' '}
                {group.records.map(record => `${t(`analysis.record.${record.type}`)} ${value(record)}`).join(', ')} ·{' '}
                {format.date(group.date)}
              </span>
            </Record>
          ))}
        </PlainList>
      )}
    </Card>
  );
}

// Most often left out: exercises with the most planned sets not done.
export function SkippedList({ skipped }) {
  const { t, language } = useTranslation();
  if (!skipped.length) return null;
  return (
    <div>
      <Muted>{t('analysis.skipped.title')}</Muted>
      <PlainList>
        {skipped.map(item => (
          <li key={item.exerciseKey}>
            <Link to={paths.exercise(item.exerciseKey)}>{exerciseNameOf(item.exerciseKey, language)}</Link> ·{' '}
            {tCount(t, 'analysis.skipped.sets', item.sets)}
          </li>
        ))}
      </PlainList>
    </div>
  );
}

// Exercises with the most sessions, as links to their history.
export function ExercisesCard({ exercises, emptyText }) {
  const { t, language } = useTranslation();
  return (
    <Card aria-labelledby="exercisesTitle">
      <CardTitle id="exercisesTitle">{t('analysis.exercises.title')}</CardTitle>
      {emptyText ? (
        <p>{emptyText}</p>
      ) : (
        <PlainList>
          {exercises.map(item => (
            <li key={item.exerciseKey}>
              <Link to={paths.exercise(item.exerciseKey)}>{exerciseNameOf(item.exerciseKey, language)}</Link> ·{' '}
              {tCount(t, 'analysis.exercises.sessions', item.sessions)}
            </li>
          ))}
        </PlainList>
      )}
    </Card>
  );
}

export const percentReference = format => ({ value: ON_PLAN_LINE, label: format.percent(ON_PLAN_LINE) });

const Figure = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${space.sm};
  min-height: 10rem;
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  text-align: center;
  svg {
    font-size: 3rem;
  }
`;

const GroupList = styled.dl`
  display: grid;
  gap: ${space.xs};
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: ${space.xs} ${space.md};
    padding: ${space.xs} 0;
    border-bottom: 1px solid ${colors.surfaceMuted};
  }
  dd {
    font-variant-numeric: tabular-nums;
  }
`;

const Record = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: ${colors.primary};
  }
  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;
