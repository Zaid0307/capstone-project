import styled from 'styled-components';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import ExerciseDetails from '../workoutPlans/ExerciseDetails';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';
import { muscleLabel } from '../../utils/workoutPlan';

export default function ExerciseListItem({
  exercise,
  isEditing = false,
  onEdit,
  onRemove,
}) {
  const { t } = useTranslation();

  return (
    <Item isEditing={isEditing}>
      <ItemHeader
        title={<p>{muscleLabel(exercise.muscle, t)}</p>}
        actions={
          <>
            <IconButton
              aria-label={t('exercise.edit', { name: exercise.exercise })}
              aria-pressed={isEditing}
              onClick={onEdit}
            >
              <MdOutlineEdit />
            </IconButton>
            <IconButton
              aria-label={t('exercise.remove', { name: exercise.exercise })}
              onClick={onRemove}
            >
              <MdOutlineDeleteForever />
            </IconButton>
          </>
        }
      />
      <ExerciseDetails exercise={exercise} />
    </Item>
  );
}

const Item = styled.li`
  margin: 5px 0;
  padding: 2px;
  border: 1px solid
    ${props => (props.isEditing ? colors.text : 'lightgray')};
  border-radius: 5px;
`;
