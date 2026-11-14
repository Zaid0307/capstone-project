import { buildExport, clearTrainingData, exportFileName } from './dataExport';

describe('data export', () => {
  beforeEach(() => localStorage.clear());

  it('collects plans and diary into one document', () => {
    localStorage.setItem('workoutPlans', JSON.stringify([{ id: 'p1' }]));
    localStorage.setItem('workoutLog', JSON.stringify([{ id: 'w1' }]));
    localStorage.setItem('language', '"de"');

    const data = buildExport(localStorage, new Date('2026-11-14T20:00:00Z'));
    expect(data).toEqual({
      app: 'GetFit!',
      format: 1,
      exportedAt: '2026-11-14T20:00:00.000Z',
      plans: [{ id: 'p1' }],
      workouts: [{ id: 'w1' }],
    });
    expect(exportFileName(new Date('2026-11-14T20:00:00Z'))).toBe('getfit-daten-2026-11-14.json');
  });

  it('copes with empty or broken storage', () => {
    localStorage.setItem('workoutLog', '{broken');
    expect(buildExport(localStorage)).toMatchObject({ plans: [], workouts: [] });
  });

  it('deletes training data but keeps the settings', () => {
    for (const key of ['workoutPlans', 'workoutLog', 'restTimer', 'planDraft:new', 'planDraft:p1', 'language', 'figure']) {
      localStorage.setItem(key, '1');
    }
    expect(clearTrainingData(localStorage)).toBe(5);
    expect(Object.keys(localStorage).sort()).toEqual(['figure', 'language']);
  });
});
