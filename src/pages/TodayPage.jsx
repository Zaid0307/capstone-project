import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import { MdOutlineSettings } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import {
  createFreeWorkout,
  createWorkoutFromPlan,
  suggestDay,
  toDateKey,
  weekdayOf,
  workoutSummary,
} from '../utils/workoutLog';
import { WEEKDAYS, dayTitle, isPlanActive, migratePlan, orderedDays } from '../utils/workoutPlan';

// Monday of the current week, as date key.
function weekStart(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return toDateKey(date);
}

// What is due today in each active plan, started with one tap. Weekday plans
// say honestly when today is a rest day and name the next training day.
function todayOf(plan, today, workouts) {
  const doneToday = workouts.find(
    workout => workout.plan?.planId === plan.id && workout.date === today && workout.status === 'done'
  );
  if (plan.schedule?.type === 'rotation') {
    return { day: suggestDay(plan, today, workouts), isRestDay: false, doneToday };
  }
  const weekday = weekdayOf(today);
  const day = orderedDays(plan).find(item => item.weekday === weekday) ?? null;
  if (day) return { day, isRestDay: false, doneToday };
  const order = index => (WEEKDAYS.indexOf(index) - WEEKDAYS.indexOf(weekday) + 7) % 7;
  const next = [...plan.days]
    .filter(item => item.weekday)
    .sort((a, b) => order(a.weekday) - order(b.weekday))[0];
  return { day: null, next, isRestDay: true, doneToday };
}

export default function TodayPage({ plans, workouts, onAddWorkout }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const today = toDateKey();
  const activePlans = plans.map(migratePlan).filter(isPlanActive);
  const format = value => value.toLocaleString(language, { maximumFractionDigits: 1 });

  function start(workout) {
    onAddWorkout(workout);
    navigate(routes.workout(workout.id));
  }

  const thisWeek = workouts.filter(workout => workout.date >= weekStart(today));
  const done = thisWeek.filter(workout => workout.status === 'done');
  const summaries = done.map(workoutSummary);
  const dateLabel = new Date(`${today}T12:00:00`).toLocaleDateString(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <PageLayout>
      <Header>
        <div>
          <PageTitle>{t('today.title')}</PageTitle>
          <Muted>{dateLabel}</Muted>
        </div>
        <SettingsLink to={routes.settings} aria-label={t('today.settings')} title={t('today.settings')}>
          <MdOutlineSettings aria-hidden="true" />
        </SettingsLink>
      </Header>

      {activePlans.length === 0 ? (
        <Message>
          <p>{t('today.noPlans')}</p>
          <Button onClick={() => navigate(routes.newPlan)}>
            <BiPlusCircle aria-hidden="true" />
            {t('plans.create')}
          </Button>
        </Message>
      ) : (
        <PlanList aria-label={t('today.activePlans')}>
          {activePlans.map(plan => {
            const { day, next, isRestDay, doneToday } = todayOf(plan, today, workouts);
            return (
              <li key={plan.id}>
                <PlanCard>
                  <PlanName>{plan.nameOfWorkout}</PlanName>
                  {doneToday ? (
                    <>
                      <p>{t('today.doneToday')}</p>
                      <div>
                        <Button $variant="secondary" onClick={() => navigate(routes.workout(doneToday.id))}>
                          {t('today.openTraining')}
                        </Button>
                      </div>
                    </>
                  ) : isRestDay ? (
                    <>
                      <p>
                        {next
                          ? t('today.restDayNext', { day: dayTitle(next, plan.schedule, t) })
                          : t('today.restDay')}
                      </p>
                      <div>
                        <Button $variant="secondary" onClick={() => navigate(routes.diaryForPlan(plan.id))}>
                          {t('today.trainAnyway')}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{dayTitle(day, plan.schedule, t)}</strong>
                        {day.name && plan.schedule.type !== 'rotation' ? ` – ${day.name}` : ''}
                        {' · '}
                        {t('today.exerciseCount', { count: day.entries.length })}
                      </p>
                      <Buttons>
                        <Button onClick={() => start(createWorkoutFromPlan(plan, day, today, workouts))}>
                          {t('diary.start')}
                        </Button>
                        <Button $variant="secondary" onClick={() => navigate(routes.diaryForPlan(plan.id))}>
                          {t('today.otherDay')}
                        </Button>
                      </Buttons>
                    </>
                  )}
                </PlanCard>
              </li>
            );
          })}
        </PlanList>
      )}

      <div>
        <Button $variant="secondary" onClick={() => start(createFreeWorkout(today))}>
          {t('diary.startFree')}
        </Button>
      </div>

      <section aria-labelledby="todayWeekTitle">
        <SectionTitle id="todayWeekTitle">{t('diary.weekTitle')}</SectionTitle>
        <Stats>
          <div>
            <dt>{t('diary.stats.trainings')}</dt>
            <dd>{done.length}</dd>
          </div>
          <div>
            <dt>{t('diary.stats.sets')}</dt>
            <dd>{summaries.reduce((total, summary) => total + summary.doneSets, 0)}</dd>
          </div>
          <div>
            <dt>{t('diary.stats.volume')}</dt>
            <dd>{format(summaries.reduce((total, summary) => total + summary.volume, 0))} kg</dd>
          </div>
        </Stats>
        <AllEntries to={routes.diary}>{t('today.allEntries')}</AllEntries>
      </section>
    </PageLayout>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${space.md};
`;

const SettingsLink = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border-radius: ${radii.small};
  color: ${colors.text};
  font-size: 1.5rem;
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const PlanList = styled.ul`
  display: grid;
  gap: ${space.md};
  list-style: none;
`;

const PlanCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const PlanName = styled.h2`
  font-size: ${fontSizes.section};
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${space.sm};
  font-size: ${fontSizes.section};
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

const AllEntries = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: ${sizes.touchTarget};
  margin-top: ${space.sm};
  color: ${colors.primary};
  font-weight: ${fontWeights.medium};
`;
