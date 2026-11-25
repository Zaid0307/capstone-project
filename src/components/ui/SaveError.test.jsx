import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaveError from './SaveError';
import { renderWithProviders } from '../../test-utils';
import { describeFailure } from '../../lib/networkError';

describe('SaveError', () => {
  it('explains a lost connection and tries again', async () => {
    const onRetry = vi.fn(() => Promise.resolve(true));
    renderWithProviders(<SaveError error={new TypeError('Failed to fetch')} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('The server could not be reached.');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps the storage message for other errors, in German too', () => {
    renderWithProviders(<SaveError error={new Error('QuotaExceededError')} onRetry={() => {}} />, { language: 'de' });
    expect(screen.getByRole('alert')).toHaveTextContent('Nicht gespeichert.');
    expect(screen.getByRole('button', { name: 'Erneut versuchen' })).toBeInTheDocument();
  });
});

describe('describeFailure', () => {
  it('tells offline, network and other failures apart', () => {
    expect(describeFailure(null)).toBeNull();
    expect(describeFailure(new Error('x'), false)).toBe('offline');
    expect(describeFailure(new TypeError('NetworkError when attempting to fetch resource.'), true)).toBe('network');
    expect(describeFailure(new Error('quota'), true)).toBe('other');
  });
});
