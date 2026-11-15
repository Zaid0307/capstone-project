import styled from 'styled-components';
import { BiDumbbell, BiPlusCircle } from 'react-icons/bi';
import { MdCheck, MdClose } from 'react-icons/md';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { EQUIPMENT } from '../../data/equipment';
import { MUSCLES } from '../../data/muscles';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { exerciseVariants } from '../../utils/exerciseSearch';
import { useExerciseDetails } from '../../data/exerciseDetails';

const nameIn = (item, language) => item?.[language] ?? item?.en ?? '';

// The muscles of an exercise in their four roles; empty roles are left out,
// except the primary muscles.
const MUSCLE_ROLES = [
  ['primary', 'planEditor.preview.primary'],
  ['secondary', 'planEditor.preview.secondary'],
  ['stabilizers', 'catalog.preview.stabilizers'],
  ['stretched', 'catalog.preview.stretched'],
];

// Details of one library exercise: room for its animation, the muscles in their
// roles, setup, steps, tips, common mistakes, safety and its variants.
export default function ExercisePreview({ exercise, isSelected, onToggle, onShow, onClose }) {
  const { t, language } = useTranslation();
  const name = nameIn(exercise.name, language);
  const variants = exerciseVariants(exercise);
  const details = useExerciseDetails()?.[exercise.id];
  const muscleNames = ids => ids.map(id => nameIn(MUSCLES[id], language) || id).join(', ');
  const equipmentNames = ids => ids.map(id => nameIn(EQUIPMENT[id], language) || id).join(', ');

  return (
    <Panel aria-labelledby={`preview-${exercise.id}`}>
      <Header>
        <Title id={`preview-${exercise.id}`}>{name}</Title>
        <IconButton aria-label={t('planEditor.preview.close')} title={t('planEditor.preview.close')} onClick={onClose}>
          <MdClose />
        </IconButton>
      </Header>

      {/* The exercise animation comes from the graphics package once it is released. */}
      <Animation role="img" aria-label={t('planEditor.preview.animationMissing', { name })}>
        <BiDumbbell aria-hidden="true" />
        <span>{t('planEditor.preview.animationMissing', { name })}</span>
      </Animation>

      <Facts>
        {MUSCLE_ROLES.map(([role, label]) => {
          const muscles = exercise.muscles[role] ?? [];
          if (role !== 'primary' && muscles.length === 0) return null;
          return (
            <div key={role}>
              <dt>{t(label)}</dt>
              <dd>{muscleNames(muscles) || '–'}</dd>
            </div>
          );
        })}
        <div>
          <dt>{t('planEditor.preview.equipment')}</dt>
          <dd>{equipmentNames(exercise.equipment) || '–'}</dd>
        </div>
      </Facts>

      {details ? (
        <>
          <div>
            <Subtitle>{t('catalog.preview.setup')}</Subtitle>
            <p>{nameIn(details.setup, language)}</p>
          </div>
          <div>
            <Subtitle>{t('catalog.preview.steps')}</Subtitle>
            <TextList as="ol">
              <li>{nameIn(details.execution.start, language)}</li>
              {details.execution.steps.map((step, index) => (
                <li key={index}>{nameIn(step, language)}</li>
              ))}
            </TextList>
          </div>
          {[
            ['cues', details.execution.cues],
            ['mistakes', details.execution.mistakes],
          ].map(
            ([part, items]) =>
              items.length > 0 && (
                <div key={part}>
                  <Subtitle>{t(`catalog.preview.${part}`)}</Subtitle>
                  <TextList>
                    {items.map((item, index) => (
                      <li key={index}>{nameIn(item, language)}</li>
                    ))}
                  </TextList>
                </div>
              )
          )}
          <div>
            <Subtitle>{t('catalog.preview.safety')}</Subtitle>
            <p>{nameIn(details.execution.safety, language)}</p>
            {details.execution.contraindications && <p>{nameIn(details.execution.contraindications, language)}</p>}
          </div>
        </>
      ) : (
        <Muted role="status">{t('catalog.preview.loading')}</Muted>
      )}

      <div>
        <Button $variant={isSelected ? 'secondary' : 'primary'} aria-pressed={isSelected} onClick={() => onToggle(exercise)}>
          {isSelected ? <MdCheck aria-hidden="true" /> : <BiPlusCircle aria-hidden="true" />}
          {t(isSelected ? 'planEditor.preview.selected' : 'planEditor.preview.select')}
        </Button>
      </div>

      <Subtitle>{t('planEditor.preview.variants')}</Subtitle>
      {variants.length === 0 ? (
        <Muted>{t('planEditor.preview.noVariants')}</Muted>
      ) : (
        <VariantList aria-label={t('planEditor.preview.variantsOf', { name })}>
          {variants.map(variant => {
            const variantName = nameIn(variant.name, language);
            return (
              <li key={variant.id}>
                <Variant
                  type="button"
                  aria-label={t('planEditor.preview.show', { name: variantName })}
                  onClick={() => onShow(variant)}
                >
                  <span>{variantName}</span>
                  <Muted as="span">{equipmentNames(variant.equipment)}</Muted>
                </Variant>
              </li>
            );
          })}
        </VariantList>
      )}
    </Panel>
  );
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding: ${space.md};
  border: 2px solid ${colors.primary};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;

const Title = styled.h5`
  font-size: ${fontSizes.lead};
`;

const Subtitle = styled.h6`
  font-size: ${fontSizes.body};
`;

const Animation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${space.sm};
  aspect-ratio: 4 / 3;
  max-height: 16rem;
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  text-align: center;
  svg {
    font-size: 2.5rem;
  }
`;

const Facts = styled.dl`
  display: grid;
  gap: ${space.xs};
  dt {
    font-weight: ${fontWeights.medium};
  }
`;

const TextList = styled.ul`
  display: grid;
  gap: ${space.xs};
  padding-left: ${space.lg};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const VariantList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xs};
  list-style: none;
`;

const Variant = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-height: ${sizes.touchTarget};
  padding: ${space.sm} ${space.md};
  border: 1px solid ${colors.surfaceMuted};
  border-radius: ${radii.small};
  background-color: ${colors.background};
  text-align: left;
  &:hover {
    background-color: ${colors.highlight};
  }
`;
