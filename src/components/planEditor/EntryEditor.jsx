import { useId, useState } from 'react';
import styled from 'styled-components';
import { BiMinus, BiPlus } from 'react-icons/bi';
import {
  MdArrowDownward,
  MdArrowUpward,
  MdContentCopy,
  MdOutlineDeleteForever,
  MdDriveFileMove,
  MdLink,
  MdLinkOff,
  MdSwapHoriz,
  MdTune,
} from 'react-icons/md';
import ActionMenu from './ActionMenu';
import ExercisePicker from './ExercisePicker';
import { Field, Input, Label, Select, Textarea } from './formStyles';
import Button from '../ui/Button';
import DecimalInput from '../ui/DecimalInput';
import IconButton from '../ui/IconButton';
import { useUndo } from '../ui/UndoProvider';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { usesWeight } from '../../data/exerciseLibrary';
import {
  addSet,
  duplicateEntry,
  hasUniformSets,
  insertEntry,
  linkWithNext,
  moveEntry,
  moveEntryToDay,
  removeEntry,
  removeSet,
  replaceEntryExercise,
  setDoseUnit,
  setSetCount,
  unlinkSuperset,
  updateAllSets,
  updateEntry,
  updateSet,
} from '../../utils/planEditing';
import {
  SET_TYPES,
  entryIsPerSide,
  entryName,
  muscleLabel,
  summarizeSets,
} from '../../utils/workoutPlan';

const toNumber = value => (value === '' ? null : Number(String(value).replace(',', '.')));
const asText = value => (value === null || value === undefined ? '' : String(value));
const MAX_SETS = 20;

// "12 to 8" becomes "8 to 12" when the field is left.
const swappedDose = dose => ({ ...dose, min: dose.max, max: dose.min });

// A changed target: "from" moves "to" along while both are the same, an empty
// "to" means one fixed number.
function changedDose(dose, field, value) {
  const number = toNumber(value);
  if (dose.unit === 'seconds') return { unit: 'seconds', value: number };
  const isSingle = dose.max === dose.min;
  return field === 'min'
    ? { ...dose, min: number, max: isSingle ? number : dose.max }
    : { ...dose, max: number ?? dose.min };
}

// One exercise of a day. The quick row edits all sets at once (number of sets,
// repetitions or seconds, weight); the details hold single sets, rest, note,
// measure and per side. Ordering, duplicating, replacing, moving to another day
// and removing live in the ⋮ menu. `edit` takes a function from plan to
// changed plan (see utils/planEditing).
export default function EntryEditor({
  entry,
  dayId,
  position,
  count,
  otherDays,
  isOpen,
  onToggle,
  hasProblem,
  edit,
  availableEquipment = null,
  superset = null,
  canLinkNext = false,
  nextName = '',
}) {
  const { t, language } = useTranslation();
  const id = useId();
  const showUndo = useUndo();
  const [isReplacing, setIsReplacing] = useState(false);
  const name = entryName(entry, language);
  const unit = entry.sets[0]?.dose.unit ?? 'repetitions';

  const isUniform = hasUniformSets(entry);
  // Stretching, mobility, Pilates, boxing and cardio have no weight.
  const hasWeight = usesWeight(entry.exerciseId);
  const first = entry.sets[0];
  const changeSet = (index, changes) => edit(plan => updateSet(plan, dayId, entry.id, index, changes));
  const changeDose = (index, set, field, value) => changeSet(index, { dose: changedDose(set.dose, field, value) });
  const changeAll = changes => edit(plan => updateAllSets(plan, dayId, entry.id, changes));

  function handleRemove() {
    edit(plan => removeEntry(plan, dayId, entry.id));
    showUndo(t('planEditor.entry.removed', { name }), () =>
      edit(plan => insertEntry(plan, dayId, entry, position))
    );
  }

  const menuItems = [
    {
      key: 'up',
      icon: MdArrowUpward,
      label: t('planEditor.menu.moveUp'),
      name: t('planEditor.entry.moveUp', { name }),
      disabled: position === 0,
      onSelect: () => edit(plan => moveEntry(plan, dayId, entry.id, -1)),
    },
    {
      key: 'down',
      icon: MdArrowDownward,
      label: t('planEditor.menu.moveDown'),
      name: t('planEditor.entry.moveDown', { name }),
      disabled: position === count - 1,
      onSelect: () => edit(plan => moveEntry(plan, dayId, entry.id, 1)),
    },
    canLinkNext && {
      key: 'link',
      icon: MdLink,
      label: t('planEditor.superset.link'),
      name: t('planEditor.superset.linkWith', { name, next: nextName }),
      onSelect: () => edit(plan => linkWithNext(plan, dayId, entry.id)),
    },
    superset && {
      key: 'unlink',
      icon: MdLinkOff,
      label: t('planEditor.superset.unlink'),
      name: t('planEditor.superset.unlinkName', { group: superset.group }),
      onSelect: () => edit(plan => unlinkSuperset(plan, dayId, entry.id)),
    },
    {
      key: 'duplicate',
      icon: MdContentCopy,
      label: t('planEditor.menu.duplicate'),
      name: t('planEditor.entry.duplicate', { name }),
      onSelect: () => edit(plan => duplicateEntry(plan, dayId, entry.id)),
    },
    {
      key: 'replace',
      icon: MdSwapHoriz,
      label: t('planEditor.entry.replace'),
      onSelect: () => setIsReplacing(true),
    },
    otherDays.length > 0 && {
      key: 'moveTo',
      icon: MdDriveFileMove,
      label: t('planEditor.entry.moveTo'),
      submenu: {
        items: otherDays.map(day => ({
          key: day.id,
          label: day.title,
          name: t('planEditor.menu.moveToDay', { name, day: day.title }),
          onSelect: () => edit(plan => moveEntryToDay(plan, dayId, entry.id, day.id)),
        })),
      },
    },
    {
      key: 'remove',
      icon: MdOutlineDeleteForever,
      label: t('planEditor.menu.remove'),
      name: t('planEditor.entry.remove', { name }),
      isDanger: true,
      dividerBefore: true,
      onSelect: handleRemove,
    },
  ].filter(Boolean);

  return (
    <Item $hasProblem={hasProblem} $superset={superset}>
      {isReplacing && (
        <ExercisePicker
          replaceFor={{ name, muscle: entry.muscle }}
          onReplace={exerciseId => edit(plan => replaceEntryExercise(plan, dayId, entry.id, exerciseId))}
          onClose={() => setIsReplacing(false)}
          availableEquipment={availableEquipment}
        />
      )}
      <Summary>
        <Position aria-hidden="true">{position + 1}</Position>
        <SummaryText>
          <Name>
            {superset && (
              <SupersetTag title={t('planEditor.superset.label', { group: superset.group })}>
                {superset.label}
              </SupersetTag>
            )}
            {superset && <VisuallyHidden>{t('planEditor.superset.label', { group: superset.group })}: </VisuallyHidden>}
            {name}
          </Name>
          <Muted>
            {muscleLabel(entry.muscle, t)}
            {entryIsPerSide(entry) && ` · ${t('planEditor.entry.perSideShort')}`}
            {superset && superset.position < superset.size - 1
              ? ` · ${t('planEditor.superset.straightOn')}`
              : entry.restSeconds !== null && ` · ${t('planEditor.entry.restShort', { seconds: entry.restSeconds })}`}
          </Muted>
        </SummaryText>
        <Actions>
          <IconButton
            title={t('planEditor.entry.edit', { name })}
            aria-label={t('planEditor.entry.edit', { name })}
            aria-expanded={isOpen}
            aria-controls={`${id}-details`}
            onClick={onToggle}
          >
            <MdTune />
          </IconButton>
          <ActionMenu label={t('planEditor.menu.entry', { name })} items={menuItems} />
        </Actions>
      </Summary>

      {isUniform ? (
        <Quick role="group" aria-label={t('planEditor.entry.quick', { name })}>
          <StepperField role="group" aria-labelledby={`${id}-count-label`}>
            <SmallLabel as="span" id={`${id}-count-label`}>
              {t('planEditor.entry.sets')}
            </SmallLabel>
            <Stepper>
              <StepButton
                type="button"
                aria-label={t('planEditor.entry.fewerSets')}
                title={t('planEditor.entry.fewerSets')}
                disabled={entry.sets.length <= 1}
                onClick={() => edit(plan => setSetCount(plan, dayId, entry.id, entry.sets.length - 1))}
              >
                <BiMinus aria-hidden="true" />
              </StepButton>
              <StepValue aria-live="polite">{entry.sets.length}</StepValue>
              <StepButton
                type="button"
                aria-label={t('planEditor.entry.moreSets')}
                title={t('planEditor.entry.moreSets')}
                disabled={entry.sets.length >= MAX_SETS}
                onClick={() => edit(plan => setSetCount(plan, dayId, entry.id, entry.sets.length + 1))}
              >
                <BiPlus aria-hidden="true" />
              </StepButton>
            </Stepper>
          </StepperField>
          {first.dose.unit === 'seconds' ? (
            <Field>
              <SmallLabel htmlFor={`${id}-seconds`}>{t('planEditor.set.seconds')}</SmallLabel>
              <Input
                id={`${id}-seconds`}
                type="number"
                min="1"
                inputMode="numeric"
                value={asText(first.dose.value)}
                onChange={event => changeAll({ dose: changedDose(first.dose, 'value', event.target.value) })}
              />
            </Field>
          ) : (
            <>
              <Field>
                <SmallLabel htmlFor={`${id}-min`}>{t('planEditor.set.repsMin')}</SmallLabel>
                <Input
                  id={`${id}-min`}
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={asText(first.dose.min)}
                  onChange={event => changeAll({ dose: changedDose(first.dose, 'min', event.target.value) })}
                />
              </Field>
              <Field>
                <SmallLabel htmlFor={`${id}-max`}>{t('planEditor.set.repsMax')}</SmallLabel>
                <Input
                  id={`${id}-max`}
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={first.dose.max === first.dose.min ? '' : asText(first.dose.max)}
                  aria-invalid={first.dose.max < first.dose.min || undefined}
                  onChange={event => changeAll({ dose: changedDose(first.dose, 'max', event.target.value) })}
                  onBlur={() => first.dose.max < first.dose.min && changeAll({ dose: swappedDose(first.dose) })}
                />
              </Field>
            </>
          )}
          {hasWeight && (
          <Field>
            <SmallLabel htmlFor={`${id}-weight`}>{t('planEditor.set.weight')}</SmallLabel>
            <DecimalInput
              as={Input}
              id={`${id}-weight`}
              value={first.weight}
              onValueChange={weight => changeAll({ weight })}
            />
          </Field>
          )}
        </Quick>
      ) : (
        <Muted>
          {summarizeSets(entry.sets, language)} · {t('planEditor.entry.mixedSets')}
        </Muted>
      )}
      {hasProblem && <ProblemText>{t('planEditor.problem.invalidSets')}</ProblemText>}

      {isOpen && (
        <Details id={`${id}-details`}>
          <Row>
            <Field>
              <Label htmlFor={`${id}-unit`}>{t('planEditor.entry.measure')}</Label>
              <Select
                id={`${id}-unit`}
                value={unit}
                onChange={event => edit(plan => setDoseUnit(plan, dayId, entry.id, event.target.value))}
              >
                <option value="repetitions">{t('planEditor.entry.repetitions')}</option>
                <option value="seconds">{t('planEditor.entry.time')}</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor={`${id}-rest`}>{t('planEditor.entry.rest')}</Label>
              <Input
                id={`${id}-rest`}
                type="number"
                min="0"
                inputMode="numeric"
                value={asText(entry.restSeconds)}
                onChange={event =>
                  edit(plan => updateEntry(plan, dayId, entry.id, { restSeconds: toNumber(event.target.value) }))
                }
              />
            </Field>
          </Row>

          <CheckRow>
            <input
              id={`${id}-perSide`}
              type="checkbox"
              checked={entryIsPerSide(entry)}
              onChange={event => edit(plan => updateEntry(plan, dayId, entry.id, { perSide: event.target.checked }))}
            />
            <Label htmlFor={`${id}-perSide`}>{t('planEditor.entry.perSide')}</Label>
          </CheckRow>

          <SetList>
            {entry.sets.map((set, index) => {
              const setId = `${id}-set${index}`;
              const label = t('planEditor.set.label', { number: index + 1 });
              return (
                <SetItem key={index} role="group" aria-label={label}>
                  <SetHeader>
                    <SetTitle>{label}</SetTitle>
                    <TypeSelect
                      aria-label={t('planEditor.set.type')}
                      value={set.type}
                      onChange={event => changeSet(index, { type: event.target.value })}
                    >
                      {SET_TYPES.map(type => (
                        <option key={type} value={type}>
                          {t(`planEditor.set.types.${type}`)}
                        </option>
                      ))}
                    </TypeSelect>
                    <IconButton
                      aria-label={t('planEditor.set.remove', { number: index + 1 })}
                      disabled={entry.sets.length === 1}
                      onClick={() => edit(plan => removeSet(plan, dayId, entry.id, index))}
                    >
                      <MdOutlineDeleteForever />
                    </IconButton>
                  </SetHeader>
                  <SetFields>
                    {set.dose.unit === 'seconds' ? (
                      <Field>
                        <Label htmlFor={`${setId}-seconds`}>{t('planEditor.set.seconds')}</Label>
                        <Input
                          id={`${setId}-seconds`}
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={asText(set.dose.value)}
                          onChange={event => changeDose(index, set, 'value', event.target.value)}
                        />
                      </Field>
                    ) : (
                      <>
                        <Field>
                          <Label htmlFor={`${setId}-min`}>{t('planEditor.set.repsMin')}</Label>
                          <Input
                            id={`${setId}-min`}
                            type="number"
                            min="1"
                            inputMode="numeric"
                            value={asText(set.dose.min)}
                            onChange={event => changeDose(index, set, 'min', event.target.value)}
                          />
                        </Field>
                        <Field>
                          <Label htmlFor={`${setId}-max`}>{t('planEditor.set.repsMax')}</Label>
                          <Input
                            id={`${setId}-max`}
                            type="number"
                            min="1"
                            inputMode="numeric"
                            value={set.dose.max === set.dose.min ? '' : asText(set.dose.max)}
                            aria-invalid={set.dose.max < set.dose.min || undefined}
                            onChange={event => changeDose(index, set, 'max', event.target.value)}
                            onBlur={() => set.dose.max < set.dose.min && changeSet(index, { dose: swappedDose(set.dose) })}
                          />
                        </Field>
                      </>
                    )}
                    {hasWeight && (
                    <Field>
                      <Label htmlFor={`${setId}-weight`}>{t('planEditor.set.weight')}</Label>
                      <DecimalInput
                        as={Input}
                        id={`${setId}-weight`}
                        value={set.weight}
                        onValueChange={weight => changeSet(index, { weight })}
                      />
                    </Field>
                    )}
                    <Field>
                      <Label htmlFor={`${setId}-rir`}>{t('planEditor.set.rir')}</Label>
                      <Input
                        id={`${setId}-rir`}
                        type="number"
                        min="0"
                        inputMode="numeric"
                        value={asText(set.rirTarget)}
                        onChange={event => changeSet(index, { rirTarget: toNumber(event.target.value) })}
                      />
                    </Field>
                  </SetFields>
                </SetItem>
              );
            })}
          </SetList>
          <div>
            <Button $variant="secondary" onClick={() => edit(plan => addSet(plan, dayId, entry.id))}>
              {t('planEditor.set.add')}
            </Button>
          </div>

          <Field>
            <Label htmlFor={`${id}-note`}>{t('planEditor.entry.note')}</Label>
            <Textarea
              id={`${id}-note`}
              maxLength={300}
              value={entry.note ?? ''}
              onChange={event => edit(plan => updateEntry(plan, dayId, entry.id, { note: event.target.value }))}
            />
          </Field>
        </Details>
      )}
    </Item>
  );
}

// Exercises of a superset share a bracket on the left; the gap between them shrinks.
const Item = styled.li`
  padding: ${space.sm} ${space.md};
  border: 1px solid ${props => (props.$hasProblem ? colors.error : colors.surfaceMuted)};
  border-left: ${props => (props.$superset ? `4px solid ${colors.primary}` : undefined)};
  border-radius: ${props => {
    if (!props.$superset) return radii.small;
    const { position, size } = props.$superset;
    const top = position === 0 ? radii.small : '0';
    const bottom = position === size - 1 ? radii.small : '0';
    return `${top} ${top} ${bottom} ${bottom}`;
  }};
  background-color: ${colors.surface};
  margin-top: ${props => (props.$superset && props.$superset.position > 0 ? `calc(-1 * ${space.sm} + 2px)` : '0')};
`;

const SupersetTag = styled.span`
  display: inline-block;
  margin-right: ${space.xs};
  padding: 0 ${space.xs};
  border-radius: ${radii.small};
  background-color: ${colors.primary};
  color: ${colors.onPrimary};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Summary = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.sm};
`;

const Position = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${radii.pill};
  background-color: ${colors.surfaceMuted};
  font-weight: ${fontWeights.medium};
  font-variant-numeric: tabular-nums;
`;

const SummaryText = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

const Name = styled.p`
  font-weight: ${fontWeights.medium};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const ProblemText = styled.p`
  color: ${colors.error};
  font-size: ${fontSizes.caption};
`;

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
  button:disabled {
    opacity: 0.4;
  }
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: ${colors.primary};
  }
`;

// Sets stepper first, then the targets; the fields share the rest of the row.
const Quick = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
  margin-top: ${space.sm};
  align-items: end;
  & > * {
    flex: 1 1 4rem;
    min-width: 0;
  }
  & > [role='group'] {
    flex: 0 0 auto;
  }
`;

const StepperField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const StepButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border: none;
  background: none;
  color: ${colors.primary};
  font-size: 1.25rem;
  &:disabled {
    color: ${colors.textMuted};
    opacity: 0.5;
  }
`;

const StepValue = styled.span`
  min-width: 1.75rem;
  font-weight: ${fontWeights.bold};
  text-align: center;
`;

const SmallLabel = styled(Label)`
  font-size: ${fontSizes.caption};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  margin-top: ${space.md};
  padding-top: ${space.md};
  border-top: 1px solid ${colors.surfaceMuted};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.md};
`;

const SetList = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.sm};
  list-style: none;
`;

const SetItem = styled.li`
  padding: ${space.sm};
  border-radius: ${radii.small};
  background-color: ${colors.background};
`;

const SetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  margin-bottom: ${space.xs};
`;

const TypeSelect = styled(Select)`
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  max-width: 12rem;
  margin-left: auto;
`;

const SetTitle = styled.p`
  font-weight: ${fontWeights.medium};
`;

const SetFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(4rem, 100%), 1fr));
  gap: ${space.sm};
  align-items: end;
`;
