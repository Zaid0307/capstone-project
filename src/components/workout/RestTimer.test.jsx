import { act, fireEvent, screen } from '@testing-library/react';
import RestTimer from './RestTimer';
import useRestTimer from '../../hooks/useRestTimer';
import { renderWithProviders } from '../../test-utils';

function Harness({ seconds = 90 }) {
  const timer = useRestTimer();
  return (
    <>
      <button type="button" onClick={() => timer.start(seconds)}>
        Set done
      </button>
      <RestTimer timer={timer} />
    </>
  );
}

describe('RestTimer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down, can be changed by 15 seconds and ends', () => {
    renderWithProviders(<Harness />);
    expect(screen.queryByRole('region', { name: 'Rest' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Set done' }));
    expect(screen.getByRole('region', { name: 'Rest' })).toHaveTextContent('1:30');

    act(() => vi.advanceTimersByTime(30_000));
    expect(screen.getByRole('region', { name: 'Rest' })).toHaveTextContent('1:00');

    fireEvent.click(screen.getByRole('button', { name: '15 seconds more rest' }));
    expect(screen.getByRole('region', { name: 'Rest' })).toHaveTextContent('1:15');

    act(() => vi.advanceTimersByTime(75_000));
    expect(screen.getByRole('region', { name: 'Rest' })).toHaveTextContent('Go!');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('region', { name: 'Rest' })).not.toBeInTheDocument();
  });

  it('keeps running after a reload because it stores the end time', () => {
    const { unmount } = renderWithProviders(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Set done' }));
    unmount();

    act(() => vi.advanceTimersByTime(60_000));
    renderWithProviders(<Harness />);
    expect(screen.getByRole('region', { name: 'Rest' })).toHaveTextContent('0:30');
  });

  it('does not start without a rest time', () => {
    renderWithProviders(<Harness seconds={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Set done' }));
    expect(screen.queryByRole('region', { name: 'Rest' })).not.toBeInTheDocument();
  });
});
