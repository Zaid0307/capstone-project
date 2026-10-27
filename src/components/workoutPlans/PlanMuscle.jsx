import { useState } from 'react';
import styled from 'styled-components';
import ExerciseDetails from './ExerciseDetails';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors, fontSizes, radii, space } from '../../styles/tokens';
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
      {isExpanded && (
        <ExerciseList>
          {muscle.entries.map(entry => (
            <li key={entry.id}>
              <ExerciseDetails entry={entry} />
            </li>
          ))}
        </ExerciseList>
      )}
    </Card>
  );
}

const Card = styled.li`
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const Title = styled.h4`
  font-size: ${fontSizes.body};
`;

const ExerciseList = styled.ul`
  list-style: none;
  & > li + li {
    border-top: 1px solid ${colors.surfaceMuted};
  }
`;
