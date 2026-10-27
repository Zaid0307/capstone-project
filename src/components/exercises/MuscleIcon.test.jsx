import { fireEvent, render } from '@testing-library/react';
import MuscleIcon from './MuscleIcon';

describe('MuscleIcon', () => {
  it('shows the graphic of a muscle group', () => {
    const { container } = render(<MuscleIcon muscle="chest" size={80} />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('falls back to a neutral symbol when the graphic cannot be loaded', () => {
    const { container } = render(<MuscleIcon muscle="chest" size={80} />);
    fireEvent.error(container.querySelector('img'));
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('falls back to a neutral symbol for groups without a graphic', () => {
    const { container } = render(<MuscleIcon muscle="other" size={28} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
