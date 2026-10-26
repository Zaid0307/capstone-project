const API_URL = 'https://wger.de/api/v2';

export const LANGUAGE_IDS = { de: 1, en: 2 };

// Muscle ids from https://wger.de/api/v2/muscle/
export const MUSCLE_GROUPS = {
  chest: [4],
  back: [12, 3, 9],
  abs: [14, 6],
  shoulders: [2],
  arms: [1, 13, 5],
  legs: [7, 8, 10, 15, 11],
};

export const MUSCLE_GROUP_NAMES = Object.keys(MUSCLE_GROUPS);

async function fetchResults(path) {
  const response = await fetch(`${API_URL}/${path}`);
  if (!response.ok) {
    throw new Error(`wger request failed: ${response.status} ${path}`);
  }
  const data = await response.json();
  return data.results;
}

export function stripHtml(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function indexByExercise(items) {
  const index = new Map();
  items.forEach(item => {
    if (!index.has(item.exercise)) {
      index.set(item.exercise, []);
    }
    index.get(item.exercise).push(item);
  });
  return index;
}

function pickMain(items = []) {
  return items.find(item => item.is_main) ?? items[0];
}

export function buildExercises({
  exercises,
  translations,
  fallbackTranslations = [],
  images = [],
  videos = [],
}) {
  const translationByExercise = new Map(
    translations.map(translation => [translation.exercise, translation])
  );
  const fallbackByExercise = new Map(
    fallbackTranslations.map(translation => [translation.exercise, translation])
  );
  const imagesByExercise = indexByExercise(images);
  const videosByExercise = indexByExercise(videos);

  return exercises
    .map(exercise => {
      const translation =
        translationByExercise.get(exercise.id) ??
        fallbackByExercise.get(exercise.id);
      if (!translation || !translation.name.trim()) {
        return null;
      }
      const image = pickMain(imagesByExercise.get(exercise.id));
      const video = pickMain(videosByExercise.get(exercise.id));

      return {
        id: exercise.id,
        name: translation.name.trim(),
        description: stripHtml(translation.description),
        image: image?.image ?? null,
        video: video?.video ?? null,
        muscles: exercise.muscles,
        musclesSecondary: exercise.muscles_secondary ?? [],
      };
    })
    .filter(Boolean);
}

export function groupByMuscle(exercises) {
  const groups = {};
  MUSCLE_GROUP_NAMES.forEach(group => {
    const muscleIds = MUSCLE_GROUPS[group];
    groups[group] = exercises
      .filter(exercise => exercise.muscles.some(id => muscleIds.includes(id)))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
  return groups;
}

export async function fetchExercises(language = 'en') {
  const languageId = LANGUAGE_IDS[language] ?? LANGUAGE_IDS.en;
  const needsFallback = languageId !== LANGUAGE_IDS.en;

  const [exercises, translations, fallbackTranslations, images, videos] =
    await Promise.all([
      fetchResults('exercise/?limit=1000'),
      fetchResults(`exercise-translation/?language=${languageId}&limit=1000`),
      needsFallback
        ? fetchResults(
            `exercise-translation/?language=${LANGUAGE_IDS.en}&limit=1000`
          )
        : [],
      fetchResults('exerciseimage/?limit=1000'),
      fetchResults('video/?limit=1000'),
    ]);

  return groupByMuscle(
    buildExercises({
      exercises,
      translations,
      fallbackTranslations,
      images,
      videos,
    })
  );
}
