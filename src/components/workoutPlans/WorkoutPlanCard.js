import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import PlanDay from './PlanDay';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors } from '../../styles/colors';
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
    const question = t('plans.confirmDeleteDay', {
      day: dayLabel(day.day, t),
      name,
    });
    if (window.confirm(question)) {
      onDeleteDay(plan.id, day.id);
    }
  }

  return (
    <Card>
      <Header
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
      {isExpanded && (
        <>
          {plan.description && <Description>{plan.description}</Description>}
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
  margin: 15px 10px;
  padding: 10px;
  border-radius: 15px;
  background-color: ${colors.surface};
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

const Header = styled(ItemHeader)`
  border-radius: 15px;
  background-color: ${colors.secondary};
  color: ${colors.text};
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: normal;
`;

const Description = styled.p`
  margin: 10px 5px 0;
  color: ${colors.text};
  text-align: center;
`;

const DayList = styled.ul`
  list-style: none;
`;
