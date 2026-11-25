import { useState } from 'react';
import styled from 'styled-components';
import ItemHeader from '../ui/ItemHeader';
import ToggleButton from '../ui/ToggleButton';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  dayTitle,
  entryName,
  muscleLabel,
  summarizeSets,
  supersetLabels,
} from '../../utils/workoutPlan';

// One training day of a saved plan: title, name and, when opened, its exercises in order.
// `defaultExpanded` opens it from the start (plan view).
export default function PlanDay({ day, schedule, defaultExpanded = false }) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const title = dayTitle(day, schedule, t);
  const subtitle = schedule.type !== 'rotation' && day.weekday ? day.name : '';
  const supersets = supersetLabels(day.entries);

  return (
    <Card>
      <ItemHeader
        title={
          <>
            <Title>{title}</Title>
            {subtitle && <Muted>{subtitle}</Muted>}
          </>
        }
        actions={
          <ToggleButton
            name={title}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
          />
        }
      />
      {isExpanded && (
        <>
          {day.note && <Muted>{day.note}</Muted>}
          <EntryList aria-label={t('planEditor.day.exercisesOf', { name: title })}>
            {day.entries.map((entry, index) => {
              const rir = entry.sets.find(set => set.rirTarget !== null)?.rirTarget;
              const superset = supersets[index];
              const goesStraightOn = superset && superset.position < superset.size - 1;
              return (
                <Entry key={entry.id} $superset={superset}>
                  <Name>
                    {superset && (
                      <SupersetTag aria-label={t('planEditor.superset.label', { group: superset.group })}>
                        {superset.label}
                      </SupersetTag>
                    )}
                    {entryName(entry, language)}
                  </Name>
                  <Muted>
                    {muscleLabel(entry.muscle, t)} · {summarizeSets(entry.sets, language)}
                  </Muted>
                  {(entry.restSeconds !== null || rir !== undefined || goesStraightOn) && (
                    <Muted>
                      {[
                        goesStraightOn
                          ? t('planEditor.superset.straightOn')
                          : entry.restSeconds !== null &&
                            t('planEditor.entry.restShort', { seconds: entry.restSeconds }),
                        rir !== undefined && `${t('exercise.rir')} ${rir}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Muted>
                  )}
                  {entry.note && <p>{entry.note}</p>}
                </Entry>
              );
            })}
          </EntryList>
        </>
      )}
    </Card>
  );
}

// Levels differ by surface tone and heading, not by more indentation.
const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
`;

const Title = styled.h3`
  font-size: ${fontSizes.lead};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const EntryList = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.xs};
  padding-left: ${space.lg};
`;

// Exercises of a superset share a bracket on the left.
const Entry = styled.li`
  padding: ${space.sm} ${space.md};
  border-left: ${props => (props.$superset ? `4px solid ${colors.primary}` : 'none')};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const SupersetTag = styled.span`
  display: inline-block;
  margin-right: ${space.xs};
  padding: 0 ${space.xs};
  border-radius: ${radii.small};
  background-color: ${colors.primary};
  color: ${colors.onPrimary};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
`;

const Name = styled.p`
  font-weight: ${fontWeights.medium};
`;
