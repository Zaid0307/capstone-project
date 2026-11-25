import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, fontWeights, radii, sizes, space } from '../styles/tokens';
import {
  addDays,
  calendarMonth,
  defaultFilters,
  filterWorkouts,
  filtersToSearch,
  isDateKey,
  isMonthKey,
  monthKeyOf,
  parseFilters,
  shiftMonth,
  weekKeyOf,
} from '../utils/analysis';
import { countsAsTraining, toDateKey } from '../utils/workoutLog';
import { migratePlan } from '../utils/workoutPlan';
import { tCount, useFormat, workoutTitle } from '../components/analysis/format';
import PlanChips, { planChoices } from '../components/analysis/PlanChips';
import { Card, CardTitle, Muted } from '../components/analysis/styles';
import MonthGrid from '../components/calendar/MonthGrid';
import DayDetails, { sessionTitle } from '../components/calendar/DayDetails';
import MonthList from '../components/calendar/MonthList';
import WeekView from '../components/calendar/WeekView';

const VIEWS = ['month', 'week', 'list'];
import { CalendarLegend } from '../components/calendar/StatusIcon';

// Calendar (spec 4.6): month with a status per day, details of the chosen day with
// plan versus actual, and the entries of the month as a list. View, month, day
// and plan filter live in the URL (?view=week&month=2026-11&day=2026-11-13&plans=a,b).
// Views: 'month' (grid, default), 'week' (seven days as a list), 'list' (entries).
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
  const viewParam = searchParams.get('view');
  const view = VIEWS.includes(viewParam) ? viewParam : 'month';

  const allPlans = useMemo(() => plans.map(migratePlan), [plans]);
  const plansById = useMemo(() => new Map(allPlans.map(plan => [plan.id, plan])), [allPlans]);
  // One month of plans and entries; cheap enough to compute on every render (the
  // React compiler memoizes it where it can).
  const planIds = filters.plans;
  const shownPlans = planIds.length ? allPlans.filter(plan => planIds.includes(plan.id)) : allPlans;
  const weeks = calendarMonth(shownPlans, filterWorkouts(workouts, { ...defaultFilters(), plans: planIds }), month, today);

  const days = weeks.flatMap(week => week.days);
  const selectedDay = days.find(day => day.date === selectedDate) ?? null;
  // The one tab stop of the grid: the chosen day, else today, else the 1st.
  const focusDate = selectedDay?.date ?? (today.startsWith(month) ? today : `${month}-01`);

  function update(changes, { replace = false } = {}) {
    const next = { plans: filters.plans, month, day: selectedDate, view, ...changes };
    const params = new URLSearchParams(filtersToSearch({ ...defaultFilters(), plans: next.plans }));
    if (next.view !== 'month') params.set('view', next.view);
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
    const done = day.workouts.filter(countsAsTraining);
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

  // The week view shows the week of the chosen day, else of today, else the 1st.
  const weekAnchor = focusDate;
  const shownWeek = weeks.find(week => week.days.some(day => day.date === weekAnchor)) ?? weeks[0];
  const moveWeek = step => {
    const date = addDays(weekAnchor, step * 7);
    update({ day: date, month: monthKeyOf(date) }, { replace: true });
  };

  const details = selectedDay ? (
    <DayDetails
      key={selectedDay.date}
      day={selectedDay}
      plansById={plansById}
      onAddWorkout={onAddWorkout}
      onDeleteWorkout={onDeleteWorkout}
    />
  ) : (
    <Muted>{t('calendar.chooseDay')}</Muted>
  );

  const monthHeader = (
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
  );

  const goToday = month !== monthKeyOf(today) && (
    <div>
      <Button $variant="secondary" onClick={() => update({ month: monthKeyOf(today), day: today })}>
        {t('calendar.goToday')}
      </Button>
    </div>
  );

  return (
    <PageLayout>
      <PageTitle>{t('calendar.title')}</PageTitle>

      {choices.length > 1 && (
        <PlanChips choices={choices} selected={filters.plans} onChange={planIds => update({ plans: planIds })} />
      )}

      <ViewSwitch role="group" aria-label={t('calendar.view.label')}>
        {VIEWS.map(item => (
          <button key={item} type="button" aria-pressed={view === item} onClick={() => update({ view: item }, { replace: true })}>
            {t(`calendar.view.${item}`)}
          </button>
        ))}
      </ViewSwitch>

      {view === 'month' && (
        <>
          <Card aria-labelledby="calendarMonthTitle">
            {monthHeader}
            {goToday}
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
          {details}
        </>
      )}

      {view === 'week' && (
        <>
          <Card aria-labelledby="calendarWeekTitle">
            <MonthHeader>
              <Button $variant="secondary" aria-label={t('calendar.previousWeek')} onClick={() => moveWeek(-1)}>
                <MdChevronLeft aria-hidden="true" />
              </Button>
              <CardTitle id="calendarWeekTitle" aria-live="polite">
                {t('calendar.weekTitle', {
                  number: Number.parseInt(weekKeyOf(shownWeek.days[0].date).slice(6), 10),
                  from: format.dateShort(shownWeek.days[0].date),
                  to: format.dateShort(shownWeek.days[6].date),
                })}
              </CardTitle>
              <Button $variant="secondary" aria-label={t('calendar.nextWeek')} onClick={() => moveWeek(1)}>
                <MdChevronRight aria-hidden="true" />
              </Button>
            </MonthHeader>
            {!shownWeek.days.some(day => day.isToday) && (
              <div>
                <Button $variant="secondary" onClick={() => update({ month: monthKeyOf(today), day: today })}>
                  {t('calendar.goToday')}
                </Button>
              </div>
            )}
            <WeekView
              week={shownWeek}
              selectedDate={selectedDate}
              onSelect={selectDay}
              labelOf={labelOf}
              format={format}
              titleId="calendarWeekTitle"
            />
          </Card>
          {details}
        </>
      )}

      {view === 'list' && (
        <Card aria-labelledby="calendarListTitle">
          {monthHeader}
          {goToday}
          <ListTitle id="calendarListTitle">{t('calendar.list.title', { month: format.month(month) })}</ListTitle>
          <MonthList weeks={weeks} month={month} titleId="calendarListTitle" />
        </Card>
      )}
    </PageLayout>
  );
}

// Three views as toggle buttons in one row, each at least 44 px high.
const ViewSwitch = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${space.xs};
  padding: ${space.xs};
  border-radius: ${radii.large};
  background-color: ${colors.surfaceMuted};
  button {
    min-height: ${sizes.touchTarget};
    border: 1px solid transparent;
    border-radius: ${radii.small};
    background-color: transparent;
    color: ${colors.text};
    font-weight: ${fontWeights.medium};
  }
  button[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.surface};
    font-weight: ${fontWeights.bold};
  }
`;

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
    min-width: ${sizes.touchTarget};
    padding: ${space.sm};
  }
`;

const ListTitle = styled(CardTitle)`
  margin-bottom: ${space.md};
`;
