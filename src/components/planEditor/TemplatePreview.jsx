import styled from 'styled-components';
import PlanAnalysis from './PlanAnalysis';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayTitle, entryName, orderedDays, summarizeSets } from '../../utils/workoutPlan';

// Read-only look at a template before taking it over: its training days with
// their exercises and the muscle load of the whole week. `plan` is the template
// already copied with templateToPlan, so the preview shows exactly what the user gets.
export default function TemplatePreview({ id, name, plan }) {
  const { t, language } = useTranslation();

  return (
    <Preview id={id} aria-label={t('planTemplates.preview.label', { name })}>
      <Title>{t('planTemplates.preview.days')}</Title>
      <DayList>
        {orderedDays(plan).map(day => {
          const title = dayTitle(day, plan.schedule, t);
          return (
            <Day key={day.id}>
              <DayTitle>
                {title}
                {day.name && day.name !== title && <Muted as="span"> · {day.name}</Muted>}
              </DayTitle>
              <EntryList aria-label={t('planEditor.day.exercisesOf', { name: title })}>
                {day.entries.map(entry => (
                  <li key={entry.id}>
                    <span>{entryName(entry, language)}</span>
                    <Muted as="span">{summarizeSets(entry.sets, language)}</Muted>
                  </li>
                ))}
              </EntryList>
            </Day>
          );
        })}
      </DayList>
      <PlanAnalysis plan={plan} />
    </Preview>
  );
}

const Preview = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
  padding-top: ${space.md};
  border-top: 1px solid ${colors.border};
`;

const Title = styled.h5`
  font-size: ${fontSizes.body};
`;

const DayList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.sm};
  list-style: none;
`;

const Day = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
`;

const DayTitle = styled.h6`
  font-size: ${fontSizes.body};
  font-weight: ${fontWeights.medium};
`;

const EntryList = styled.ol`
  display: grid;
  gap: ${space.xs};
  padding-left: ${space.lg};
  li {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0 ${space.sm};
    overflow-wrap: anywhere;
  }
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;
