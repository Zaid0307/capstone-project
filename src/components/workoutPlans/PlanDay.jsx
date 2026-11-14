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
} from '../../utils/workoutPlan';

// One training day of a saved plan: title, name and, when opened, its exercises in order.
export default function PlanDay({ day, schedule }) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const title = dayTitle(day, schedule, t);
  const subtitle = schedule.type !== 'rotation' && day.weekday ? day.name : '';

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
            {day.entries.map(entry => {
              const rir = entry.sets.find(set => set.rirTarget !== null)?.rirTarget;
              return (
                <Entry key={entry.id}>
                  <Name>{entryName(entry, language)}</Name>
                  <Muted>
                    {muscleLabel(entry.muscle, t)} · {summarizeSets(entry.sets, language)}
                  </Muted>
                  {(entry.restSeconds !== null || rir !== undefined) && (
                    <Muted>
                      {[
                        entry.restSeconds !== null &&
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

const Entry = styled.li`
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
`;

const Name = styled.p`
  font-weight: ${fontWeights.medium};
`;
