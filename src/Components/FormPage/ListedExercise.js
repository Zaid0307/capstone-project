import styled from 'styled-components';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import SpaceBetween from '../Styles/SpaceBetween';
import Center from '../Styles/Center';
import { useTranslation } from '../../i18n/LanguageContext';
import { muscleLabel } from '../../utils/workoutPlan';

export default function ListedExercise({
  newCards,
  isEditing = false,
  onEdit,
  onRemove,
}) {
  const { t } = useTranslation();

  return (
    <StyledBox isEditing={isEditing}>
      <Center>
        <p>{muscleLabel(newCards.muscle, t)}</p>
        <Actions>
          {onEdit && (
            <IconButton
              type="button"
              aria-label={t('exercise.edit', { name: newCards.exercise })}
              aria-pressed={isEditing}
              onClick={onEdit}
            >
              <MdOutlineEdit />
            </IconButton>
          )}
          {onRemove && (
            <IconButton
              type="button"
              aria-label={t('exercise.remove', { name: newCards.exercise })}
              onClick={onRemove}
            >
              <MdOutlineDeleteForever />
            </IconButton>
          )}
        </Actions>
      </Center>
      <SpaceBetween>
        <p>{t('exercise.exercise')}</p> <p>{newCards.exercise}</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>{t('exercise.weight')}</p> <p>{newCards.weight} kg</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>{t('exercise.repetitions')}</p> <p>{newCards.repetitions}</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>{t('exercise.sets')}</p> <p>{newCards.sets}</p>
      </SpaceBetween>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  position: relative;
  border: 1px solid ${props => (props.isEditing ? '#283a45' : 'lightgray')};
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px;
`;

const Actions = styled.div`
  position: absolute;
  right: 5px;
  top: 2px;
  display: flex;
  gap: 5px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.3rem;
  color: #283a45;
`;
