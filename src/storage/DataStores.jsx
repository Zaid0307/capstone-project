import { Fragment, useEffect, useState } from 'react';
import { PlanStoreProvider } from './PlanStoreContext';
import { WorkoutStoreProvider } from './WorkoutStoreContext';
import { createLocalPlanStore } from './localPlanStore';
import { createLocalWorkoutStore } from './localWorkoutStore';
import { copyMissingPlans, createRemotePlanStore } from './remotePlanStore';
import { copyMissingWorkouts, createRemoteWorkoutStore } from './remoteWorkoutStore';
import { PRIVACY_VERSION, recordConsent, useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';

const syncKey = userId => `syncedToAccount:${userId}`;

// After the first sign-in on a device, plans and diary that exist only here are
// copied into the account once. The privacy consent given at sign-up is stored
// now, because before the e-mail confirmation there is no session to store it.
async function prepareAccount(client, user, storage = window.localStorage) {
  const plans = createRemotePlanStore(client, user.id);
  const workouts = createRemoteWorkoutStore(client, user.id);
  if (!storage.getItem(syncKey(user.id))) {
    await copyMissingPlans(createLocalPlanStore(storage), plans);
    await copyMissingWorkouts(createLocalWorkoutStore(storage), workouts);
    storage.setItem(syncKey(user.id), new Date().toISOString());
  }
  if (user.user_metadata?.privacy_version === PRIVACY_VERSION) {
    const { data, error } = await client.from('consents').select('id').eq('version', PRIVACY_VERSION).limit(1);
    if (!error && data.length === 0) await recordConsent(client);
  }
  return { plans, workouts };
}

// Chooses where plans and diary are kept: in the browser, or in the account
// when someone is signed in. The app below is rebuilt when that changes.
export default function DataStores({ children }) {
  const { t } = useTranslation();
  const { client, user, isReady } = useAuth();
  const [account, setAccount] = useState({ userId: null, stores: null, error: null });
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return undefined;
    let isCurrent = true;
    prepareAccount(client, user)
      .then(stores => isCurrent && setAccount({ userId, stores, error: null }))
      .catch(error => isCurrent && setAccount({ userId, stores: null, error }));
    return () => {
      isCurrent = false;
    };
    // The user object changes on every token refresh; the id is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, userId]);

  if (!isReady) return <p role="status">{t('account.loading')}</p>;
  if (!userId) return <Fragment key="local">{children}</Fragment>;
  if (account.userId !== userId) return <p role="status">{t('account.syncing')}</p>;
  if (account.error) {
    return (
      <p role="alert">
        {t('account.syncError')} ({account.error.message})
      </p>
    );
  }
  return (
    <PlanStoreProvider store={account.stores.plans}>
      <WorkoutStoreProvider store={account.stores.workouts}>
        <Fragment key={userId}>{children}</Fragment>
      </WorkoutStoreProvider>
    </PlanStoreProvider>
  );
}
