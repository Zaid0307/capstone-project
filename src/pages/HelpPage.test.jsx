import { screen } from '@testing-library/react';
import HelpPage from './HelpPage';
import { renderWithProviders } from '../test-utils';

describe('HelpPage', () => {
  it('explains the first steps for testers in German', () => {
    renderWithProviders(<HelpPage />, { language: 'de' });
    expect(screen.getByRole('heading', { level: 1, name: 'Hilfe für Tester' })).toBeInTheDocument();
    for (const title of [
      'App öffnen',
      'Konto anlegen und bestätigen',
      'App auf dem Handy installieren',
      'Ohne Konto',
      'Daten exportieren oder löschen',
      'Datenschutz',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    }
    expect(screen.getByText(/Zum Home-Bildschirm/)).toBeInTheDocument();
    expect(screen.getByText(/App installieren/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Datenschutzerklärung lesen' })).toHaveAttribute('href', '/privacy');
  });

  it('is available in English', () => {
    renderWithProviders(<HelpPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Help for testers' })).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/)).toBeInTheDocument();
  });
});
