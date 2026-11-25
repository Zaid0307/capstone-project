import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { countsAsTraining } from '../../utils/workoutLog';
import { workoutTitle } from '../analysis/format';
import { StatusText } from './StatusIcon';

// One week as a list of seven days (Monday first): date, status with text and the
// trainings of the day. Choosing a day shows its details below, like in the month.
export default function WeekView({ week, selectedDate, onSelect, labelOf, format, titleId }) {
  const { t } = useTranslation();
  return (
    <Days aria-labelledby={titleId}>
      {week.days.map(day => {
        const trained = day.workouts.filter(countsAsTraining);
        return (
          <li key={day.date}>
            <Day
              type="button"
              aria-label={labelOf(day)}
              aria-pressed={day.date === selectedDate}
              aria-current={day.isToday ? 'date' : undefined}
              onClick={() => onSelect(day.date)}
            >
              <DateText $isToday={day.isToday}>{format.dateLong(day.date)}</DateText>
              <span aria-hidden="true">
                {day.status === 'rest' ? <Rest>{t('calendar.status.rest')}</Rest> : <StatusText status={day.status} />}
              </span>
              {trained.length > 0 && (
                <Small aria-hidden="true">{trained.map(workout => workoutTitle(workout, t)).join(', ')}</Small>
              )}
            </Day>
          </li>
        );
      })}
    </Days>
  );
}

const Days = styled.ol`
  display: grid;
  gap: ${space.xs};
  list-style: none;
`;

const Day = styled.button`
  display: grid;
  gap: 2px;
  width: 100%;
  min-height: ${sizes.touchTarget};
  padding: ${space.sm} ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  text-align: left;
  overflow-wrap: anywhere;
  &[aria-pressed='true'] {
    border: 2px solid ${colors.primary};
    background-color: ${colors.highlight};
  }
`;

const DateText = styled.span`
  font-weight: ${props => (props.$isToday ? fontWeights.bold : fontWeights.medium)};
`;

const Rest = styled.span`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Small = styled.span`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
