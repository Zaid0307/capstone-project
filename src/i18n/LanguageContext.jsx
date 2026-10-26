import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { LANGUAGES, translate } from './translations';

function getBrowserLanguage() {
  const browserLanguage = (navigator.language || 'en').slice(0, 2);
  return LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
}

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, values) => translate('en', key, values),
});

export function LanguageProvider({ children, initialLanguage }) {
  const [language, setLanguage] = useLocalStorage(
    'language',
    initialLanguage ?? getBrowserLanguage()
  );
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key, values) => translate(language, key, values),
    [language]
  );
  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
