import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import { useTranslation } from '../i18n/LanguageContext';
import { space } from '../styles/tokens';
import {
  calendarMonth,
  defaultFilters,
  filterWorkouts,
  filtersToSearch,
  isDateKey,
  isMonthKey,
  monthKeyOf,
  parseFilters,
  shiftMonth,
} from '../utils/analysis';
import { toDateKey } from '../utils/workoutLog';
import { migratePlan } from '../utils/workoutPlan';
import { tCount, useFormat, workoutTitle } from '../components/analysis/format';
import PlanChips, { planChoices } from '../components/analysis/PlanChips';
import { Card, CardTitle, Muted } from '../components/analysis/styles';
import MonthGrid from '../components/calendar/MonthGrid';
import DayDetails, { sessionTitle } from '../components/calendar/DayDetails';
import MonthList from '../components/calendar/MonthList';
import { CalendarLegend } from '../components/calendar/StatusIcon';

// Calendar (spec 4.6): month with a status per day, details of the chosen day with
// plan versus actual, and the entries of the month as a list. Month, day and
// plan filter live in the URL (?month=2026-11&day=2026-11-13&plans=a,b).
// `today` can be passed for tests; it defaults to the local date. Without
// onAddWorkout / onDeleteWorkout the day details only show, they offer no changes.
export default function CalendarPage({ plans = [], workouts = [], today: todayProp, onAddWorkout, onDeleteWorkout }) {
  const { t } = useTranslation();
  const format = useFormat();
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayProp ?? toDateKey();

  const filters = parseFilters(searchParams);
  const dayParam = searchParams.get('day');
  const selectedDate = isDateKey(dayParam) ? dayParam : null;
  const monthParam = searchParams.get('month');
  const month = isMonthKey(monthParam) ? monthParam : monthKeyOf(selectedDate ?? today);

  const allPlans = useMemo(() => plans.map(migratePlan), [plans]);
  const plansById = useMemo(() => new Map(allPlans.map(plan => [plan.id, plan])), [allPlans]);
  const planKey = filters.plans.join(',');
  const weeks = useMemo(() => {
    const planIds = planKey ? planKey.split(',') : [];
    const shownPlans = planIds.length ? allPlans.filter(plan => planIds.includes(plan.id)) : allPlans;
    const shownWorkouts = filterWorkouts(workouts, { ...defaultFilters(), plans: planIds });
    return calendarMonth(shownPlans, shownWorkouts, month, today);
  }, [allPlans, workouts, planKey, month, today]);

  const days = weeks.flatMap(week => week.days);
  const selectedDay = days.find(day => day.date === selectedDate) ?? null;
  // The one tab stop of the grid: the chosen day, else today, else the 1st.
  const focusDate = selectedDay?.date ?? (today.startsWith(month) ? today : `${month}-01`);

  function update(changes, { replace = false } = {}) {
    const next = { plans: filters.plans, month, day: selectedDate, ...changes };
    const params = new URLSearchParams(filtersToSearch({ ...defaultFilters(), plans: next.plans }));
    if (next.month && next.month !== monthKeyOf(today)) params.set('month', next.month);
    if (next.day) params.set('day', next.day);
    setSearchParams(params, { replace });
  }

  const selectDay = date => update({ day: date, month: monthKeyOf(date) }, { replace: true });
  const choices = planChoices(allPlans, workouts, t);

  function labelOf(day) {
    const parts = [format.dateLong(day.date)];
    if (day.isToday) parts.unshift(t('calendar.today'));
    const status = t(`calendar.status.${day.status}`);
    const done = day.workouts.filter(workout => workout.status === 'done');
    let detail = '';
    if (['onPlan', 'deviated', 'other'].includes(day.status)) {
      detail = done.map(workout => workoutTitle(workout, t)).join(', ');
    } else if (day.status === 'missed' || day.status === 'planned') {
      const sessions = day.planned.filter(session => (day.status === 'missed' ? session.state === 'missed' : session.state !== 'done'));
      const skipped = day.workouts.filter(workout => workout.status === 'skipped');
      detail = [...new Set([...sessions.map(session => sessionTitle(session, plansById, t)), ...skipped.map(workout => workoutTitle(workout, t))])].join(', ');
      const reason = skipped.find(workout => workout.note)?.note;
      if (reason) detail += ` (${t('calendar.reason', { reason })})`;
    }
    parts.push(detail ? `${status}: ${detail}` : status);
    if (done.length > 1) parts.push(tCount(t, 'calendar.list.workouts', done.length));
    return parts.join(', ');
  }

  const previous = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  return (
    <PageLayout>
      <PageTitle>{t('calendar.title')}</PageTitle>

      {choices.length > 1 && (
        <PlanChips choices={choices} selected={filters.plans} onChange={planIds => update({ plans: planIds })} />
      )}

      <Card aria-labelledby="calendarMonthTitle">
        <MonthHeader>
          <Button $variant="secondary" aria-label={t('calendar.previousMonth', { month: format.month(previous) })} onClick={() => update({ month: previous, day: null })}>
            <MdChevronLeft aria-hidden="true" />
            <span aria-hidden="true">{format.monthShort(previous)}</span>
          </Button>
          <CardTitle id="calendarMonthTitle" aria-live="polite">
            {format.month(month)}
          </CardTitle>
          <Button $variant="secondary" aria-label={t('calendar.nextMonth', { month: format.month(next) })} onClick={() => update({ month: next, day: null })}>
            <span aria-hidden="true">{format.monthShort(next)}</span>
            <MdChevronRight aria-hidden="true" />
          </Button>
        </MonthHeader>
        {month !== monthKeyOf(today) && (
          <div>
            <Button $variant="secondary" onClick={() => update({ month: monthKeyOf(today), day: today })}>
              {t('calendar.goToday')}
            </Button>
          </div>
        )}
        <MonthGrid
          weeks={weeks}
          focusDate={focusDate}
          selectedDate={selectedDate}
          onSelect={selectDay}
          labelOf={labelOf}
          titleId="calendarMonthTitle"
        />
        <Muted>{t('calendar.keyboardHint')}</Muted>
        <CalendarLegend />
      </Card>

      {selectedDay ? (
        <DayDetails
          key={selectedDay.date}
          day={selectedDay}
          plansById={plansById}
          onAddWorkout={onAddWorkout}
          onDeleteWorkout={onDeleteWorkout}
        />
      ) : (
        <Muted>{t('calendar.chooseDay')}</Muted>
      )}

      <section aria-labelledby="calendarListTitle">
        <ListTitle id="calendarListTitle">{t('calendar.list.title', { month: format.month(month) })}</ListTitle>
        <MonthList weeks={weeks} month={month} titleId="calendarListTitle" />
      </section>
    </PageLayout>
  );
}

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
  min-width: 0;
  h2 {
    flex: 1 1 auto;
    min-width: 0;
    text-align: center;
  }
  button {
    flex-shrink: 0;
    padding: ${space.sm};
  }
`;

const ListTitle = styled(CardTitle)`
  margin-bottom: ${space.md};
`;
