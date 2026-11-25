import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineEdit } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import PlanAnalysis from '../components/planEditor/PlanAnalysis';
import PlanDay from '../components/workoutPlans/PlanDay';
import PlanHints, { SafetyHint } from '../components/workoutPlans/PlanHints';
import { scheduleText } from '../components/workoutPlans/planSummary';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { tCount } from '../components/analysis/format';
import { colors, fontSizes, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { isPlanActive, migratePlan, orderedDays } from '../utils/workoutPlan';
import { routes } from '../routes';
import { useExerciseLibrary } from '../data/exerciseLibraryLoader';
import { useIsGuest } from '../auth/useAccess';

// Read-only view of one plan at /plans/:planId: its days with all exercises, the
// muscle load of the week, the hints it kept from its template, and the buttons
// "Train" and "Edit". Changes happen only in the editor.
//
// Props:
//   plans    – all saved plans (any plan model version; migrated for display)
//   planId?  – the plan to show; defaults to the :planId route parameter
//   onTrain? – (plan) => void, "Train"; defaults to the diary for this plan
//   onEdit?  – (plan) => void, "Edit"; defaults to the plan editor
// "Train" is only shown for active plans; archived plans say how to restore them.
export default function PlanViewPage({ plans, planId: planIdProp, onTrain, onEdit }) {
  const { t, language } = useTranslation();
  const isGuest = useIsGuest();
  const navigate = useNavigate();
  // Exercise names come from the catalog; render again once it is loaded.
  useExerciseLibrary();
  const params = useParams();
  const planId = planIdProp ?? params.planId;
  const savedPlan = plans.find(item => item.id === planId);

  if (!savedPlan) {
    return (
      <PageLayout>
        <Message role="alert">
          <p>{t('plans.notFound')}</p>
          <Link to={routes.plans}>{t('plans.backToPlans')}</Link>
        </Message>
      </PageLayout>
    );
  }

  const plan = migratePlan(savedPlan);
  const name = plan.nameOfWorkout;
  const isActive = isPlanActive(plan);
  const exerciseCount = plan.days.reduce((sum, day) => sum + day.entries.length, 0);
  const summary = [
    scheduleText(plan, t, language),
    tCount(t, 'plans.summary.days', plan.days.length),
    tCount(t, 'plans.summary.exercises', exerciseCount),
  ].filter(Boolean);
  const train = onTrain ?? (() => navigate(routes.diaryForPlan(plan.id)));
  const edit = onEdit ?? (() => navigate(routes.editPlan(plan.id)));
  const hasTemplateHints = Boolean(plan.hints?.progression || plan.hints?.repsInReserve || plan.hints?.recovery);

  return (
    <PageLayout isWide>
      <BackLink to={routes.plans}>
        <BiArrowBack aria-hidden="true" />
        {t('plans.backToPlans')}
      </BackLink>
      <header>
        <PageTitle>{name}</PageTitle>
        <Summary>{summary.join(' · ')}</Summary>
        {plan.description && <Description>{plan.description}</Description>}
      </header>
      <Actions role="group" aria-label={t('planView.actions', { name })}>
        {isActive && !isGuest && (
          <Button aria-label={t('plans.train', { name })} onClick={() => train(plan)}>
            {t('plans.trainShort')}
          </Button>
        )}
        <Button $variant="secondary" aria-label={t('plans.edit', { name })} onClick={() => edit(plan)}>
          <MdOutlineEdit aria-hidden="true" />
          {t('plans.menu.edit')}
        </Button>
      </Actions>
      {!isActive && <Description>{t('planView.archived')}</Description>}
      <SafetyHint hints={plan.hints} />

      <Layout>
        <section aria-labelledby="planViewDays">
          <SectionTitle id="planViewDays">{t('planView.days')}</SectionTitle>
          <DayList>
            {orderedDays(plan).map(day => (
              <PlanDay key={day.id} day={day} schedule={plan.schedule} defaultExpanded />
            ))}
          </DayList>
        </section>
        <PlanAnalysis plan={plan} />
      </Layout>

      {hasTemplateHints && (
        <section aria-labelledby="planViewHints">
          <SectionTitle id="planViewHints">{t('planView.hints')}</SectionTitle>
          <Hints>
            <PlanHints hints={plan.hints} />
          </Hints>
        </section>
      )}
    </PageLayout>
  );
}

const BackLink = styled(Link)`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  color: ${colors.text};
`;

const Summary = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const Description = styled.p`
  margin-top: ${space.sm};
  color: ${colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

// Days and analysis side by side on wide screens, one below the other on phones.
const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xl};
  @media (min-width: 800px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: ${space.md};
  font-size: ${fontSizes.section};
`;

const DayList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  list-style: none;
`;

const Hints = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
`;
