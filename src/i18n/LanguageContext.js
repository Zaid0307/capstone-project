import { createContext, useContext } from 'react';
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
  const t = (key, values) => translate(language, key, values);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
