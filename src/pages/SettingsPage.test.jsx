import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from './SettingsPage';
import { renderWithProviders } from '../test-utils';

describe('SettingsPage, your data', () => {
  beforeEach(() => localStorage.clear());

  it('deletes the training data only after a second confirmation', async () => {
    localStorage.setItem('workoutPlans', JSON.stringify([{ id: 'p1' }]));
    localStorage.setItem('workoutLog', JSON.stringify([{ id: 'w1' }]));
    const onDataCleared = vi.fn();
    renderWithProviders(<SettingsPage onDataCleared={onDataCleared} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete training data' }));
    await userEvent.click(screen.getByRole('button', { name: 'Keep my data' }));
    expect(localStorage.getItem('workoutLog')).not.toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Delete training data' }));
    expect(screen.getByRole('alertdialog', { name: 'Really delete all plans and diary entries?' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete for good' }));

    expect(localStorage.getItem('workoutPlans')).toBeNull();
    expect(localStorage.getItem('workoutLog')).toBeNull();
    expect(onDataCleared).toHaveBeenCalled();
  });

  it('offers the export as a file', async () => {
    const createObjectURL = vi.fn(() => 'blob:export');
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    renderWithProviders(<SettingsPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Export my data' }));
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });
});
