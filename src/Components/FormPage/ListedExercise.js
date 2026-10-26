import styled from 'styled-components';
import { MdOutlineDeleteForever } from 'react-icons/md';
import SpaceBetween from '../Styles/SpaceBetween';
import Center from '../Styles/Center';
import { useTranslation } from '../../i18n/LanguageContext';
import { muscleLabel } from '../../utils/workoutPlan';

export default function ListedExercise({ newCards, onRemove }) {
  const { t } = useTranslation();

  return (
    <StyledBox>
      <Center>
        <p>{muscleLabel(newCards.muscle, t)}</p>
        {onRemove && (
          <RemoveButton
            type="button"
            aria-label={t('exercise.remove', { name: newCards.exercise })}
            onClick={onRemove}
          >
            <MdOutlineDeleteForever />
          </RemoveButton>
        )}
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
  border: 1px solid lightgray;
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 5px;
  top: 2px;
  background-color: transparent;
  border: none;
  font-size: 1.3rem;
  color: #283a45;
`;
