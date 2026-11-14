import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { WEEKDAYS } from '../../utils/workoutPlan';
import { addDays, lastDayOfMonth, mondayOf, shiftMonth } from '../../utils/analysis';
import StatusIcon from './StatusIcon';

// Moves for the arrow keys and the other grid keys (spec 4.6): days, weeks,
// start/end of the week, months (Page Up/Down).
function nextDate(date, key) {
  switch (key) {
    case 'ArrowLeft':
      return addDays(date, -1);
    case 'ArrowRight':
      return addDays(date, 1);
    case 'ArrowUp':
      return addDays(date, -7);
    case 'ArrowDown':
      return addDays(date, 7);
    case 'Home':
      return mondayOf(date);
    case 'End':
      return addDays(mondayOf(date), 6);
    case 'PageUp':
    case 'PageDown': {
      const month = shiftMonth(date.slice(0, 7), key === 'PageUp' ? -1 : 1);
      const last = lastDayOfMonth(month);
      const day = `${month}-${date.slice(8)}`;
      return day > last ? last : day;
    }
    default:
      return null;
  }
}

// The month as a grid (role="grid"): one button per day with its full status as
// name, one tab stop, arrow keys move between days and across months.
export default function MonthGrid({ weeks, focusDate, selectedDate, onSelect, labelOf, titleId }) {
  const { t } = useTranslation();
  const tableRef = useRef(null);
  const moveFocus = useRef(false);

  // After a keyboard move the new day gets the focus (also in another month).
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    tableRef.current?.querySelector(`[data-date="${focusDate}"]`)?.focus();
  }, [focusDate, weeks]);

  function handleKeyDown(event, date) {
    const next = nextDate(date, event.key);
    if (!next) return;
    event.preventDefault();
    moveFocus.current = true;
    onSelect(next);
  }

  return (
    <Grid role="grid" aria-labelledby={titleId} ref={tableRef}>
      <thead>
        <tr>
          {WEEKDAYS.map(weekday => (
            <th key={weekday} scope="col" abbr={t(`day.${weekday}`)}>
              {t(`calendar.weekdayShort.${weekday}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map(week => (
          <tr key={week.weekKey}>
            {week.days.map(day => (
              <td key={day.date} aria-selected={day.date === selectedDate}>
                <DayButton
                  type="button"
                  data-date={day.date}
                  tabIndex={day.date === focusDate ? 0 : -1}
                  aria-label={labelOf(day)}
                  aria-current={day.isToday ? 'date' : undefined}
                  $inMonth={day.inMonth}
                  $isToday={day.isToday}
                  $isSelected={day.date === selectedDate}
                  onClick={() => onSelect(day.date)}
                  onKeyDown={event => handleKeyDown(event, day.date)}
                >
                  <DayNumber aria-hidden="true">{Number.parseInt(day.date.slice(8), 10)}</DayNumber>
                  <Symbol aria-hidden="true">
                    <StatusIcon status={day.status} />
                    {day.doneCount > 1 && <Count>{day.doneCount}</Count>}
                  </Symbol>
                  <ShortText aria-hidden="true">{day.status !== 'rest' ? t(`calendar.short.${day.status}`) : ''}</ShortText>
                </DayButton>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Grid>
  );
}

const Grid = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 2px;
  th {
    padding-bottom: ${space.xs};
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
    font-weight: ${fontWeights.medium};
  }
  td {
    padding: 0;
  }
`;

const DayButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  min-width: 0;
  min-height: ${sizes.touchTarget};
  padding: ${space.xs} 0;
  border: 2px solid ${props => (props.$isToday ? colors.text : 'transparent')};
  border-radius: ${radii.small};
  background-color: ${props => (props.$isSelected ? colors.highlight : props.$inMonth ? colors.surface : colors.background)};
  color: ${props => (props.$inMonth ? colors.text : colors.textMuted)};
  font-weight: ${props => (props.$isSelected ? fontWeights.bold : fontWeights.regular)};
  outline-offset: 1px;
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
`;

const DayNumber = styled.span`
  font-variant-numeric: tabular-nums;
`;

const Symbol = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  color: ${colors.primary};
  font-size: 1.25rem;
`;

const Count = styled.span`
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.bold};
`;

// Short status text only where there is room (desktop); phones use the legend.
const ShortText = styled.span`
  display: none;
  max-width: 100%;
  overflow: hidden;
  font-size: ${fontSizes.caption};
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (min-width: 720px) {
    display: block;
  }
`;
