import { useState } from 'react';
import styled from 'styled-components';
import { MdOutlineDeleteForever } from 'react-icons/md';
import PlanMuscle from './PlanMuscle';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel } from '../../utils/workoutPlan';

export default function PlanDay({ day, onDelete }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const label = dayLabel(day.day, t);

  return (
    <Card>
      <ItemHeader
        title={<Title>{label.toUpperCase()}</Title>}
        actions={
          <>
            <IconButton
              aria-label={t('plans.deleteDay', { day: label })}
              onClick={onDelete}
            >
              <MdOutlineDeleteForever />
            </IconButton>
            <ToggleButton
              name={label}
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
          </>
        }
      />
      {isExpanded && (
        <MuscleList>
          {(day.muscles ?? []).map(muscle => (
            <PlanMuscle key={muscle.id ?? muscle.name} muscle={muscle} />
          ))}
        </MuscleList>
      )}
    </Card>
  );
}

const Card = styled.li`
  margin: 10px 0;
  border-radius: ${radii.large};
  color: ${colors.text};
  box-shadow: rgba(60, 64, 67, 0.3) 0px 2px 6px 2px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  letter-spacing: 0.2em;
`;

const MuscleList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
`;
