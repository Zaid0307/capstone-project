import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BiPlus } from 'react-icons/bi';
import { MdArrowBack, MdTune, MdUndo } from 'react-icons/md';
import DayEditor from './DayEditor';
import PlanAnalysis from './PlanAnalysis';
import { ErrorText, Field, FormCard, Input, Label, Select } from './formStyles';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import usePlanDraft, { clearPlanDraft } from '../../hooks/usePlanDraft';
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
import {
  addDay,
  setDaysPerWeek,
  setPlanDates,
  setScheduleType,
  updatePlanDetails,
} from '../../utils/planEditing';
import {
  SCHEDULE_TYPES,
  WEEKDAYS,
  dayTitle,
  defaultDayName,
  orderedDays,
  planProblems,
} from '../../utils/workoutPlan';

// Undo history: at most this many steps; quick changes (typing) count as one step.
const HISTORY_LIMIT = 50;
const STEP_PAUSE_MS = 800;

const isTextField = element => ['INPUT', 'TEXTAREA', 'SELECT'].includes(element?.tagName);

// Creates or edits a plan on one page: details, schedule, days and their
// exercises. Every change is kept as a draft until the plan is saved or the
// editing is cancelled.
export default function PlanEditor({ initialPlan, draftKey, isNew, onSave, onCancel }) {
  const { t } = useTranslation();
  const { plan, setPlan, isRestored, discardDraft } = usePlanDraft(draftKey, initialPlan);
  const [selectedDayId, setSelectedDayId] = useState(() => orderedDays(plan)[0]?.id ?? null);
  const [showProblems, setShowProblems] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  // Description, schedule and dates open per tap; days and exercises come first.
  const [showDetails, setShowDetails] = useState(false);
  const [past, setPast] = useState([]);
  const problemsRef = useRef(null);
  // The plan as last rendered, so changes from undo messages start from the newest version.
  const planRef = useRef(plan);
  const lastStepAt = useRef(0);

  useEffect(() => {
    planRef.current = plan;
  }, [plan]);

  function recordStep(before) {
    const now = Date.now();
    if (now - lastStepAt.current > STEP_PAUSE_MS) {
      setPast(steps => [...steps.slice(-(HISTORY_LIMIT - 1)), before]);
    }
    lastStepAt.current = now;
  }

  function edit(change) {
    const before = planRef.current;
    const next = change(before);
    if (next === before) return;
    recordStep(before);
    planRef.current = next;
    setPlan(next);
  }

  const undo = useCallback(() => {
    setPast(steps => {
      if (steps.length === 0) return steps;
      const previous = steps[steps.length - 1];
      planRef.current = previous;
      setPlan(previous);
      lastStepAt.current = 0;
      return steps.slice(0, -1);
    });
  }, [setPlan]);

  // Ctrl+Z / Cmd+Z undoes plan changes; inside a text field the field's own undo stays.
  useEffect(() => {
    function handleKey(event) {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z' && !isTextField(event.target)) {
        event.preventDefault();
        undo();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo]);
  const days = orderedDays(plan);
  const selectedDay = days.find(day => day.id === selectedDayId) ?? days[0] ?? null;
  const problems = showProblems ? planProblems(plan) : [];
  const nameMissing = problems.some(problem => problem.type === 'name');
  const scheduleSummary =
    plan.schedule.type === 'rotation'
      ? t('planEditor.summary.rotation', { count: plan.schedule.daysPerWeek ?? Math.max(1, Math.min(7, plan.days.length || 3)) })
      : t('planEditor.summary.weekdays');

  function handleAddDay() {
    const usedWeekdays = plan.days.map(day => day.weekday);
    const values =
      plan.schedule.type === 'rotation'
        ? { name: defaultDayName(plan.days.length, t) }
        : { weekday: WEEKDAYS.find(weekday => !usedWeekdays.includes(weekday)) ?? null };
    const result = addDay(plan, values);
    edit(() => result.plan);
    setSelectedDayId(result.day.id);
  }

  function handleSave() {
    const found = planProblems(plan);
    if (found.length > 0) {
      setShowProblems(true);
      const dayWithProblem = found.find(problem => problem.dayId)?.dayId;
      if (dayWithProblem) setSelectedDayId(dayWithProblem);
      // Wait for the list to render, then move focus there.
      setTimeout(() => problemsRef.current?.focus(), 0);
      return;
    }
    clearPlanDraft(draftKey);
    onSave({
      ...plan,
      nameOfWorkout: plan.nameOfWorkout.trim(),
      description: plan.description.trim(),
      days: plan.days.map(day => ({ ...day, name: day.name.trim() })),
    });
  }

  // Leaving with changes offers to save, keep the draft or discard it.
  function handleBack() {
    if (plan === initialPlan) {
      clearPlanDraft(draftKey);
      onCancel();
      return;
    }
    setIsLeaving(true);
  }

  function discardAndLeave() {
    clearPlanDraft(draftKey);
    onCancel();
  }

  function problemText(problem) {
    const day = plan.days.find(item => item.id === problem.dayId);
    const text = t(`planEditor.problem.${problem.type}`);
    return day ? `${dayTitle(day, plan.schedule, t)}: ${text}` : text;
  }

  return (
    <Layout>
      <TopBar>
        <IconButton aria-label={t('planEditor.back')} title={t('planEditor.back')} onClick={handleBack}>
          <MdArrowBack />
        </IconButton>
        <TopTitle>{t(isNew ? 'planEditor.createTitle' : 'planEditor.editTitle')}</TopTitle>
        <IconButton
          aria-label={t('planEditor.undo')}
          title={t('planEditor.undo')}
          disabled={past.length === 0}
          onClick={undo}
        >
          <MdUndo />
        </IconButton>
        <Button onClick={handleSave}>{t(isNew ? 'planEditor.create' : 'planEditor.save')}</Button>
      </TopBar>

      {isLeaving && (
        <LeavePanel role="alertdialog" aria-labelledby="leaveTitle" aria-describedby="leaveText">
          <p id="leaveTitle">
            <strong>{t('planEditor.leave.title')}</strong>
          </p>
          <p id="leaveText">{t('planEditor.leave.text')}</p>
          <Buttons>
            <Button onClick={handleSave}>{t(isNew ? 'planEditor.create' : 'planEditor.save')}</Button>
            <Button $variant="secondary" onClick={onCancel}>
              {t('planEditor.leave.keepDraft')}
            </Button>
            <Button $variant="secondary" onClick={discardAndLeave}>
              {t('planEditor.leave.discard')}
            </Button>
            <Button $variant="secondary" onClick={() => setIsLeaving(false)}>
              {t('planEditor.leave.stay')}
            </Button>
          </Buttons>
        </LeavePanel>
      )}

      <MainArea>

        {isRestored && (
          <Notice role="status">
            <p>{t('planEditor.draftRestored')}</p>
            <Button $variant="secondary" onClick={discardDraft}>
              {t('planEditor.discardDraft')}
            </Button>
          </Notice>
        )}

        <HeaderCard aria-label={t('planEditor.details')}>
          <HeaderRow>
            <NameField>
              <SmallLabel htmlFor="planName">{t('planEditor.name')}</SmallLabel>
              <Input
                id="planName"
                type="text"
                maxLength={100}
                required
                aria-invalid={nameMissing || undefined}
                aria-describedby={nameMissing ? 'planNameError' : undefined}
                value={plan.nameOfWorkout}
                onChange={event => edit(current => updatePlanDetails(current, { nameOfWorkout: event.target.value }))}
              />
            </NameField>
            <DetailsToggle
              type="button"
              aria-expanded={showDetails}
              aria-controls="planDetails"
              title={t('planEditor.detailsToggle')}
              onClick={() => setShowDetails(open => !open)}
            >
              <MdTune aria-hidden="true" />
              <ToggleText>
                <VisuallyHidden>{t('planEditor.detailsToggle')}: </VisuallyHidden>
                {scheduleSummary}
              </ToggleText>
            </DetailsToggle>
          </HeaderRow>
          {nameMissing && <ErrorText id="planNameError">{t('planEditor.problem.name')}</ErrorText>}
          {showDetails && (
            <DetailsPanel id="planDetails">
              <Field>
                <Label htmlFor="planDescription">{t('planEditor.description')}</Label>
                <Input
                  id="planDescription"
                  type="text"
                  maxLength={300}
                  value={plan.description}
                  onChange={event => edit(current => updatePlanDetails(current, { description: event.target.value }))}
                />
              </Field>
              <Fieldset aria-describedby="scheduleHint">
                <Legend>{t('planEditor.schedule.label')}</Legend>
                <Segments>
                  {SCHEDULE_TYPES.map(type => (
                    <Segment key={type}>
                      <input
                        type="radio"
                        name="scheduleType"
                        value={type}
                        checked={plan.schedule.type === type}
                        onChange={() => edit(current => setScheduleType(current, type))}
                      />
                      <span>{t(`planEditor.schedule.${type}`)}</span>
                    </Segment>
                  ))}
                </Segments>
                <Muted id="scheduleHint">{t(`planEditor.schedule.${plan.schedule.type}Hint`)}</Muted>
              </Fieldset>
              <Dates>
                <Field>
                  <Label htmlFor="planStartDate">{t('planEditor.schedule.startDate')}</Label>
                  <Input
                    id="planStartDate"
                    type="date"
                    value={plan.schedule.startDate ?? ''}
                    onChange={event => edit(current => setPlanDates(current, { startDate: event.target.value }))}
                  />
                </Field>
                <Field>
                  <Label htmlFor="planEndDate">{t('planEditor.schedule.endDate')}</Label>
                  <Input
                    id="planEndDate"
                    type="date"
                    min={plan.schedule.startDate ?? undefined}
                    value={plan.schedule.endDate ?? ''}
                    onChange={event => edit(current => setPlanDates(current, { endDate: event.target.value }))}
                  />
                </Field>
              </Dates>
              {plan.schedule.type === 'rotation' && (
                <Field>
                  <Label htmlFor="planDaysPerWeek">{t('planEditor.schedule.daysPerWeek')}</Label>
                  <Select
                    id="planDaysPerWeek"
                    value={plan.schedule.daysPerWeek ?? Math.max(1, Math.min(7, plan.days.length || 3))}
                    onChange={event =>
                      edit(current => setDaysPerWeek(current, Number(event.target.value)))
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(count => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
            </DetailsPanel>
          )}
        </HeaderCard>

        <FormCard aria-labelledby="planDaysTitle">
          <SectionTitle id="planDaysTitle">{t('planEditor.days')}</SectionTitle>
          <DayTabs role="group" aria-label={t('planEditor.chooseDay')}>
            {days.map(day => (
              <DayTab
                key={day.id}
                type="button"
                aria-pressed={selectedDay?.id === day.id}
                $hasProblem={problems.some(problem => problem.dayId === day.id)}
                onClick={() => setSelectedDayId(day.id)}
              >
                <TabText>
                  {dayTitle(day, plan.schedule, t)}
                  {plan.schedule.type !== 'rotation' && day.weekday && day.name && (
                    <>
                      {' '}
                      <TabName>{day.name}</TabName>
                    </>
                  )}
                </TabText>{' '}
                <TabCount>{day.entries.length}</TabCount>
              </DayTab>
            ))}
            <AddDay
              type="button"
              aria-label={t('planEditor.addDay')}
              title={t('planEditor.addDay')}
              onClick={handleAddDay}
            >
              <BiPlus aria-hidden="true" />
            </AddDay>
          </DayTabs>
          {selectedDay ? (
            <DayEditor
              key={selectedDay.id}
              plan={plan}
              day={selectedDay}
              problems={problems}
              edit={edit}
              onSelectDay={setSelectedDayId}
            />
          ) : (
            <Muted>{t('planEditor.noDays')}</Muted>
          )}
        </FormCard>
      </MainArea>

      <FooterArea>
        {problems.length > 0 && (
          <Problems ref={problemsRef} tabIndex={-1} role="alert" aria-labelledby="planProblemsTitle">
            <ProblemsTitle id="planProblemsTitle">{t('planEditor.problemsTitle')}</ProblemsTitle>
            <ul>
              {problems.map((problem, index) => (
                <li key={index}>{problemText(problem)}</li>
              ))}
            </ul>
          </Problems>
        )}
      </FooterArea>

      <AsideArea aria-label={t('planEditor.analysis.label')}>
        <PlanAnalysis plan={plan} day={selectedDay} />
      </AsideArea>
    </Layout>
  );
}

// A bar with back, undo and save stays at the top; plan, problems and the muscle
// analysis follow, the analysis always at the very bottom.
const TopBar = styled.div`
  grid-area: top;
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: ${space.xs};
  margin: calc(-1 * ${space.xl}) calc(-1 * ${space.lg}) 0;
  padding: ${space.sm} ${space.lg};
  background-color: ${colors.background};
  border-bottom: 1px solid ${colors.surfaceMuted};
  button:disabled {
    opacity: 0.4;
  }
`;

const TopTitle = styled.h1`
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  font-size: ${fontSizes.lead};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LeavePanel = styled.div`
  grid-area: leave;
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border: 2px solid ${colors.primary};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: 'top' 'leave' 'main' 'footer' 'aside';
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xl};
`;

const MainArea = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: ${space.xl};
  min-width: 0;
`;

const AsideArea = styled.aside`
  grid-area: aside;
  min-width: 0;
`;

const FooterArea = styled.div`
  grid-area: footer;
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
`;

const SectionTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

const Notice = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.highlight};
`;

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  min-width: 0;
  border: none;
`;

const Legend = styled.legend`
  margin-bottom: ${space.xs};
  font-weight: ${fontWeights.medium};
`;

// Two choices side by side; the real radio buttons stay for keyboard and screen readers.
const Segments = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  overflow: hidden;
`;

const Segment = styled.label`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${sizes.touchTarget};
  padding: ${space.xs} ${space.sm};
  background-color: ${colors.surface};
  text-align: center;
  cursor: pointer;
  & + & {
    border-left: 1px solid ${colors.border};
  }
  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    cursor: pointer;
  }
  &:has(input:checked) {
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
  &:has(input:focus-visible) {
    outline: 3px solid ${colors.focus};
    outline-offset: -3px;
  }
`;

const Muted = styled.span`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

// One row that scrolls sideways on phones; the padding keeps focus rings visible.
const Dates = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.sm};
`;

const HeaderCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: end;
  gap: ${space.sm};
`;

const NameField = styled(Field)`
  flex: 1 1 auto;
  min-width: 0;
`;

const SmallLabel = styled(Label)`
  font-size: ${fontSizes.caption};
`;

const DetailsToggle = styled.button`
  display: inline-flex;
  flex: 0 1 auto;
  align-items: center;
  gap: ${space.xs};
  min-width: ${sizes.touchTarget};
  max-width: 45%;
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.sm};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
  &[aria-expanded='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.highlight};
  }
`;

const ToggleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const DetailsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding-top: ${space.sm};
  border-top: 1px solid ${colors.surfaceMuted};
`;

const DayTabs = styled.div`
  display: flex;
  gap: ${space.sm};
  margin: calc(-1 * ${space.sm});
  padding: ${space.sm};
  overflow-x: auto;
  & > * {
    flex-shrink: 0;
  }
`;

const DayTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${props => (props.$hasProblem ? colors.error : colors.border)};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const AddDay = styled(DayTab)`
  justify-content: center;
  min-width: ${sizes.touchTarget};
  padding: 0;
  font-size: 1.25rem;
`;

const TabText = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
`;

const TabName = styled.span`
  max-width: 9rem;
  overflow: hidden;
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.regular};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TabCount = styled.span`
  min-width: 1.5rem;
  padding: 0 ${space.xs};
  border-radius: ${radii.pill};
  background-color: ${colors.surfaceMuted};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  text-align: center;
`;

const Problems = styled.div`
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
  color: ${colors.error};
  ul {
    padding-left: ${space.lg};
  }
`;

const ProblemsTitle = styled.h2`
  font-size: ${fontSizes.body};
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;
