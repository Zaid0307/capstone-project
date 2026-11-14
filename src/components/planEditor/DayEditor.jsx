import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import {
  MdArrowBack,
  MdArrowDownward,
  MdArrowForward,
  MdArrowUpward,
  MdContentCopy,
  MdOutlineDeleteForever,
} from 'react-icons/md';
import ActionMenu from './ActionMenu';
import EntryEditor from './EntryEditor';
import ExercisePicker from './ExercisePicker';
import { ErrorText, Field, Input, Label, Select } from './formStyles';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { useUndo } from '../ui/UndoProvider';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  addEntry,
  duplicateDay,
  insertDay,
  moveDay,
  moveEntry,
  removeDayFromPlan,
  updateDay,
} from '../../utils/planEditing';
import { WEEKDAYS, dayTitle, defaultDayName, entryName } from '../../utils/workoutPlan';

// Everything about one training day: name, weekday, note, day actions (⋮) and its
// exercises. "Sort" switches the exercises to a compact list with up/down buttons.
export default function DayEditor({ plan, day, problems, edit, onSelectDay }) {
  const { t, language } = useTranslation();
  const id = useId();
  const showUndo = useUndo();
  const [openEntryId, setOpenEntryId] = useState(null);
  const [isPicking, setIsPicking] = useState(day.entries.length === 0);
  const [isSorting, setIsSorting] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const sortButtons = useRef(new Map());
  const pendingFocus = useRef(null);
  const isRotation = plan.schedule.type === 'rotation';
  const title = dayTitle(day, plan.schedule, t);
  const index = plan.days.findIndex(item => item.id === day.id);
  const otherDays = plan.days
    .filter(item => item.id !== day.id)
    .map(item => ({ id: item.id, title: dayTitle(item, plan.schedule, t) }));
  const has = type => problems.some(problem => problem.type === type && problem.dayId === day.id);
  const usedWeekdays = plan.days.filter(item => item.id !== day.id).map(item => item.weekday);

  function handleDuplicate() {
    const result = duplicateDay(plan, day.id, t('planEditor.day.copyName', { name: day.name || title }));
    edit(() => result.plan);
    onSelectDay(result.day.id);
  }

  // After a move the pressed button keeps the focus; at the edge it is disabled,
  // then the other arrow of the same exercise takes it.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const { entryId, offset } = pendingFocus.current;
    pendingFocus.current = null;
    const pressed = sortButtons.current.get(`${entryId}:${offset}`);
    const other = sortButtons.current.get(`${entryId}:${-offset}`);
    (pressed && !pressed.disabled ? pressed : other)?.focus();
  });

  function handleSortMove(entry, position, offset) {
    edit(current => moveEntry(current, day.id, entry.id, offset));
    pendingFocus.current = { entryId: entry.id, offset };
    setAnnouncement(
      t('planEditor.sort.moved', {
        name: entryName(entry, language),
        position: position + offset + 1,
        count: day.entries.length,
      })
    );
  }

  const sortButtonRef = (entryId, offset) => element => {
    const key = `${entryId}:${offset}`;
    if (element) sortButtons.current.set(key, element);
    else sortButtons.current.delete(key);
  };

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
        {!isRotation && (
          <Field>
            <Label htmlFor={`${id}-weekday`}>{t('planEditor.day.weekday')}</Label>
            <Select
              id={`${id}-weekday`}
              aria-invalid={has('noWeekday') || undefined}
              aria-describedby={has('noWeekday') ? `${id}-weekdayError` : undefined}
              value={day.weekday ?? ''}
              onChange={event =>
                edit(current => updateDay(current, day.id, { weekday: event.target.value || null }))
              }
            >
              <option value="">{t('planEditor.chooseOption')}</option>
              {WEEKDAYS.map(weekday => (
                <option key={weekday} value={weekday}>
                  {t(`day.${weekday}`)}
                  {usedWeekdays.includes(weekday) ? ` (${t('planEditor.day.weekdayUsed')})` : ''}
                </option>
              ))}
            </Select>
            {has('noWeekday') && (
              <ErrorText id={`${id}-weekdayError`}>{t('planEditor.problem.noWeekday')}</ErrorText>
            )}
          </Field>
        )}
      </Fields>

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
          <SortList aria-label={t('planEditor.sort.list', { name: title })}>
            {day.entries.map((entry, position) => {
              const name = entryName(entry, language);
              return (
                <SortItem key={entry.id}>
                  <SortPosition aria-hidden="true">{position + 1}</SortPosition>
                  <SortName>{name}</SortName>
                  <IconButton
                    ref={sortButtonRef(entry.id, -1)}
                    aria-label={t('planEditor.entry.moveUp', { name })}
                    title={t('planEditor.entry.moveUp', { name })}
                    disabled={position === 0}
                    onClick={() => handleSortMove(entry, position, -1)}
                  >
                    <MdArrowUpward />
                  </IconButton>
                  <IconButton
                    ref={sortButtonRef(entry.id, 1)}
                    aria-label={t('planEditor.entry.moveDown', { name })}
                    title={t('planEditor.entry.moveDown', { name })}
                    disabled={position === day.entries.length - 1}
                    onClick={() => handleSortMove(entry, position, 1)}
                  >
                    <MdArrowDownward />
                  </IconButton>
                </SortItem>
              );
            })}
          </SortList>
        </>
      ) : day.entries.length > 0 && (
        <EntryList aria-label={t('planEditor.day.exercisesOf', { name: title })}>
          {day.entries.map((entry, position) => (
            <EntryEditor
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
            />
          ))}
        </EntryList>
      )}

      {isSorting ? null : isPicking ? (
        <ExercisePicker
          targetName={title}
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

const SortList = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xs};
  list-style: none;
`;

const SortItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  padding: ${space.xs} ${space.xs} ${space.xs} ${space.sm};
  border: 1px solid ${colors.surfaceMuted};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  button:disabled {
    opacity: 0.4;
  }
`;

const SortPosition = styled.span`
  flex-shrink: 0;
  min-width: 1.5rem;
  font-weight: ${fontWeights.medium};
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

const SortName = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
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
