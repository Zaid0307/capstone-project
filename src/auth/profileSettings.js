import { LANGUAGES } from '../i18n/translations';
import { FIGURES } from '../hooks/useFigure';

// Reading and writing the settings kept in the account (table `profiles`).
// The row is created by the backend at sign-up; the access rules only allow
// reading and updating one's own row.

export async function loadProfileSettings(client, userId) {
  const { data, error } = await client
    .from('profiles')
    .select('language, figure, created_at, updated_at')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return {
    language: LANGUAGES.includes(data.language) ? data.language : null,
    figure: FIGURES.includes(data.figure) ? data.figure : null,
    // A row that was never updated still holds the backend defaults, not a choice.
    isUntouched: data.updated_at === data.created_at,
  };
}

export async function saveProfileSettings(client, userId, { language, figure }) {
  const changes = {};
  if (LANGUAGES.includes(language)) changes.language = language;
  if (FIGURES.includes(figure)) changes.figure = figure;
  if (Object.keys(changes).length === 0) return;
  const { error } = await client.from('profiles').update(changes).eq('id', userId);
  if (error) throw error;
}
