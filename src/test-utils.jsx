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

// Minimal responses in the shape of the wger REST API.
export const wgerResponses = {
  exercise: [
    { id: 1, muscles: [4], muscles_secondary: [5] },
    { id: 2, muscles: [10], muscles_secondary: [] },
    { id: 3, muscles: [], muscles_secondary: [] },
  ],
  'exercise-translation?language=2': [
    {
      exercise: 1,
      language: 2,
      name: 'Bench Press',
      description: '<p>Lie on the bench.</p>',
    },
    {
      exercise: 2,
      language: 2,
      name: 'Squat',
      description: '<p>Go down slowly.</p>',
    },
  ],
  'exercise-translation?language=1': [
    {
      exercise: 1,
      language: 1,
      name: 'Bankdrücken',
      description: '<p>Leg dich auf die Bank.</p>',
    },
  ],
  exerciseimage: [
    { exercise: 1, image: 'https://wger.de/bench.png', is_main: true },
  ],
  video: [],
};

export function mockWgerFetch({ fail = false } = {}) {
  global.fetch = vi.fn(url => {
    if (fail) {
      return Promise.resolve({ ok: false, status: 500 });
    }
    const { pathname, searchParams } = new URL(url);
    const endpoint = pathname.split('/').filter(Boolean).pop();
    const language = searchParams.get('language');
    const key = language ? `${endpoint}?language=${language}` : endpoint;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: wgerResponses[key] ?? [] }),
    });
  });
  return global.fetch;
}
