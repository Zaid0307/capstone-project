import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import PageLayout from '../components/layout/PageLayout';
import WorkoutPlanCard from '../components/workoutPlans/WorkoutPlanCard';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { colors, fontWeights, sizes, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import { isPlanActive } from '../utils/workoutPlan';

// Date of the last finished training per plan.
function lastTrainedByPlan(workouts) {
  const result = new Map();
  for (const workout of workouts) {
    const planId = workout.plan?.planId;
    if (workout.status !== 'done' || !planId) continue;
    if (!result.has(planId) || result.get(planId) < workout.date) result.set(planId, workout.date);
  }
  return result;
}

export default function WorkoutPlansPage({
  plans,
  workouts = [],
  onDuplicatePlan,
  onDeletePlan,
  onRestorePlan,
  onUpdatePlan,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEmpty = plans.length === 0;
  // Several plans can be active at once; archived ones are kept for the analyses.
  const lastTrained = lastTrainedByPlan(workouts);
  // Most recently trained first; plans never trained keep their order.
  const activePlans = plans
    .filter(isPlanActive)
    .map((plan, index) => ({ plan, index }))
    .sort((a, b) => {
      const dateA = lastTrained.get(a.plan.id) ?? '';
      const dateB = lastTrained.get(b.plan.id) ?? '';
      return dateA === dateB ? a.index - b.index : dateB.localeCompare(dateA);
    })
    .map(item => item.plan);
  const archivedPlans = plans.filter(plan => !isPlanActive(plan));

  const createButton = (
    <Button onClick={() => navigate(routes.newPlan)}>
      <BiPlusCircle aria-hidden="true" />
      {t('plans.create')}
    </Button>
  );

  return (
    <PageLayout>
      <Header>
        <PageTitle>{t('plans.title')}</PageTitle>
        {/* The empty state has its own button, so there is only one clear action. */}
        {!isEmpty && createButton}
      </Header>
      {isEmpty ? (
        <Message>
          <p>{t('plans.empty')}</p>
          {createButton}
        </Message>
      ) : (
        <>
          <PlanList aria-label={t('plans.active')}>
            {activePlans.map(plan => (
              <li key={plan.id}>
                <WorkoutPlanCard
                  plan={plan}
                  lastTrained={lastTrained.get(plan.id) ?? null}
                  onDuplicatePlan={onDuplicatePlan}
                  onDeletePlan={onDeletePlan}
                  onRestorePlan={onRestorePlan}
                  onUpdatePlan={onUpdatePlan}
                />
              </li>
            ))}
          </PlanList>
          {archivedPlans.length > 0 && (
            <details>
              <ArchiveSummary>{t('plans.archive', { count: archivedPlans.length })}</ArchiveSummary>
              <PlanList aria-label={t('plans.archived')}>
                {archivedPlans.map(plan => (
                  <li key={plan.id}>
                    <WorkoutPlanCard
                      plan={plan}
                      lastTrained={lastTrained.get(plan.id) ?? null}
                      onDuplicatePlan={onDuplicatePlan}
                      onDeletePlan={onDeletePlan}
                      onRestorePlan={onRestorePlan}
                      onUpdatePlan={onUpdatePlan}
                    />
                  </li>
                ))}
              </PlanList>
            </details>
          )}
        </>
      )}
    </PageLayout>
  );
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.md};
`;

const PlanList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  list-style: none;
`;

const ArchiveSummary = styled.summary`
  display: flex;
  align-items: center;
  min-height: ${sizes.touchTarget};
  margin-bottom: ${space.sm};
  color: ${colors.textMuted};
  font-weight: ${fontWeights.medium};
  cursor: pointer;
`;
