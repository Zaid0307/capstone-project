import { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { loadProfileSettings, saveProfileSettings } from './profileSettings';
import { useTranslation } from '../i18n/LanguageContext';
import useFigure from '../hooks/useFigure';

// Keeps language and figure in the account while someone is signed in. On
// sign-in, the settings from the account are taken over; an account that never
// stored settings gets the ones from this device. Later changes are saved to the
// account. Without an account, the settings stay on this device only.
// Renders nothing; failures are only logged, the local settings keep working.
export default function ProfileSync() {
  const { client, user } = useAuth();
  const { language, setLanguage } = useTranslation();
  const [figure, setFigure] = useFigure();
  const userId = user?.id ?? null;
  // The settings as last known in the account, per user.
  const synced = useRef(null);
  // The current device settings, for the sign-in step that runs asynchronously.
  const local = useRef({ language, figure });
  useEffect(() => {
    local.current = { language, figure };
  }, [language, figure]);

  useEffect(() => {
    synced.current = null;
    if (!client || !userId) return undefined;
    let isCurrent = true;
    loadProfileSettings(client, userId)
      .then(async remote => {
        if (!isCurrent) return;
        if (remote.isUntouched) {
          const settings = local.current;
          await saveProfileSettings(client, userId, settings);
          if (isCurrent) synced.current = { userId, ...settings };
          return;
        }
        const settings = {
          language: remote.language ?? local.current.language,
          figure: remote.figure ?? local.current.figure,
        };
        synced.current = { userId, ...settings };
        if (settings.language !== local.current.language) setLanguage(settings.language);
        if (settings.figure !== local.current.figure) setFigure(settings.figure);
      })
      .catch(error => console.warn('GetFit!: settings could not be synced with the account.', error));
    return () => {
      isCurrent = false;
    };
  }, [client, userId, setLanguage, setFigure]);

  useEffect(() => {
    const last = synced.current;
    if (!client || !last || last.userId !== userId) return;
    if (last.language === language && last.figure === figure) return;
    synced.current = { userId, language, figure };
    saveProfileSettings(client, userId, { language, figure }).catch(error =>
      console.warn('GetFit!: settings could not be saved in the account.', error)
    );
  }, [client, userId, language, figure]);

  return null;
}
