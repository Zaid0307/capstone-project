import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdCheck, MdClose, MdInfoOutline } from 'react-icons/md';
import ExercisePreview from './ExercisePreview';
import { Field, Input, Label, Select } from './formStyles';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { exerciseGroups } from '../../data/exerciseLibrary';
import { EQUIPMENT } from '../../data/equipment';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { ALL, TRAINING_TYPES, filterExercises, filterOptions } from '../../utils/exerciseSearch';
import { PLAN_MUSCLES, createEntry } from '../../utils/workoutPlan';

const groupOf = exercise => exerciseGroups(exercise)[0] ?? 'other';
const nameIn = (exercise, language) => exercise.name[language] ?? exercise.name.en;

// Full-screen choice of exercises from the library. Muscle group, equipment and
// kind only offer what fits the other filters. Tapping exercises selects them and
// one button adds them all; ⓘ opens a preview with variants. With `replaceFor`
// exactly one exercise is chosen to replace an entry. Own exercises can be added too.
export default function ExercisePicker({ onAdd, onClose, replaceFor = null, onReplace, targetName = null }) {
  const { t, language } = useTranslation();
  const id = useId();
  const titleRef = useRef(null);
  const isReplacing = Boolean(replaceFor);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState(() =>
    replaceFor && PLAN_MUSCLES.includes(replaceFor.muscle) ? replaceFor.muscle : ALL
  );
  const [equipment, setEquipment] = useState(ALL);
  const [types, setTypes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [ownName, setOwnName] = useState('');
  const [ownMuscle, setOwnMuscle] = useState('');
  const [lastAdded, setLastAdded] = useState('');

  const filters = { query, muscle, equipment, types };
  // The library is small (about 100 exercises), so filtering on every render is cheap.
  const results = filterExercises(filters, language);
  const { muscleCounts, equipmentCounts, typeCounts } = filterOptions(filters, PLAN_MUSCLES);
  // Counted once per exercise; summing the groups would count exercises with two groups twice.
  const allCount = filterExercises({ ...filters, muscle: ALL }, language).length;
  const typeChoices = TRAINING_TYPES.filter(type => typeCounts[type] > 0 || types.includes(type));
  const toggleType = type =>
    setTypes(types.includes(type) ? types.filter(other => other !== type) : [...types, type]);

  const equipmentName = item => EQUIPMENT[item]?.[language] ?? item;
  const equipmentChoices = Object.keys(equipmentCounts)
    .concat(equipment !== ALL && !equipmentCounts[equipment] ? [equipment] : [])
    .sort((a, b) => equipmentName(a).localeCompare(equipmentName(b), language));
  // Only groups with matching exercises, plus the chosen one so it can be undone.
  const muscleChoices = PLAN_MUSCLES.filter(name => muscleCounts[name] > 0 || name === muscle);

  // The latest close handler, so the effect below runs only once.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  // Move focus into the dialog when it opens; Escape closes it.
  useEffect(() => {
    titleRef.current?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') closeRef.current();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function toggle(exercise) {
    if (isReplacing) {
      setSelected([exercise.id]);
      return;
    }
    setSelected(
      selected.includes(exercise.id)
        ? selected.filter(other => other !== exercise.id)
        : [...selected, exercise.id]
    );
  }

  function handleConfirm() {
    if (isReplacing) {
      if (selected[0]) onReplace(selected[0]);
    } else {
      onAdd(selected.map(exerciseId => createEntry({ exerciseId })));
    }
    onClose();
  }

  function handleOwnSubmit(event) {
    event.preventDefault();
    const name = ownName.trim();
    if (!name || !ownMuscle) return;
    onAdd([createEntry({ exercise: name, muscle: ownMuscle })]);
    setLastAdded(t('planEditor.picker.added', { name }));
    setOwnName('');
  }

  const title = isReplacing
    ? t('planEditor.picker.replaceTitle', { name: replaceFor.name })
    : targetName
      ? t('planEditor.picker.titleFor', { name: targetName })
      : t('planEditor.picker.title');

  return (
    <Panel role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
      <Header>
        <Title id={`${id}-title`} ref={titleRef} tabIndex={-1}>
          {title}
        </Title>
        <IconButton aria-label={t('planEditor.picker.close')} title={t('planEditor.picker.close')} onClick={onClose}>
          <MdClose />
        </IconButton>
      </Header>

      <Field>
        <Label htmlFor={`${id}-search`}>{t('planEditor.picker.search')}</Label>
        <Input
          id={`${id}-search`}
          type="search"
          value={query}
          placeholder={t('planEditor.picker.searchPlaceholder')}
          onChange={event => setQuery(event.target.value)}
        />
      </Field>

      <Filters>
        <Field>
          <Label htmlFor={`${id}-muscle`}>{t('planEditor.picker.muscleFilter')}</Label>
          <Select id={`${id}-muscle`} value={muscle} onChange={event => setMuscle(event.target.value)}>
            <option value={ALL}>
              {t('planEditor.picker.all')} ({allCount})
            </option>
            {muscleChoices.map(name => (
              <option key={name} value={name}>
                {t(`muscle.${name}`)} ({muscleCounts[name]})
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor={`${id}-equipment`}>{t('planEditor.picker.equipment')}</Label>
          <Select
            id={`${id}-equipment`}
            value={equipment}
            onChange={event => setEquipment(event.target.value)}
          >
            <option value={ALL}>{t('planEditor.picker.anyEquipment')}</option>
            {equipmentChoices.map(item => (
              <option key={item} value={item}>
                {equipmentName(item)} ({equipmentCounts[item] ?? 0})
              </option>
            ))}
          </Select>
        </Field>
      </Filters>

      <div>
        <Label as="p" id={`${id}-types`}>
          {t('planEditor.picker.types')}
        </Label>
        <ChipGroup role="group" aria-labelledby={`${id}-types`}>
          {typeChoices.map(type => (
            <Chip key={type} type="button" aria-pressed={types.includes(type)} onClick={() => toggleType(type)}>
              {t(`planEditor.picker.typeNames.${type}`)} <Count>{typeCounts[type]}</Count>
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <Status role="status">{lastAdded}</Status>

      {preview && (
        <ExercisePreview
          key={preview.id}
          exercise={preview}
          isSelected={selected.includes(preview.id)}
          onToggle={toggle}
          onShow={setPreview}
          onClose={() => setPreview(null)}
        />
      )}

      {results.length === 0 ? (
        <Muted>{t('planEditor.picker.noResults')}</Muted>
      ) : (
        <>
          <Muted>{t('planEditor.picker.count', { count: results.length })}</Muted>
          <ResultList aria-label={t('planEditor.picker.results')}>
            {results.map(exercise => {
              const name = nameIn(exercise, language);
              const isSelected = selected.includes(exercise.id);
              return (
                <Result key={exercise.id} $isSelected={isSelected}>
                  <ResultName
                    type="button"
                    aria-label={t('planEditor.picker.select', { name })}
                    aria-pressed={isSelected}
                    onClick={() => toggle(exercise)}
                  >
                    <Check aria-hidden="true" $isSelected={isSelected}>
                      <MdCheck />
                    </Check>
                    <span>{name}</span>
                    <Muted as="span">{t(`muscle.${groupOf(exercise)}`)}</Muted>
                  </ResultName>
                  <IconButton
                    aria-label={t('planEditor.preview.show', { name })}
                    title={t('planEditor.preview.show', { name })}
                    aria-pressed={preview?.id === exercise.id}
                    onClick={() => setPreview(exercise)}
                  >
                    <MdInfoOutline />
                  </IconButton>
                </Result>
              );
            })}
          </ResultList>
        </>
      )}

      {!isReplacing && (
        <OwnForm onSubmit={handleOwnSubmit} aria-labelledby={`${id}-own`}>
          <Subtitle id={`${id}-own`}>{t('planEditor.picker.ownTitle')}</Subtitle>
          <Filters>
            <Field>
              <Label htmlFor={`${id}-own-name`}>{t('planEditor.picker.ownName')}</Label>
              <Input
                id={`${id}-own-name`}
                type="text"
                maxLength={60}
                required
                value={ownName}
                onChange={event => setOwnName(event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor={`${id}-own-muscle`}>{t('planEditor.picker.ownMuscle')}</Label>
              <Select
                id={`${id}-own-muscle`}
                required
                value={ownMuscle}
                onChange={event => setOwnMuscle(event.target.value)}
              >
                <option value="" disabled>
                  {t('planEditor.chooseOption')}
                </option>
                {PLAN_MUSCLES.map(name => (
                  <option key={name} value={name}>
                    {t(`muscle.${name}`)}
                  </option>
                ))}
              </Select>
            </Field>
          </Filters>
          <div>
            <Button type="submit" $variant="secondary">
              {t('planEditor.picker.ownAdd')}
            </Button>
          </div>
        </OwnForm>
      )}

      <Footer>
        <Button disabled={selected.length === 0} onClick={handleConfirm}>
          {isReplacing
            ? t('planEditor.picker.replace')
            : t('planEditor.picker.addSelected', { count: selected.length })}
        </Button>
      </Footer>
    </Panel>
  );
}

// Covers the whole screen and scrolls on its own; the button bar stays at the bottom.
const Panel = styled.section`
  position: fixed;
  inset: 0;
  z-index: 6;
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  max-width: ${sizes.contentMax};
  margin: 0 auto;
  padding: ${space.md} ${space.lg} 0;
  overflow-y: auto;
  background-color: ${colors.background};
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  margin: auto calc(-1 * ${space.lg}) 0;
  padding: ${space.md} ${space.lg} calc(${space.md} + env(safe-area-inset-bottom, 0px));
  background-color: ${colors.background};
  border-top: 1px solid ${colors.surfaceMuted};
  button {
    width: 100%;
  }
`;

const Check = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${props => (props.$isSelected ? colors.primary : colors.border)};
  border-radius: ${radii.small};
  background-color: ${props => (props.$isSelected ? colors.primary : 'transparent')};
  color: ${props => (props.$isSelected ? colors.onPrimary : 'transparent')};
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;

const Title = styled.h2`
  font-size: ${fontSizes.lead};
`;

const Subtitle = styled.h3`
  font-size: ${fontSizes.body};
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.sm};
`;

// One row that scrolls sideways on phones; the padding keeps focus rings visible.
const ChipGroup = styled.div`
  display: flex;
  gap: ${space.sm};
  margin: calc(-1 * ${space.sm});
  padding: ${space.sm};
  overflow-x: auto;
  & > * {
    flex-shrink: 0;
  }
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const Count = styled.span`
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
`;

const Status = styled.p`
  min-height: 1.5em;
  font-weight: ${fontWeights.medium};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const ResultList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xs};
  list-style: none;
`;

const Result = styled.li`
  display: flex;
  align-items: center;
  border: 1px solid ${props => (props.$isSelected ? colors.primary : colors.surfaceMuted)};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const ResultName = styled.button`
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: ${space.sm};
  min-width: 0;
  min-height: ${sizes.touchTarget};
  padding: ${space.sm} ${space.md};
  border: none;
  border-radius: ${radii.small};
  background: none;
  text-align: left;
  &:hover {
    background-color: ${colors.highlight};
  }
`;

const OwnForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding-top: ${space.md};
  border-top: 1px solid ${colors.surfaceMuted};
`;
