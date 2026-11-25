import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinishDialog from './FinishDialog';
import { renderWithProviders } from '../../test-utils';

describe('FinishDialog', () => {
  it('names the open sets, starts on "Keep training" and offers to finish anyway', async () => {
    const onFinish = vi.fn();
    const onContinue = vi.fn();
    renderWithProviders(<FinishDialog openSets={3} onFinish={onFinish} onContinue={onContinue} />);

    const dialog = screen.getByRole('alertdialog', { name: 'Finish the training?' });
    expect(dialog).toHaveAccessibleDescription(/3 planned sets are still open/);
    expect(screen.getByRole('button', { name: 'Keep training' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    expect(onContinue).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Finish anyway' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab inside the dialog', async () => {
    renderWithProviders(<FinishDialog openSets={1} onFinish={() => {}} onContinue={() => {}} />);
    expect(screen.getByText('1 planned set is still open. It will be saved as not done.')).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Finish anyway' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Keep training' })).toHaveFocus();
  });
});
