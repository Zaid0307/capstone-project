import styled from 'styled-components';
import { MdCancel, MdChangeCircle, MdCheckCircle, MdCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { colors, fontSizes, space } from '../../styles/tokens';
import { DAY_STATUSES } from '../../utils/analysis';

// Day status symbols (spec 4.6). Every symbol has a text: in the legend, in the
// cell's name and in the day details, so status never depends on color.
const ICONS = {
  onPlan: MdCheckCircle,
  deviated: MdChangeCircle,
  other: MdCircle,
  missed: MdCancel,
  planned: MdRadioButtonUnchecked,
  rest: null,
};

export default function StatusIcon({ status }) {
  const Icon = ICONS[status];
  return Icon ? <Icon aria-hidden="true" /> : null;
}

// Status symbol with its text, e.g. in the day details.
export function StatusText({ status }) {
  const { t } = useTranslation();
  return (
    <Labelled>
      <StatusIcon status={status} />
      {t(`calendar.status.${status}`)}
    </Labelled>
  );
}

// Legend, always visible below the month.
export function CalendarLegend() {
  const { t } = useTranslation();
  return (
    <Legend aria-label={t('calendar.legend')}>
      {DAY_STATUSES.filter(status => ICONS[status]).map(status => (
        <li key={status}>
          <StatusText status={status} />
        </li>
      ))}
      <li>
        <Labelled>
          <TodayMark aria-hidden="true">1</TodayMark>
          {t('calendar.today')}
        </Labelled>
      </li>
    </Legend>
  );
}

const Labelled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  svg {
    flex-shrink: 0;
    color: ${colors.primary};
    font-size: 1.25rem;
  }
`;

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm} ${space.lg};
  font-size: ${fontSizes.caption};
  list-style: none;
`;

const TodayMark = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${colors.text};
  border-radius: 4px;
  font-size: ${fontSizes.caption};
  line-height: 1;
`;
