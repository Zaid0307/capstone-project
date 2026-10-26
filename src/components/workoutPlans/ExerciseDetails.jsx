import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';

// Shows the values of one exercise of a workout plan.
export default function ExerciseDetails({ exercise }) {
  const { t } = useTranslation();
  const rows = [
    ['exercise.exercise', exercise.exercise],
    ['exercise.weight', `${exercise.weight} kg`],
    ['exercise.repetitions', exercise.repetitions],
    ['exercise.sets', exercise.sets],
  ];

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
