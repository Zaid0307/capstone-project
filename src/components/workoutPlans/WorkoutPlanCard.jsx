import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdContentCopy,
  MdMoreVert,
  MdOutlineArchive,
  MdOutlineDeleteForever,
  MdOutlineEdit,
  MdOutlineUnarchive,
  MdShare,
} from 'react-icons/md';
import PlanDay from './PlanDay';
import PlanHints, { SafetyHint } from './PlanHints';
import { scheduleText } from './planSummary';
import SharePlanPanel from './SharePlanPanel';
import IconButton from '../ui/IconButton';
import { useUndo } from '../ui/UndoProvider';
import ToggleButton from '../ui/ToggleButton';
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  shadows,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { copyPlan, setArchived } from '../../utils/planEditing';
import { isPlanActive, migratePlan, orderedDays } from '../../utils/workoutPlan';
import { toDateKey } from '../../utils/workoutLog';
import { routes } from '../../routes';
import { useIsGuest } from '../../auth/useAccess';
import { useAuth } from '../../auth/AuthContext';
import { tCount } from '../analysis/format';

function daysBetween(from, to) {
  const [a, b] = [from, to].map(key => {
    const [year, month, day] = key.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  });
  return Math.round((b - a) / 86400000);
}

// "today", "yesterday", "3 days ago" or a date; "never trained" without a workout.
function lastTrainedText(lastDate, today, t, language) {
  if (!lastDate) return t('plans.summary.never');
  const days = daysBetween(lastDate, today);
  if (days <= 0) return t('plans.summary.lastToday');
  if (days === 1) return t('plans.summary.lastYesterday');
  if (days < 7) return t('plans.summary.lastDaysAgo', { count: days });
  const [year, month, day] = lastDate.split('-').map(Number);
  const date = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'numeric', year: '2-digit' }).format(
    new Date(year, month - 1, day)
  );
  return t('plans.summary.lastDate', { date });
}

// One plan in the list: name, a short summary, "Train" and further actions (⋮).
// Opening the card shows its days and exercises read-only; changes happen in the editor.
// The name links to the plan view (all days, muscle load and hints on one page).
export default function WorkoutPlanCard({
  plan: savedPlan,
  lastTrained = null,
  onDuplicatePlan,
  onDeletePlan,
  onRestorePlan,
  onUpdatePlan,
}) {
  const { t, language } = useTranslation();
  const isGuest = useIsGuest();
  const { isConfigured, user } = useAuth();
  // Sharing needs the backend and an account.
  const canShare = isConfigured && Boolean(user);
  const [isSharing, setIsSharing] = useState(false);
  const id = useId();
  const showUndo = useUndo();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const plan = migratePlan(savedPlan);
  const name = plan.nameOfWorkout;
  const isActive = isPlanActive(plan);
  const days = orderedDays(plan);
  const exerciseCount = plan.days.reduce((sum, day) => sum + day.entries.length, 0);

  const schedule = scheduleText(plan, t, language);

  // The menu closes with Escape (focus back to ⋮) and with a tap outside.
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    function handleKey(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function handlePointer(event) {
      if (!menuRef.current?.contains(event.target) && !menuButtonRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handlePointer);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handlePointer);
    };
  }, [isMenuOpen]);

  function run(action) {
    setIsMenuOpen(false);
    action();
  }

  function handleArchive(archived) {
    onUpdatePlan(setArchived(savedPlan, archived));
    showUndo(t(archived ? 'plans.archivedNotice' : 'plans.unarchivedNotice', { name }), () =>
      onUpdatePlan(savedPlan)
    );
  }

  function handleDeletePlan() {
    onDeletePlan(plan.id);
    showUndo(t('plans.deleted', { name }), () => onRestorePlan(savedPlan, 'add'));
  }

  const archiveLabel = t(isActive ? 'plans.archivePlan' : 'plans.unarchivePlan', { name });

  return (
    <Card>
      <Head>
        <TitleBlock>
          <Title>
            <TitleLink to={routes.planView(plan.id)}>{name}</TitleLink>
          </Title>
          <Summary>
            {[schedule, tCount(t, 'plans.summary.days', plan.days.length)].filter(Boolean).join(' · ')}
          </Summary>
          <Summary>
            {tCount(t, 'plans.summary.exercises', exerciseCount)} ·{' '}
            {lastTrainedText(lastTrained, toDateKey(), t, language)}
          </Summary>
        </TitleBlock>
        <Actions>
          {isActive && !isGuest && (
            <TrainButton
              type="button"
              aria-label={t('plans.train', { name })}
              onClick={() => navigate(routes.diaryForPlan(plan.id))}
            >
              {t('plans.trainShort')}
            </TrainButton>
          )}
          <IconButton
            ref={menuButtonRef}
            aria-label={t('plans.more', { name })}
            title={t('plans.more', { name })}
            aria-expanded={isMenuOpen}
            aria-controls={`${id}-menu`}
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <MdMoreVert />
          </IconButton>
          <ToggleButton name={name} isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </Actions>
        {isMenuOpen && (
          <Menu id={`${id}-menu`} ref={menuRef}>
            <li>
              <MenuItem type="button" onClick={() => run(() => navigate(routes.editPlan(plan.id)))}>
                <MdOutlineEdit aria-hidden="true" />
                <span aria-hidden="true">{t('plans.menu.edit')}</span>
                <VisuallyHidden>{t('plans.edit', { name })}</VisuallyHidden>
              </MenuItem>
            </li>
            <li>
              <MenuItem
                type="button"
                onClick={() => run(() => onDuplicatePlan(copyPlan(plan, t('plans.copyName', { name }))))}
              >
                <MdContentCopy aria-hidden="true" />
                <span aria-hidden="true">{t('plans.menu.duplicate')}</span>
                <VisuallyHidden>{t('plans.duplicate', { name })}</VisuallyHidden>
              </MenuItem>
            </li>
            {canShare && (
              <li>
                <MenuItem type="button" onClick={() => run(() => setIsSharing(true))}>
                  <MdShare aria-hidden="true" />
                  <span aria-hidden="true">{t('planShare.menu')}</span>
                  <VisuallyHidden>{t('planShare.menuName', { name })}</VisuallyHidden>
                </MenuItem>
              </li>
            )}
            <li>
              <MenuItem type="button" onClick={() => run(() => handleArchive(isActive))}>
                {isActive ? <MdOutlineArchive aria-hidden="true" /> : <MdOutlineUnarchive aria-hidden="true" />}
                <span aria-hidden="true">{t(isActive ? 'plans.menu.archive' : 'plans.menu.unarchive')}</span>
                <VisuallyHidden>{archiveLabel}</VisuallyHidden>
              </MenuItem>
            </li>
            <Divider aria-hidden="true" />
            <li>
              <MenuItem type="button" $isDanger onClick={() => run(handleDeletePlan)}>
                <MdOutlineDeleteForever aria-hidden="true" />
                <span aria-hidden="true">{t('plans.menu.delete')}</span>
                <VisuallyHidden>{t('plans.delete', { name })}</VisuallyHidden>
              </MenuItem>
            </li>
          </Menu>
        )}
      </Head>
      {isSharing && (
        <SharePlanPanel
          plan={savedPlan}
          onClose={() => {
            setIsSharing(false);
            menuButtonRef.current?.focus();
          }}
        />
      )}
      {/* Safety hints stay visible, also when the plan is collapsed. */}
      <SafetyHint hints={plan.hints} />
      {isExpanded && (
        <>
          {plan.description && <Description>{plan.description}</Description>}
          <PlanHints hints={plan.hints} />
          <DayList>
            {days.map(day => (
              <PlanDay key={day.id} day={day} schedule={plan.schedule} />
            ))}
          </DayList>
        </>
      )}
    </Card>
  );
}

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Head = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
`;

const TitleBlock = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: ${fontSizes.section};
`;

// Long names: at most two lines. The link fills the touch height of the row.
const TitleLink = styled(Link)`
  display: -webkit-box;
  min-height: ${sizes.touchTarget};
  overflow: hidden;
  color: inherit;
  overflow-wrap: anywhere;
  text-decoration: underline;
  text-decoration-color: ${colors.border};
  text-underline-offset: 0.2em;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  &:hover {
    text-decoration-color: currentColor;
  }
`;

const Summary = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${space.xs};
`;

const TrainButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: none;
  border-radius: ${radii.pill};
  background-color: ${colors.primary};
  color: ${colors.onPrimary};
  font-weight: ${fontWeights.medium};
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(${sizes.touchTarget} + ${space.xs});
  right: 0;
  z-index: 2;
  min-width: 12rem;
  padding: ${space.xs} 0;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  list-style: none;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  width: 100%;
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: none;
  background: none;
  color: ${props => (props.$isDanger ? colors.error : colors.text)};
  font-weight: ${fontWeights.medium};
  text-align: left;
  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
`;

const Divider = styled.li`
  margin: ${space.xs} 0;
  border-top: 1px solid ${colors.surfaceMuted};
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Description = styled.p`
  color: ${colors.textMuted};
`;

const DayList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  list-style: none;
`;
