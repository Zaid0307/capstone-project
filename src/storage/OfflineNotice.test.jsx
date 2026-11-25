import { act, screen } from '@testing-library/react';
import OfflineNotice from './OfflineNotice';
import { renderWithProviders } from '../test-utils';

function fakeStore(count) {
  const listeners = new Set();
  return {
    count,
    pendingCount() {
      return this.count;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(next) {
      this.count = next;
      listeners.forEach(listener => listener(next));
    },
  };
}

describe('OfflineNotice', () => {
  it('shows a hint while changes wait to be sent', () => {
    const store = fakeStore(0);
    const stores = [store];
    renderWithProviders(<OfflineNotice stores={stores} />, { language: 'de' });
    expect(screen.queryByText(/Offline/)).toBeNull();

    act(() => store.set(2));
    expect(screen.getByRole('status')).toHaveTextContent('Offline – wird später gespeichert');

    act(() => store.set(0));
    expect(screen.queryByText(/Offline/)).toBeNull();
  });
});
