import { useId, useState } from 'react';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import { MdArrowBack, MdArrowForward, MdContentCopy, MdOutlineDeleteForever } from 'react-icons/md';
import ActionMenu from './ActionMenu';
import EntryEditor from './EntryEditor';
import ExercisePicker from './ExercisePicker';
import SortableEntryList from './SortableEntryList';
import { ErrorText, Field, Input, Label } from './formStyles';
import { shortWeekday } from '../workoutPlans/planSummary';
import Button from '../ui/Button';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { useUndo } from '../ui/UndoProvider';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  addEntry,
  duplicateDay,
  insertDay,
  moveDay,
  moveEntryTo,
  removeDayFromPlan,
  toggleDayWeekday,
  updateDay,
} from '../../utils/planEditing';
import {
  MAX_SUPERSET_SIZE,
  WEEKDAYS,
  dayTitle,
  dayWeekdays,
  defaultDayName,
  entryName,
  planEquipment,
  supersetLabels,
} from '../../utils/workoutPlan';

// Everything about one training day: name, weekday, note, day actions (⋮) and its
// exercises. "Sort" switches the exercises to a compact list to drag or move with up/down buttons.
export default function DayEditor({ plan, day, problems, edit, onSelectDay }) {
  const { t, language } = useTranslation();
  const id = useId();
  const showUndo = useUndo();
  const [openEntryId, setOpenEntryId] = useState(null);
  const [isPicking, setIsPicking] = useState(day.entries.length === 0);
  const [isSorting, setIsSorting] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const isRotation = plan.schedule.type === 'rotation';
  const title = dayTitle(day, plan.schedule, t);
  const index = plan.days.findIndex(item => item.id === day.id);
  const otherDays = plan.days
    .filter(item => item.id !== day.id)
    .map(item => ({ id: item.id, title: dayTitle(item, plan.schedule, t) }));
  const has = type => problems.some(problem => problem.type === type && problem.dayId === day.id);
  const usedWeekdays = plan.days.filter(item => item.id !== day.id).flatMap(dayWeekdays);
  const weekdays = dayWeekdays(day);
  const supersets = supersetLabels(day.entries);

  function handleDuplicate() {
    const result = duplicateDay(plan, day.id, t('planEditor.day.copyName', { name: day.name || title }));
    edit(() => result.plan);
    onSelectDay(result.day.id);
  }

  // Dragging and the arrow buttons both end here.
  function handleSortMove(entry, position) {
    edit(current => moveEntryTo(current, day.id, entry.id, position));
    setAnnouncement(
      t('planEditor.sort.moved', {
        name: entryName(entry, language),
        position: position + 1,
        count: day.entries.length,
      })
    );
  }

  const dayMenuItems = [
    isRotation && {
      key: 'earlier',
      icon: MdArrowBack,
      label: t('planEditor.menu.dayEarlier'),
      name: t('planEditor.day.moveEarlier'),
      disabled: index === 0,
      onSelect: () => edit(current => moveDay(current, day.id, -1)),
    },
    isRotation && {
      key: 'later',
      icon: MdArrowForward,
      label: t('planEditor.menu.dayLater'),
      name: t('planEditor.day.moveLater'),
      disabled: index === plan.days.length - 1,
      onSelect: () => edit(current => moveDay(current, day.id, 1)),
    },
    {
      key: 'duplicate',
      icon: MdContentCopy,
      label: t('planEditor.menu.duplicate'),
      name: t('planEditor.day.duplicate'),
      onSelect: handleDuplicate,
    },
    {
      key: 'remove',
      icon: MdOutlineDeleteForever,
      label: t('planEditor.menu.delete'),
      name: t('planEditor.day.remove', { name: title }),
      isDanger: true,
      dividerBefore: true,
      onSelect: handleRemove,
    },
  ].filter(Boolean);

  function handleRemove() {
    const next = plan.days[index + 1] ?? plan.days[index - 1];
    edit(current => removeDayFromPlan(current, day.id));
    onSelectDay(next?.id ?? null);
    showUndo(t('planEditor.day.removed', { name: title }), () => {
      edit(current => insertDay(current, day, index));
      onSelectDay(day.id);
    });
  }

  return (
    <Section aria-labelledby={`${id}-title`}>
      <TitleRow>
        <Title id={`${id}-title`}>{title}</Title>
        <ActionMenu label={t('planEditor.menu.day', { name: title })} items={dayMenuItems} />
      </TitleRow>

      <Fields>
        <Field>
          <Label htmlFor={`${id}-name`}>
            {t(isRotation ? 'planEditor.day.name' : 'planEditor.day.nameOptional')}
          </Label>
          <Input
            id={`${id}-name`}
            type="text"
            maxLength={60}
            placeholder={t('planEditor.day.namePlaceholder')}
            aria-invalid={has('noDayName') || undefined}
            aria-describedby={has('noDayName') ? `${id}-nameError` : undefined}
            value={day.name}
            onChange={event => edit(current => updateDay(current, day.id, { name: event.target.value }))}
            // A rotation day needs a name: an emptied field gets "Day X" back.
            onBlur={event => {
              if (isRotation && event.target.value.trim() === '') {
                edit(current => updateDay(current, day.id, { name: defaultDayName(index, t) }));
              }
            }}
          />
          {has('noDayName') && (
            <ErrorText id={`${id}-nameError`}>{t('planEditor.problem.noDayName')}</ErrorText>
          )}
        </Field>
      </Fields>

      {!isRotation && (
        <Field>
          <Label as="p" id={`${id}-weekdays`}>{t('planEditor.day.weekdays')}</Label>
          <WeekdayChips
            role="group"
            aria-labelledby={`${id}-weekdays`}
            aria-describedby={has('noWeekday') ? `${id}-weekdayError` : `${id}-weekdaysHint`}
            $isInvalid={has('noWeekday')}
          >
            {WEEKDAYS.map(weekday => (
              <WeekdayChip
                key={weekday}
                type="button"
                aria-pressed={weekdays.includes(weekday)}
                aria-label={
                  usedWeekdays.includes(weekday)
                    ? t('planEditor.day.weekdayUsedBy', { day: t(`day.${weekday}`) })
                    : t(`day.${weekday}`)
                }
                $isUsed={usedWeekdays.includes(weekday)}
                onClick={() => edit(current => toggleDayWeekday(current, day.id, weekday))}
              >
                {shortWeekday(weekday, language)}
              </WeekdayChip>
            ))}
          </WeekdayChips>
          {has('noWeekday') ? (
            <ErrorText id={`${id}-weekdayError`}>{t('planEditor.problem.noWeekday')}</ErrorText>
          ) : (
            <Hint id={`${id}-weekdaysHint`}>{t('planEditor.day.weekdaysHint')}</Hint>
          )}
        </Field>
      )}

      <Field>
        <Label htmlFor={`${id}-note`}>{t('planEditor.day.note')}</Label>
        <Input
          id={`${id}-note`}
          type="text"
          maxLength={300}
          value={day.note ?? ''}
          onChange={event => edit(current => updateDay(current, day.id, { note: event.target.value }))}
        />
      </Field>

      <SubtitleRow>
        <Subtitle>{t('planEditor.day.exercises')}</Subtitle>
        {(isSorting || day.entries.length > 1) && (
          <Button $variant={isSorting ? 'primary' : 'secondary'} onClick={() => setIsSorting(!isSorting)}>
            {t(isSorting ? 'planEditor.sort.done' : 'planEditor.sort.start')}
          </Button>
        )}
      </SubtitleRow>
      {has('emptyDay') && <ErrorText>{t('planEditor.problem.emptyDay')}</ErrorText>}
      <ScreenReaderOnly aria-live="polite">{announcement}</ScreenReaderOnly>
      {isSorting ? (
        <>
          <Hint>{t('planEditor.sort.hint')}</Hint>
          <SortableEntryList
            entries={day.entries}
            label={t('planEditor.sort.list', { name: title })}
            onMove={handleSortMove}
          />
        </>
      ) : day.entries.length > 0 && (
        <EntryList aria-label={t('planEditor.day.exercisesOf', { name: title })}>
          {day.entries.map((entry, position) => (
            <EntryEditor
              superset={supersets[position]}
              canLinkNext={
                position < day.entries.length - 1 &&
                (supersets[position]?.size ?? 1) + (supersets[position + 1]?.size ?? 1) <= MAX_SUPERSET_SIZE
              }
              nextName={day.entries[position + 1] ? entryName(day.entries[position + 1], language) : ''}
              key={entry.id}
              entry={entry}
              dayId={day.id}
              position={position}
              count={day.entries.length}
              otherDays={otherDays}
              isOpen={openEntryId === entry.id}
              onToggle={() => setOpenEntryId(openEntryId === entry.id ? null : entry.id)}
              hasProblem={problems.some(problem => problem.entryId === entry.id)}
              edit={edit}
              availableEquipment={planEquipment(plan)}
            />
          ))}
        </EntryList>
      )}

      {isSorting ? null : isPicking ? (
        <ExercisePicker
          targetName={title}
          availableEquipment={planEquipment(plan)}
          onAdd={entries => edit(current => entries.reduce((plan, entry) => addEntry(plan, day.id, entry), current))}
          onClose={() => setIsPicking(false)}
        />
      ) : (
        <div>
          <Button onClick={() => setIsPicking(true)}>
            <BiPlusCircle aria-hidden="true" />
            {t('planEditor.day.addExercise')}
          </Button>
        </div>
      )}
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space.xs};
`;

const Title = styled.h3`
  min-width: 0;
  font-size: ${fontSizes.section};
  overflow-wrap: anywhere;
`;

const SubtitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;

const Hint = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const WeekdayChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.xs};
  padding: ${props => (props.$isInvalid ? space.xs : 0)};
  border: ${props => (props.$isInvalid ? `2px solid ${colors.error}` : 'none')};
  border-radius: ${radii.small};
`;

// A weekday another day already uses stays choosable but is marked with a dashed border.
const WeekdayChip = styled.button`
  min-width: ${sizes.touchTarget};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.sm};
  border: 1px ${props => (props.$isUsed ? 'dashed' : 'solid')} ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  color: ${colors.text};
  &[aria-pressed='true'] {
    border-style: solid;
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const Subtitle = styled.h4`
  font-size: ${fontSizes.lead};
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(7.5rem, 11rem);
  align-items: end;
  gap: ${space.sm};
  &:has(> :only-child) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const EntryList = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.sm};
  list-style: none;
  color: ${colors.text};
`;
