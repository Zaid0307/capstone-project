import { useState } from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkipDialog, { skipNote } from './SkipDialog';
import { renderWithProviders } from '../../test-utils';

function Harness({ onConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      {isOpen && (
        <SkipDialog
          subject="Push · Monday"
          onConfirm={note => {
            onConfirm(note);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

describe('SkipDialog', () => {
  it('builds the note from reason and free text', () => {
    expect(skipNote('Ill', ' cold ')).toBe('Ill: cold');
    expect(skipNote('', 'cold')).toBe('cold');
    expect(skipNote('Travel', '')).toBe('Travel');
    expect(skipNote('', '  ')).toBe('');
  });

  it('offers one reason at a time and returns the note', async () => {
    const onConfirm = vi.fn();
    renderWithProviders(<Harness onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = within(screen.getByRole('dialog', { name: 'Record training as missed' }));
    const chips = dialog.getAllByRole('button', { pressed: false });
    expect(chips.map(chip => chip.textContent)).toEqual(['Ill', 'Injured', 'No time', 'Travel', 'Recovery', 'Other']);
    expect(chips[0]).toHaveFocus();

    await userEvent.click(dialog.getByRole('button', { name: 'Travel' }));
    await userEvent.click(dialog.getByRole('button', { name: 'No time' }));
    expect(dialog.getAllByRole('button', { pressed: true }).map(chip => chip.textContent)).toEqual(['No time']);
    await userEvent.type(dialog.getByLabelText('Details (optional)'), 'work trip');
    await userEvent.click(dialog.getByRole('button', { name: 'Record as missed' }));

    expect(onConfirm).toHaveBeenCalledWith('No time: work trip');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus());
  });

  it('closes with Escape or Cancel without a note', async () => {
    const onConfirm = vi.fn();
    renderWithProviders(<Harness onConfirm={onConfirm} />);
    const opener = screen.getByRole('button', { name: 'Open' });

    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());

    await userEvent.click(opener);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('keeps the keyboard focus inside', async () => {
    renderWithProviders(<Harness onConfirm={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Ill' })).toHaveFocus();
  });

  it('speaks German', async () => {
    renderWithProviders(<SkipDialog onConfirm={vi.fn()} onCancel={vi.fn()} />, { language: 'de' });
    const dialog = within(screen.getByRole('dialog', { name: 'Training als ausgefallen eintragen' }));
    expect(dialog.getByRole('button', { name: 'Sonstiges' })).toBeInTheDocument();
    expect(dialog.getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
  });
});
