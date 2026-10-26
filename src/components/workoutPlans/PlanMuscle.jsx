import { useState } from 'react';
import styled from 'styled-components';
import ExerciseDetails from './ExerciseDetails';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { muscleLabel } from '../../utils/workoutPlan';

export default function PlanMuscle({ muscle }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const label = muscleLabel(muscle.name, t);

  return (
    <Card>
      <ItemHeader
        title={<Title>{label}</Title>}
        actions={
          <ToggleButton
            name={label}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
          />
        }
      />
      {isExpanded &&
        (muscle.exercises ?? []).map((exercise, index) => (
          <ExerciseBox key={exercise.id ?? index}>
            <ExerciseDetails exercise={exercise} />
          </ExerciseBox>
        ))}
    </Card>
  );
}

const Card = styled.li`
  width: 95%;
  margin: 5px 0 10px;
  border-radius: ${radii.large};
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
`;

const Title = styled.h4`
  font-size: 1.1rem;
`;

const ExerciseBox = styled.div`
  border: 1px solid ${colors.white};
  border-radius: ${radii.large};
`;
