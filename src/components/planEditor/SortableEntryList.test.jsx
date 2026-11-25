import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortableEntryList, { dropPosition } from './SortableEntryList';
import { renderWithProviders } from '../../test-utils';
import { createEntry } from '../../utils/workoutPlan';

const entries = [
  createEntry({ exerciseId: 'barbell_squat' }),
  createEntry({ exerciseId: 'barbell_bench_press' }),
  createEntry({ exerciseId: 'barbell_row' }),
];

const ROW_HEIGHT = 50;

// jsdom has no layout: every row gets a 50 px high box, in list order.
function mockRowBoxes() {
  return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function box() {
    const row = this.closest('li');
    const index = row ? [...row.parentElement.children].indexOf(row) : 0;
    const top = index * ROW_HEIGHT;
    return { x: 0, y: top, top, left: 0, right: 300, bottom: top + ROW_HEIGHT, width: 300, height: ROW_HEIGHT, toJSON() {} };
  });
}

describe('dropPosition', () => {
  it('takes the position of the entry it is dropped on', () => {
    expect(dropPosition(entries, entries[0].id, entries[2].id)).toBe(2);
    expect(dropPosition(entries, entries[2].id, entries[0].id)).toBe(0);
  });

  it('moves nothing when dropped on itself or outside the list', () => {
    expect(dropPosition(entries, entries[1].id, entries[1].id)).toBeNull();
    expect(dropPosition(entries, entries[1].id, null)).toBeNull();
    expect(dropPosition(entries, entries[1].id, 'unknown')).toBeNull();
  });
});

describe('SortableEntryList', () => {
  it('keeps the arrow buttons as the keyboard way', async () => {
    const onMove = vi.fn();
    renderWithProviders(<SortableEntryList entries={entries} label="Order of Day A" onMove={onMove} />);

    expect(screen.getByRole('button', { name: 'Move Barbell back squat up' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Move Barbell back squat down' }));
    expect(onMove).toHaveBeenCalledWith(entries[0], 1);
  });

  it('hides the drag grips from assistive technology', () => {
    renderWithProviders(<SortableEntryList entries={entries} label="Order of Day A" onMove={vi.fn()} />);
    const grips = screen.getAllByTestId('drag-handle');
    expect(grips).toHaveLength(3);
    for (const grip of grips) {
      expect(grip).toHaveAttribute('aria-hidden', 'true');
      expect(grip).not.toHaveAttribute('tabindex');
    }
  });

  it('moves an exercise dragged by its grip', async () => {
    const boxes = mockRowBoxes();
    const onMove = vi.fn();
    renderWithProviders(<SortableEntryList entries={entries} label="Order of Day A" onMove={onMove} />);
    const [grip] = screen.getAllByTestId('drag-handle');

    await act(async () => {
      fireEvent.pointerDown(grip, { isPrimary: true, button: 0, clientX: 10, clientY: 25 });
    });
    await act(async () => {
      fireEvent.pointerMove(document, { isPrimary: true, clientX: 10, clientY: 60 });
    });
    await act(async () => {
      fireEvent.pointerMove(document, { isPrimary: true, clientX: 10, clientY: 125 });
    });
    await act(async () => {
      fireEvent.pointerUp(document, { isPrimary: true, clientX: 10, clientY: 125 });
    });

    expect(onMove).toHaveBeenCalledWith(entries[0], 2);
    boxes.mockRestore();
  });
});
