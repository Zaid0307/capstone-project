import { useId } from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';
import { Field, Label, Select } from '../planEditor/formStyles';
import { useTranslation } from '../../i18n/LanguageContext';
import { space } from '../../styles/tokens';
import PlanChips from './PlanChips';
import { tCount } from './format';
import { Muted } from './styles';

const PRESETS = ['4w', '12w', '6m', '1y', 'all'];

// Filters of the analysis pages (spec 3.9): range and plans. They live in the URL;
// every change applies at once and the number of matching workouts is announced.
export default function FilterBar({ filters, choices, onChange, onReset, count, rangeText }) {
  const { t } = useTranslation();
  const id = useId();
  const singlePlan = filters.plans.length === 1 && filters.plans[0] !== 'free';
  const ranges = [...PRESETS, ...(singlePlan || filters.range === 'plan' ? ['plan'] : []), ...(filters.range === 'custom' ? ['custom'] : [])];
  const hasReset = filters.plans.length > 0 || filters.status.length > 0 || filters.kind.length > 0 || filters.group || filters.muscle || filters.exercise || filters.day;

  return (
    <Bar aria-label={t('analysis.filter.label')}>
      <Field>
        <Label htmlFor={`${id}range`}>{t('analysis.filter.range')}</Label>
        <Select
          id={`${id}range`}
          value={filters.range}
          onChange={event => onChange({ ...filters, range: event.target.value, from: null, to: null })}
        >
          {ranges.map(range => (
            <option key={range} value={range}>
              {t(`analysis.range.${range}`)}
            </option>
          ))}
        </Select>
      </Field>
      {choices.length > 1 && (
        <PlanChips
          choices={choices}
          selected={filters.plans}
          onChange={plans => {
            const next = { ...filters, plans, day: null };
            // "Plan duration" exists only for exactly one plan.
            if (next.range === 'plan' && plans.length !== 1) next.range = '12w';
            onChange(next);
          }}
        />
      )}
      <Status>
        <Muted role="status">
          {rangeText} · {tCount(t, 'analysis.filter.count', count)}
        </Muted>
        {hasReset && (
          <Button $variant="secondary" onClick={onReset}>
            {t('analysis.filter.reset')}
          </Button>
        )}
      </Status>
    </Bar>
  );
}

const Bar = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
`;

const Status = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;
