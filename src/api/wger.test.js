import {
  buildExercises,
  fetchExercises,
  groupByMuscle,
  stripHtml,
} from './wger';
import { mockWgerFetch } from '../test-utils';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<p>Lie   on</p><ul><li>the bench</li></ul>')).toBe(
      'Lie on the bench'
    );
  });

  it('handles a missing description', () => {
    expect(stripHtml(undefined)).toBe('');
  });
});

describe('buildExercises', () => {
  const exercises = [
    { id: 1, muscles: [4], muscles_secondary: [5] },
    { id: 2, muscles: [10], muscles_secondary: [] },
    { id: 3, muscles: [2], muscles_secondary: [] },
  ];

  it('prefers the requested language and falls back to English', () => {
    const result = buildExercises({
      exercises,
      translations: [{ exercise: 1, name: 'Bankdrücken', description: '' }],
      fallbackTranslations: [
        { exercise: 1, name: 'Bench Press', description: '' },
        { exercise: 2, name: 'Squat', description: '<b>Down</b>' },
      ],
    });

    expect(result.map(exercise => exercise.name)).toEqual([
      'Bankdrücken',
      'Squat',
    ]);
    expect(result[1].description).toBe('Down');
  });

  it('skips exercises without any translation', () => {
    const result = buildExercises({
      exercises,
      translations: [{ exercise: 3, name: 'Arnold Press', description: '' }],
    });
    expect(result.map(exercise => exercise.id)).toEqual([3]);
  });

  it('uses the main image and video of an exercise', () => {
    const [exercise] = buildExercises({
      exercises: [exercises[0]],
      translations: [{ exercise: 1, name: 'Bench Press', description: '' }],
      images: [
        { exercise: 1, image: 'side.png', is_main: false },
        { exercise: 1, image: 'main.png', is_main: true },
      ],
      videos: [{ exercise: 1, video: 'bench.mp4', is_main: false }],
    });

    expect(exercise.image).toBe('main.png');
    expect(exercise.video).toBe('bench.mp4');
    expect(exercise.musclesSecondary).toEqual([5]);
  });

  it('returns null for missing media', () => {
    const [exercise] = buildExercises({
      exercises: [exercises[0]],
      translations: [{ exercise: 1, name: 'Bench Press', description: '' }],
    });
    expect(exercise.image).toBeNull();
    expect(exercise.video).toBeNull();
  });
});

describe('groupByMuscle', () => {
  it('sorts exercises into every group of their primary muscles', () => {
    const groups = groupByMuscle([
      { id: 1, name: 'Push-up', muscles: [4, 5] },
      { id: 2, name: 'Bench Press', muscles: [4] },
      { id: 3, name: 'Squat', muscles: [10] },
    ]);

    expect(groups.chest.map(exercise => exercise.name)).toEqual([
      'Bench Press',
      'Push-up',
    ]);
    expect(groups.arms.map(exercise => exercise.name)).toEqual(['Push-up']);
    expect(groups.legs.map(exercise => exercise.name)).toEqual(['Squat']);
    expect(groups.back).toEqual([]);
  });
});

describe('fetchExercises', () => {
  afterEach(() => {
    delete global.fetch;
  });

  it('loads only English translations for English', async () => {
    const fetch = mockWgerFetch();
    const groups = await fetchExercises('en');

    const urls = fetch.mock.calls.map(([url]) => url);
    expect(urls.filter(url => url.includes('exercise-translation'))).toEqual([
      'https://wger.de/api/v2/exercise-translation/?language=2&limit=1000',
    ]);
    expect(groups.chest[0]).toMatchObject({
      name: 'Bench Press',
      description: 'Lie on the bench.',
      image: 'https://wger.de/bench.png',
    });
  });

  it('loads German with English fallback', async () => {
    mockWgerFetch();
    const groups = await fetchExercises('de');

    expect(groups.chest[0].name).toBe('Bankdrücken');
    expect(groups.legs[0].name).toBe('Squat');
  });

  it('rejects when the API answers with an error', async () => {
    mockWgerFetch({ fail: true });
    await expect(fetchExercises('en')).rejects.toThrow(/500/);
  });
});
