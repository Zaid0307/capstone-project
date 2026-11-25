import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import TemplatePreview from '../components/planEditor/TemplatePreview';
import { createShareStore, isShareCode, normalizeShareCode } from '../components/workoutPlans/planSharing';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { useAuth } from '../auth/AuthContext';
import { colors, fontSizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { copyPlan } from '../utils/planEditing';
import { routes } from '../routes';

// A plan a friend shared, at /plans/share/:code: preview (days, exercises, muscle
// load) and "Take over as a copy". Needs the backend and an account; the copy
// gets new ids and belongs to the user like any own plan.
//
// Props:
//   onImport – (plan) => void, saves the copy (e.g. the app's handleCreatePlan)
//   code?    – the share code; defaults to the :code route parameter
// After taking it over the page opens the copy in the plan view.
export default function ImportSharedPlanPage({ onImport, code: codeProp }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const { client, isConfigured, user } = useAuth();
  const code = normalizeShareCode(codeProp ?? params.code ?? '');
  const canLoad = isConfigured && Boolean(user) && isShareCode(code);
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    if (!canLoad) return undefined;
    let isCurrent = true;
    createShareStore(client)
      .load(code)
      .then(result => isCurrent && setState(result ? { status: 'found', ...result } : { status: 'missing' }))
      .catch(() => isCurrent && setState({ status: 'failed' }));
    return () => {
      isCurrent = false;
    };
  }, [canLoad, client, code]);

  function handleImport() {
    const copy = copyPlan(state.plan, state.plan.nameOfWorkout);
    onImport(copy);
    navigate(routes.planView(copy.id));
  }

  let content;
  if (!isConfigured) {
    content = <Notice text={t('planShare.import.offline')} />;
  } else if (!user) {
    content = (
      <Notice text={t('planShare.import.signIn')}>
        <Link to={routes.account}>{t('planShare.import.toAccount')}</Link>
      </Notice>
    );
  } else if (!isShareCode(code) || state.status === 'missing') {
    content = <Notice role="alert" text={t('planShare.import.missing')} />;
  } else if (state.status === 'failed') {
    content = <Notice role="alert" text={t('planShare.import.failed')} />;
  } else if (state.status === 'loading') {
    content = <p role="status">{t('planShare.import.loading')}</p>;
  } else {
    const name = state.plan.nameOfWorkout;
    content = (
      <>
        <header>
          <PageTitle>{name}</PageTitle>
          <Muted>{t('planShare.import.text')}</Muted>
          {state.plan.description && <p>{state.plan.description}</p>}
        </header>
        <div>
          <Button onClick={handleImport}>{t('planShare.import.take')}</Button>
        </div>
        <TemplatePreview id="sharedPlanPreview" name={name} plan={state.plan} />
      </>
    );
  }

  return <PageLayout isWide>{content}</PageLayout>;
}

function Notice({ text, role, children }) {
  const { t } = useTranslation();
  return (
    <Message role={role}>
      <p>{text}</p>
      {children}
      <Link to={routes.plans}>{t('plans.backToPlans')}</Link>
    </Message>
  );
}

const Muted = styled.p`
  margin-top: ${space.xs};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
