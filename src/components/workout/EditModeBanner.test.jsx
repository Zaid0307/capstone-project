import { screen } from '@testing-library/react';
import EditModeBanner from './EditModeBanner';
import { renderWithProviders } from '../../test-utils';

describe('EditModeBanner', () => {
  it('marks a finished training as being edited and keeps its times', () => {
    renderWithProviders(
      <EditModeBanner
        workout={{
          date: '2026-11-13',
          startedAt: '2026-11-13T17:05:00.000Z',
          finishedAt: '2026-11-13T18:10:00.000Z',
          updatedAt: '2026-11-14T08:00:00.000Z',
        }}
      />
    );
    expect(screen.getByRole('region', { name: 'Editing' })).toBeInTheDocument();
    expect(screen.getByText(/^Training of /)).toBeInTheDocument();
    expect(screen.getByText(/Start and end time stay as they were/)).toBeInTheDocument();
    expect(screen.getByText(/^Last changed /)).toBeInTheDocument();
  });
});
