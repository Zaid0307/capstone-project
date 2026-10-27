import styled from 'styled-components';
import { colors, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { entryName, formatDose } from '../../utils/workoutPlan';

// Shows the values of one exercise entry of a workout plan.
export default function ExerciseDetails({ entry }) {
  const { t, language } = useTranslation();
  const { dose } = entry;
  const rows = [
    ['exercise.exercise', entryName(entry, language)],
    ['exercise.sets', entry.sets],
    [dose.unit === 'seconds' ? 'exercise.duration' : 'exercise.repetitions', formatDose(dose)],
    entry.weight !== null && ['exercise.weight', `${entry.weight.toLocaleString(language)} kg`],
    entry.restSeconds !== null && ['exercise.rest', `${entry.restSeconds} s`],
    entry.rirTarget !== null && entry.rirTarget !== undefined && ['exercise.rir', entry.rirTarget],
  ].filter(Boolean);

  return (
    <List>
      {rows.map(([label, value]) => (
        <Row key={label}>
          <dt>{t(label)}</dt>
          <dd>{value}</dd>
        </Row>
      ))}
    </List>
  );
}

const List = styled.dl`
  padding: ${space.sm} 0;
`;

// Label and value side by side; the value moves below when space is short.
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  column-gap: ${space.md};
  dt {
    color: ${colors.textMuted};
  }
  dd {
    margin-left: auto;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;
