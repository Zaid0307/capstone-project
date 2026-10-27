import { useState } from 'react';
import styled from 'styled-components';
import { MdOutlineDeleteForever } from 'react-icons/md';
import PlanMuscle from './PlanMuscle';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors, fontSizes, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel, groupEntriesByMuscle } from '../../utils/workoutPlan';

export default function PlanDay({ day, onDelete }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const label = dayLabel(day.day, t);

  return (
    <Card>
      <ItemHeader
        title={
          <>
            <Title>{label}</Title>
            {day.name && <DayName>{day.name}</DayName>}
          </>
        }
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
        <>
          {day.note && <Note>{day.note}</Note>}
          <MuscleList>
            {groupEntriesByMuscle(day.entries ?? []).map(muscle => (
              <PlanMuscle key={muscle.name} muscle={muscle} />
            ))}
          </MuscleList>
        </>
      )}
    </Card>
  );
}

// Levels differ by surface tone and heading, not by more indentation.
const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
`;

const Title = styled.h3`
  font-size: ${fontSizes.lead};
`;

const DayName = styled.p`
  color: ${colors.textMuted};
`;

const Note = styled.p`
  color: ${colors.textMuted};
`;

const MuscleList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.sm};
  list-style: none;
`;
