import styled from 'styled-components';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import ExerciseDetails from '../workoutPlans/ExerciseDetails';
import IconButton from '../ui/IconButton';
import ItemHeader from '../ui/ItemHeader';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { entryName, muscleLabel } from '../../utils/workoutPlan';

export default function ExerciseListItem({
  entry,
  isEditing = false,
  onEdit,
  onRemove,
}) {
  const { t, language } = useTranslation();
  const name = entryName(entry, language);

  return (
    <Item $isEditing={isEditing}>
      <ItemHeader
        title={
          <>
            <Muscle>{muscleLabel(entry.muscle, t)}</Muscle>
            {isEditing && <EditingText>{t('exercise.editing')}</EditingText>}
          </>
        }
        actions={
          <>
            <IconButton
              aria-label={t('exercise.edit', { name })}
              aria-pressed={isEditing}
              onClick={onEdit}
            >
              <MdOutlineEdit />
            </IconButton>
            <IconButton
              aria-label={t('exercise.remove', { name })}
              onClick={onRemove}
            >
              <MdOutlineDeleteForever />
            </IconButton>
          </>
        }
      />
      <ExerciseDetails entry={entry} />
    </Item>
  );
}

const Item = styled.li`
  padding: ${space.sm} ${space.md};
  border: 1px solid ${props => (props.$isEditing ? colors.primary : colors.surfaceMuted)};
  border-radius: ${radii.small};
  background-color: ${props => (props.$isEditing ? colors.highlight : colors.surface)};
`;

const Muscle = styled.p`
  font-weight: ${fontWeights.medium};
`;

const EditingText = styled.p`
  font-size: ${fontSizes.caption};
`;
