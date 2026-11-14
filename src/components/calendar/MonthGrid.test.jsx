import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonthGrid from './MonthGrid';
import { renderWithProviders } from '../../test-utils';
import { calendarMonth } from '../../utils/analysis';

function renderGrid(focusDate, onSelect = vi.fn()) {
  const weeks = calendarMonth([], [], focusDate.slice(0, 7), '2026-03-15');
  renderWithProviders(
    <>
      <h2 id="title">March 2026</h2>
      <MonthGrid weeks={weeks} focusDate={focusDate} selectedDate={focusDate} onSelect={onSelect} labelOf={day => day.date} titleId="title" />
    </>
  );
  return onSelect;
}

describe('MonthGrid', () => {
  it('is a grid with weekday headers starting on Monday and one tab stop', () => {
    renderGrid('2026-03-31');
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map(cell => cell.textContent)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    const focusable = screen.getAllByRole('button').filter(button => button.tabIndex === 0);
    expect(focusable.map(button => button.getAttribute('aria-label'))).toEqual(['2026-03-31']);
    expect(screen.getByRole('button', { name: '2026-03-15' })).toHaveAttribute('aria-current', 'date');
  });

  it('chooses days with arrow, Home/End and Page keys', async () => {
    const onSelect = renderGrid('2026-03-31');
    screen.getByRole('button', { name: '2026-03-31' }).focus();
    await userEvent.keyboard('{PageUp}');
    expect(onSelect).toHaveBeenLastCalledWith('2026-02-28');
    await userEvent.keyboard('{ArrowUp}');
    expect(onSelect).toHaveBeenLastCalledWith('2026-03-24');
    await userEvent.keyboard('{Home}');
    expect(onSelect).toHaveBeenLastCalledWith('2026-03-30');
    await userEvent.keyboard('{End}');
    expect(onSelect).toHaveBeenLastCalledWith('2026-04-05');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('2026-03-31');
  });
});
