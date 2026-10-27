import styled from 'styled-components';
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
    entry.weight !== null && ['exercise.weight', `${entry.weight} kg`],
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
  padding: 5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 5px;
`;
