import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import PlanDay from './PlanDay';
import PlanHints, { SafetyHint } from './PlanHints';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import {
  colors,
  fontSizes,
  radii,
  shadows,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel, sortDays } from '../../utils/workoutPlan';
import { routes } from '../../routes';

export default function WorkoutPlanCard({ plan, onDeletePlan, onDeleteDay }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const name = plan.nameOfWorkout;

  function handleDeletePlan() {
    if (window.confirm(t('plans.confirmDelete', { name }))) {
      onDeletePlan(plan.id);
    }
  }

  function handleDeleteDay(day) {
    const values = { day: dayLabel(day.day, t), name };
    // A plan without days is useless, so deleting the last day deletes the plan.
    if (plan.days.length === 1) {
      if (window.confirm(t('plans.confirmDeleteLastDay', values))) {
        onDeletePlan(plan.id);
      }
      return;
    }
    if (window.confirm(t('plans.confirmDeleteDay', values))) {
      onDeleteDay(plan.id, day.id);
    }
  }

  return (
    <Card>
      <ItemHeader
        title={<Title>{name}</Title>}
        actions={
          <>
            <IconButton
              aria-label={t('plans.edit', { name })}
              onClick={() => navigate(routes.editPlan(plan.id))}
            >
              <MdOutlineEdit />
            </IconButton>
            <IconButton
              aria-label={t('plans.delete', { name })}
              onClick={handleDeletePlan}
            >
              <MdOutlineDeleteForever />
            </IconButton>
            <ToggleButton
              name={name}
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
          </>
        }
      />
      {/* Safety hints stay visible, also when the plan is collapsed. */}
      <SafetyHint hints={plan.hints} />
      {isExpanded && (
        <>
          {plan.description && <Description>{plan.description}</Description>}
          <PlanHints hints={plan.hints} />
          <DayList>
            {sortDays(plan.days ?? []).map(day => (
              <PlanDay
                key={day.id}
                day={day}
                onDelete={() => handleDeleteDay(day)}
              />
            ))}
          </DayList>
        </>
      )}
    </Card>
  );
}

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Title = styled.h2`
  font-size: ${fontSizes.section};
`;

const Description = styled.p`
  color: ${colors.textMuted};
`;

const DayList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  list-style: none;
`;
