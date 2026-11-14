import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, fontWeights, radii, shadows, space } from '../../styles/tokens';
import { workoutStatus } from '../../utils/analysis';
import { workoutSummary } from '../../utils/workoutLog';
import { paths, tCount, useFormat, workoutTitle } from '../analysis/format';
import { Muted, PlainList } from '../analysis/styles';
import StatusIcon from './StatusIcon';

// The entries of the month as a list, newest first, grouped by week with the
// planned sessions of the week (spec 4.6 "Listenansicht").
export default function MonthList({ weeks, month, titleId }) {
  const { t } = useTranslation();
  const format = useFormat();
  const shown = [...weeks]
    .reverse()
    .map(week => ({
      ...week,
      entries: week.days
        .filter(day => day.inMonth)
        .flatMap(day => day.workouts)
        .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
    }))
    // Weeks with entries, and weeks already started that had planned sessions.
    .filter(week => week.entries.length || (week.planned && !week.days[0].isFuture));

  if (!shown.some(week => week.entries.length)) {
    return <p>{t('calendar.list.empty', { month: format.month(month) })}</p>;
  }

  return (
    <Weeks aria-labelledby={titleId}>
      {shown.map(week => {
        const done = week.entries.filter(workout => workout.status === 'done').length;
        return (
          <li key={week.weekKey}>
            <WeekHeader>
              {[
                t('calendar.list.week', { number: Number.parseInt(week.weekKey.slice(6), 10) }),
                tCount(t, 'calendar.list.workouts', done),
                week.planned ? t('calendar.list.planned', { done: week.done, planned: week.planned }) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </WeekHeader>
            <PlainList>
              {week.entries.map(workout => {
                const status = workoutStatus(workout);
                const shownStatus = status === 'skipped' ? 'missed' : status;
                const summary = workoutSummary(workout);
                return (
                  <Entry key={workout.id}>
                    <Symbol aria-hidden="true">
                      <StatusIcon status={shownStatus} />
                    </Symbol>
                    <div>
                      <Muted>{format.dateMedium(workout.date)}</Muted>
                      <EntryLink to={paths.workout(workout.id)}>{workoutTitle(workout, t)}</EntryLink>
                      <Muted>
                        {[
                          t(`calendar.status.${shownStatus}`),
                          status === 'skipped' ? workout.note : null,
                          summary.adherence !== null && status !== 'skipped' ? format.percent(summary.adherence) : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </Muted>
                    </div>
                  </Entry>
                );
              })}
            </PlainList>
          </li>
        );
      })}
    </Weeks>
  );
}

const Weeks = styled.ol`
  display: grid;
  gap: ${space.lg};
  list-style: none;
`;

const WeekHeader = styled.h3`
  margin-bottom: ${space.sm};
  font-size: ${fontSizes.body};
  font-weight: ${fontWeights.medium};
`;

const Entry = styled.li`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  min-width: 0;
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  & > div {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const Symbol = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${colors.primary};
  font-size: 1.5rem;
`;

const EntryLink = styled(Link)`
  display: block;
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
  overflow-wrap: anywhere;
`;
