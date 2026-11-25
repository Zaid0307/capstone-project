import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdArrowDownward, MdArrowUpward, MdDragIndicator } from 'react-icons/md';
import IconButton from '../ui/IconButton';
import { colors, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { entryName } from '../../utils/workoutPlan';

// Where an entry dropped on another one ends up: at the position of that entry.
// null when nothing moves (dropped outside the list or on itself).
export function dropPosition(entries, activeId, overId) {
  if (!overId || activeId === overId) return null;
  const position = entries.findIndex(entry => entry.id === overId);
  return position < 0 ? null : position;
}

// dnd-kit's own live region stays quiet: the day editor announces the new position
// in the same words for dragging and for the arrow buttons.
const SILENT = {
  announcements: {
    onDragStart: () => undefined,
    onDragOver: () => undefined,
    onDragEnd: () => undefined,
    onDragCancel: () => undefined,
  },
  screenReaderInstructions: { draggable: '' },
};

// The exercises of a day in sort mode. Each row can be dragged by its grip
// (mouse, pen or finger) or moved with the ↑/↓ buttons, which are the keyboard
// and screen reader way; the grip itself is hidden from assistive technology.
// onMove(entry, toPosition) is called for both.
export default function SortableEntryList({ entries, label, onMove }) {
  const { t, language } = useTranslation();
  const buttons = useRef(new Map());
  const pendingFocus = useRef(null);
  // A small movement starts a drag, so a tap on the grip does nothing.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // After a move with the arrows the pressed button keeps the focus; at the edge
  // it is disabled, then the other arrow of the same exercise takes it.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const { entryId, offset } = pendingFocus.current;
    pendingFocus.current = null;
    const pressed = buttons.current.get(`${entryId}:${offset}`);
    const other = buttons.current.get(`${entryId}:${-offset}`);
    (pressed && !pressed.disabled ? pressed : other)?.focus();
  });

  const buttonRef = (entryId, offset) => element => {
    const key = `${entryId}:${offset}`;
    if (element) buttons.current.set(key, element);
    else buttons.current.delete(key);
  };

  function handleArrow(entry, position, offset) {
    pendingFocus.current = { entryId: entry.id, offset };
    onMove(entry, position + offset);
  }

  function handleDragEnd({ active, over }) {
    const position = dropPosition(entries, active.id, over?.id);
    const entry = entries.find(item => item.id === active.id);
    if (position !== null && entry) onMove(entry, position);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} accessibility={SILENT}>
      <SortableContext items={entries.map(entry => entry.id)} strategy={verticalListSortingStrategy}>
        <List aria-label={label}>
          {entries.map((entry, position) => {
            const name = entryName(entry, language);
            return (
              <SortableRow key={entry.id} id={entry.id} dragLabel={t('planEditor.sort.drag', { name })}>
                <Position aria-hidden="true">{position + 1}</Position>
                <Name>{name}</Name>
                <IconButton
                  ref={buttonRef(entry.id, -1)}
                  aria-label={t('planEditor.entry.moveUp', { name })}
                  title={t('planEditor.entry.moveUp', { name })}
                  disabled={position === 0}
                  onClick={() => handleArrow(entry, position, -1)}
                >
                  <MdArrowUpward />
                </IconButton>
                <IconButton
                  ref={buttonRef(entry.id, 1)}
                  aria-label={t('planEditor.entry.moveDown', { name })}
                  title={t('planEditor.entry.moveDown', { name })}
                  disabled={position === entries.length - 1}
                  onClick={() => handleArrow(entry, position, 1)}
                >
                  <MdArrowDownward />
                </IconButton>
              </SortableRow>
            );
          })}
        </List>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, dragLabel, children }) {
  const { setNodeRef, setActivatorNodeRef, listeners, transform, transition, isDragging } = useSortable({ id });
  return (
    <Row
      ref={setNodeRef}
      $isDragging={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      {/* Pointer only; keyboard and screen reader users take the arrow buttons. */}
      <Grip ref={setActivatorNodeRef} aria-hidden="true" title={dragLabel} data-testid="drag-handle" {...listeners}>
        <MdDragIndicator />
      </Grip>
      {children}
    </Row>
  );
}

const List = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xs};
  list-style: none;
`;

const Row = styled.li`
  position: relative;
  z-index: ${props => (props.$isDragging ? 1 : 'auto')};
  display: flex;
  align-items: center;
  gap: ${space.xs};
  padding: ${space.xs};
  border: 1px solid ${props => (props.$isDragging ? colors.primary : colors.surfaceMuted)};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  box-shadow: ${props => (props.$isDragging ? shadows.card : 'none')};
  button:disabled {
    opacity: 0.4;
  }
`;

const Grip = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: ${sizes.touchTarget};
  height: ${sizes.touchTarget};
  border-radius: ${radii.small};
  color: ${colors.textMuted};
  font-size: 1.5rem;
  cursor: grab;
  /* The finger drags the row instead of scrolling the page. */
  touch-action: none;
  &:active {
    cursor: grabbing;
  }
`;

const Position = styled.span`
  flex-shrink: 0;
  min-width: 1.5rem;
  font-weight: ${fontWeights.medium};
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

const Name = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
`;
