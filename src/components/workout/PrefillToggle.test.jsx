import { act, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrefillToggle from './PrefillToggle';
import { PREFILL_STORAGE_KEY, usePrefillChoice } from './prefillChoice';
import { renderWithProviders } from '../../test-utils';

describe('PrefillToggle', () => {
  it('is a radio group with last time and average, also by arrow keys', async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PrefillToggle
        name="Squat"
        mode="last"
        onChange={onChange}
        lastText={['60 kg × 10', '12.11.']}
        averageText={['Ø 58.5 kg × 9.6', 'last 5']}
      />
    );
    const group = screen.getByRole('radiogroup', { name: 'Fill in the open sets of Squat with' });
    expect(group).toBeInTheDocument();
    const last = screen.getByRole('radio', { name: /Last time/ });
    expect(last).toHaveAttribute('aria-checked', 'true');
    expect(last).toHaveTextContent('60 kg × 1012.11.');

    await userEvent.click(screen.getByRole('radio', { name: /Average/ }));
    expect(onChange).toHaveBeenLastCalledWith('average');
    last.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('average');
  });
});

describe('usePrefillChoice', () => {
  beforeEach(() => localStorage.clear());

  it('remembers the choice per exercise on this device', () => {
    const { result } = renderHook(() => usePrefillChoice());
    expect(result.current.modeOf('squat')).toBe('last');
    act(() => result.current.choose('squat', 'average'));
    expect(result.current.modeOf('squat')).toBe('average');
    // The last choice is the default for other exercises.
    expect(result.current.modeOf('bench')).toBe('average');
    expect(JSON.parse(localStorage.getItem(PREFILL_STORAGE_KEY))).toMatchObject({ squat: 'average' });

    const again = renderHook(() => usePrefillChoice());
    expect(again.result.current.modeOf('squat')).toBe('average');
  });
});
