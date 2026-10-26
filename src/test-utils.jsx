import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';

export function renderWithProviders(
  ui,
  { route = '/', language = 'en' } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider initialLanguage={language}>{ui}</LanguageProvider>
    </MemoryRouter>
  );
}
