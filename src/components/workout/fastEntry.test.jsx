import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAST_ENTRY_SCOPE, fastEntryProps } from './fastEntry';

function Fields() {
  return (
    <div {...{ [FAST_ENTRY_SCOPE]: '' }}>
      <input aria-label="Set 1: kg" defaultValue="60" {...fastEntryProps(false)} />
      <input aria-label="Set 1: Reps" {...fastEntryProps(false)} />
      <select aria-label="Set 1: RIR" />
      <input aria-label="Set 2: kg" defaultValue="62.5" {...fastEntryProps(false)} />
      <input aria-label="Set 2: Reps" {...fastEntryProps(true)} />
    </div>
  );
}

describe('fast entry', () => {
  it('moves on with Enter: kg, reps, next set, and closes after the last field', async () => {
    render(<Fields />);
    await userEvent.click(screen.getByLabelText('Set 1: kg'));
    await userEvent.keyboard('{Enter}');
    expect(screen.getByLabelText('Set 1: Reps')).toHaveFocus();
    await userEvent.keyboard('8{Enter}');
    expect(screen.getByLabelText('Set 2: kg')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByLabelText('Set 2: Reps')).toHaveFocus();
    expect(screen.getByLabelText('Set 2: Reps')).toHaveAttribute('enterkeyhint', 'done');
    expect(screen.getByLabelText('Set 1: kg')).toHaveAttribute('enterkeyhint', 'next');
    await userEvent.keyboard('{Enter}');
    expect(document.body).toHaveFocus();
  });

  it('marks the content on focus, so typing replaces it', async () => {
    render(<Fields />);
    await userEvent.click(screen.getByLabelText('Set 1: kg'));
    await userEvent.keyboard('65');
    expect(screen.getByLabelText('Set 1: kg')).toHaveValue('65');
  });
});
