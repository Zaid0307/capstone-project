import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useTranslation } from '../i18n/LanguageContext';
import { space } from '../styles/tokens';
import { filtersToSearch, parseFilters, resetFilters, toSetRows } from '../utils/analysis';
import { toDateKey } from '../utils/workoutLog';
import { migratePlan } from '../utils/workoutPlan';
import FilterBar from '../components/analysis/FilterBar';
import { planChoices } from '../components/analysis/PlanChips';
import { paths, useFormat } from '../components/analysis/format';
import { MIN_WEEKS, byDate, dashboardData } from '../components/analysis/dashboardData';
import {
  ExercisesCard,
  GroupSetsCard,
  KpiCard,
  MuscleCard,
  RecordsCard,
  SeriesCard,
  SkippedList,
  StreakCard,
  percentReference,
} from '../components/analysis/DashboardCards';

// Analysis home, the standard dashboard (spec 4.1): filters in the URL, key numbers
// with comparison, streak and schedule adherence, workouts, volume and plan
// adherence per week, muscle groups, new records and the most trained exercises.
// `today` can be passed for tests; it defaults to the local date.
export default function AnalysisPage({ plans = [], workouts = [], today: todayProp }) {
  const { t } = useTranslation();
  const format = useFormat();
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayProp ?? toDateKey();
  const search = searchParams.toString();
  const filters = useMemo(() => parseFilters(search), [search]);

  const allPlans = useMemo(() => plans.map(migratePlan), [plans]);
  const sorted = useMemo(() => [...workouts].sort(byDate), [workouts]);
  const allRows = useMemo(() => toSetRows(sorted), [sorted]);
  const data = useMemo(
    () => dashboardData({ plans: allPlans, workouts: sorted, filters, today, allRows }),
    [allPlans, sorted, filters, today, allRows]
  );

  const setFilters = next => setSearchParams(new URLSearchParams(filtersToSearch(next)));
  const reset = () => setFilters(resetFilters(filters));

  if (!data.hasAnyWorkout) {
    return (
      <PageLayout>
        <PageTitle>{t('analysis.title')}</PageTitle>
        <Message>
          <p>{t('analysis.empty.noWorkouts')}</p>
          <Button as={Link} to={paths.diary}>
            {t('analysis.empty.start')}
          </Button>
        </Message>
      </PageLayout>
    );
  }

  const noMatch = data.workoutCount === 0;
  const emptyText = noMatch ? t('analysis.empty.noMatch') : null;
  const enoughWeeks = data.fullWeeks >= MIN_WEEKS;
  const rangeText = t('analysis.rangeText', { from: format.date(data.range.from), to: format.date(data.range.to) });
  const weekly = data.workoutsSeries[0]?.unit === 'week';

  return (
    <PageLayout>
      <PageTitle>{t('analysis.title')}</PageTitle>
      <FilterBar
        filters={filters}
        choices={planChoices(allPlans, workouts, t)}
        onChange={setFilters}
        onReset={reset}
        count={data.workoutCount}
        rangeText={rangeText}
      />

      {noMatch && (
        <Message>
          <p>{emptyText}</p>
          <Button $variant="secondary" onClick={reset}>
            {t('analysis.filter.reset')}
          </Button>
        </Message>
      )}

      <Cards>
        <KpiCard kpis={data.kpis} compare={data.compare} emptyText={emptyText} />
        <StreakCard streak={data.streak} schedule={data.schedule} emptyText={emptyText} />
        <SeriesCard
          title={t(weekly ? 'analysis.workoutsChart.titleWeek' : 'analysis.workoutsChart.titleMonth')}
          valueName={t('analysis.kpi.workouts')}
          series={data.workoutsSeries}
          format={value => format.number(value)}
          reference={weekly ? { value: data.streak.weeklyTarget, label: t('analysis.workoutsChart.target', { count: data.streak.weeklyTarget }) } : null}
          enoughWeeks={enoughWeeks}
          emptyText={emptyText}
        />
        <SeriesCard
          title={t(weekly ? 'analysis.volumeChart.titleWeek' : 'analysis.volumeChart.titleMonth')}
          valueName={t('analysis.volumeChart.unit')}
          series={data.volumeSeries}
          format={value => format.number(value, 0)}
          showValues={data.volumeSeries.length <= 6}
          enoughWeeks={enoughWeeks}
          emptyText={emptyText}
        />
        <MuscleCard groupSets={data.groupSets} customSets={data.customSets} emptyText={emptyText} />
        <GroupSetsCard groupSets={data.groupSets} plannedSets={data.plannedGroupSets} enoughWeeks={enoughWeeks} emptyText={emptyText} />
        <RecordsCard records={data.records} emptyText={emptyText} />
        <SeriesCard
          title={t(weekly ? 'analysis.adherenceChart.titleWeek' : 'analysis.adherenceChart.titleMonth')}
          valueName={t('analysis.kpi.adherence')}
          series={data.adherenceSeries}
          format={value => format.percent(value)}
          reference={percentReference(format)}
          max={1}
          showValues={data.adherenceSeries.length <= 8}
          enoughWeeks={enoughWeeks}
          emptyText={emptyText || (data.adherenceSeries.every(item => item.value === null) ? t('analysis.adherenceChart.noPlan') : null)}
        >
          <SkippedList skipped={data.skipped} />
        </SeriesCard>
        <ExercisesCard exercises={data.exercises} emptyText={emptyText} />
      </Cards>
    </PageLayout>
  );
}

const Cards = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.lg};
  min-width: 0;
`;
