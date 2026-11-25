import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';
import { renderWithProviders } from '../test-utils';

function Broken() {
  throw new Error('Plan has no days');
}

describe('ErrorBoundary', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('shows a friendly page with the error text and a way to reload', async () => {
    const onReload = vi.fn();
    renderWithProviders(
      <ErrorBoundary onReload={onReload}>
        <Broken />
      </ErrorBoundary>,
      { language: 'de' }
    );

    expect(screen.getByRole('heading', { name: 'Da ist etwas schiefgelaufen' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Fehlertext/).value).toContain('Error: Plan has no days');
    await userEvent.click(screen.getByRole('button', { name: 'Neu laden' }));
    expect(onReload).toHaveBeenCalled();
  });

  it('shows the app when nothing goes wrong', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
