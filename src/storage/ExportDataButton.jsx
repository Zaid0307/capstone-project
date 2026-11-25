import { useState } from 'react';
import Button from '../components/ui/Button';
import { ErrorText } from '../components/planEditor/formStyles';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { downloadExport } from '../utils/dataExport';
import { buildStoreExport, downloadJson } from './accountExport';
import { usePlanStore } from './PlanStoreContext';
import { useWorkoutStore } from './WorkoutStoreContext';

// "Export my data": without an account the data of this device, with an account
// the plans and diary stored in the account.
export default function ExportDataButton({ download = downloadJson }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const planStore = usePlanStore();
  const workoutStore = useWorkoutStore();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleExport() {
    setError(null);
    if (!user) {
      downloadExport();
      return;
    }
    setIsBusy(true);
    try {
      download(await buildStoreExport(planStore, workoutStore));
    } catch (exportError) {
      setError(t('account.exportError', { message: exportError.message }));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <>
      <Button $variant="secondary" onClick={handleExport} disabled={isBusy} aria-busy={isBusy}>
        {t(user ? 'account.exportAccount' : 'settings.data.export')}
      </Button>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </>
  );
}
