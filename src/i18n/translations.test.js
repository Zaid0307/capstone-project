import { LANGUAGES, translate } from './translations';
import translationsModule from './translations';

describe('translate', () => {
  it('translates into German and English', () => {
    expect(translate('de', 'muscle.chest')).toBe('Brust');
    expect(translate('en', 'muscle.chest')).toBe('Chest');
  });

  it('fills in placeholders', () => {
    expect(translate('de', 'plans.deleteDay', { day: 'Montag' })).toBe(
      'Montag löschen'
    );
  });

  it('falls back to English and then to the key', () => {
    expect(translate('fr', 'muscle.legs')).toBe('Legs');
    expect(translate('de', 'does.not.exist')).toBe('does.not.exist');
  });

  it('has the same keys in every language', () => {
    expect(LANGUAGES).toEqual(['en', 'de']);
    const keys = LANGUAGES.map(language =>
      Object.keys(translationsModule[language]).sort()
    );
    expect(keys[1]).toEqual(keys[0]);
  });
});
