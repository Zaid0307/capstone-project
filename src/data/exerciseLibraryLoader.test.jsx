import { render, screen } from '@testing-library/react';
import { WithExerciseLibrary, exerciseLibrary, loadExerciseLibrary } from './exerciseLibraryLoader';
import { EXERCISES } from './exerciseLibrary';
import legacyNames from './legacyExerciseNames.json';
import existingIds from '../../scripts/existing_exercise_ids.json';
import { findLibraryExercise, migratePlan } from '../utils/workoutPlan';

describe('exercise library loader', () => {
  it('holds the catalog once it is loaded', async () => {
    const library = await loadExerciseLibrary();
    expect(library).toBe(exerciseLibrary());
    expect(library.EXERCISES).toBe(EXERCISES);
    expect(library.exerciseById('plank').id).toBe('plank');
  });

  it('renders children once the catalog is there', async () => {
    render(
      <WithExerciseLibrary fallback={<p>Loading</p>}>
        <p>Ready</p>
      </WithExerciseLibrary>
    );
    expect(await screen.findByText('Ready')).toBeInTheDocument();
  });
});

describe('names of older exercises', () => {
  it('covers every exercise the app had before catalog V2 and only known ids', () => {
    const ids = new Set(Object.values(legacyNames));
    const known = new Set(EXERCISES.map(exercise => exercise.id));
    for (const id of existingIds) expect(ids.has(id) || !known.has(id), id).toBe(true);
    for (const id of ids) expect(known.has(id), id).toBe(true);
  });

  it('lets plans of the first app versions find their exercises without the catalog', () => {
    expect(findLibraryExercise('Langhantel-Bankdrücken')).toEqual({ id: 'barbell_bench_press' });
    const plan = migratePlan({
      id: 'v1',
      nameOfWorkout: 'Old',
      days: [{ day: 'monday', muscles: [{ name: 'Chest', exercises: [{ exercise: 'Forearm plank', sets: '3', repetitions: '30' }] }] }],
    });
    expect(plan.days[0].entries[0].exerciseId).toBe('plank');
  });
});
