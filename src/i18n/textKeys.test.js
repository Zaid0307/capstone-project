import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import translations, { LANGUAGES } from './translations';
import accountTexts from './accountTexts';
import analysisTexts from './analysisTexts';
import catalogTexts from './catalogTexts';
import diaryTexts from './diaryTexts';
import editorTexts from './editorTexts';
import statsTexts from './statsTexts';

// Checks the texts against the code: every text exists in German and English,
// and every key the code asks for exists. Keys built at run time (t(`a.${b}`))
// are checked by their fixed beginning.

const SRC = join(process.cwd(), 'src');

function sourceFiles(dir = SRC) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!/\.(js|jsx)$/.test(name) || /\.(test|stories)\.(js|jsx)$/.test(name)) return [];
    if (/setupTests|test-utils/.test(name)) return [];
    return [path];
  });
}

const code = sourceFiles().map(path => ({ path: relative(SRC, path), text: readFileSync(path, 'utf8') }));
const keys = new Set(Object.keys(translations.en));

// Static keys: t('a.b'), t("a.b"), t(`a.b`) and translate(language, 'a.b').
function staticKeys() {
  const found = [];
  for (const { path, text } of code) {
    for (const match of text.matchAll(/\bt\(\s*(['"`])([a-zA-Z][\w.-]*)\1\s*[,)]/g)) found.push({ path, key: match[2] });
    for (const match of text.matchAll(/\btranslate\([^,()]+,\s*(['"`])([a-zA-Z][\w.-]*)\1/g)) {
      found.push({ path, key: match[2] });
    }
  }
  return found;
}

// Keys built at run time: the fixed part before the first ${...}.
function dynamicPrefixes() {
  const found = [];
  for (const { path, text } of code) {
    for (const match of text.matchAll(/\bt\(\s*`([^`$]*)\$\{/g)) found.push({ path, prefix: match[1] });
  }
  return found;
}

// Run-time keys whose beginning cannot be checked this way (none at the moment).
const DYNAMIC_EXCEPTIONS = [];

describe('text keys', () => {
  it.each([
    ['accountTexts', accountTexts],
    ['analysisTexts', analysisTexts],
    ['catalogTexts', catalogTexts],
    ['diaryTexts', diaryTexts],
    ['editorTexts', editorTexts],
    ['statsTexts', statsTexts],
  ])('%s has every text in German and English', (name, texts) => {
    expect(Object.keys(texts).sort()).toEqual([...LANGUAGES].sort());
    expect(Object.keys(texts.de).sort()).toEqual(Object.keys(texts.en).sort());
  });

  it('has no empty texts', () => {
    const empty = LANGUAGES.flatMap(language =>
      Object.entries(translations[language])
        .filter(([, text]) => typeof text !== 'string' || text.trim() === '')
        .map(([key]) => `${language}:${key}`)
    );
    expect(empty).toEqual([]);
  });

  it('knows every key the code asks for', () => {
    const missing = staticKeys()
      .filter(({ key }) => !keys.has(key))
      .map(({ path, key }) => `${path}: ${key}`);
    expect(missing).toEqual([]);
  });

  it('knows texts for every key built at run time', () => {
    const allKeys = [...keys];
    const unknown = dynamicPrefixes()
      .filter(({ prefix }) => !DYNAMIC_EXCEPTIONS.includes(prefix))
      .filter(({ prefix }) => !allKeys.some(key => key.startsWith(prefix)))
      .map(({ path, prefix }) => `${path}: ${prefix}…`);
    expect(unknown).toEqual([]);
  });
});
