import { useState } from 'react';
import styled from 'styled-components';
import { BiBody, BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import Button from '../ui/Button';
import { MUSCLES } from '../../data/muscles';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
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
import { GUIDELINE_SETS, analyzePlan } from '../../utils/planAnalysis';
import { dayTitle } from '../../utils/workoutPlan';

// More hints at once are hard to take in; the rest is one tap away.
const VISIBLE_HINTS = 3;

// The analysis below the plan editor, for the chosen day or the whole plan: which
// muscles are trained, a chart of the sets per muscle group, and (for the whole
// plan) hints on gaps and imbalances.
export default function PlanAnalysis({ plan, day }) {
  const { t, language } = useTranslation();
  const [showAllMuscles, setShowAllMuscles] = useState(false);
  const [showAllHints, setShowAllHints] = useState(false);
  const [scope, setScope] = useState('day');
  const isDay = Boolean(day) && scope === 'day';
  const scopeName = isDay ? dayTitle(day, plan.schedule, t) : t('planEditor.analysis.wholePlan');
  const { groups, muscles } = analyzePlan(isDay ? { ...plan, days: [day] } : plan);
  // Gaps and imbalances only make sense for the whole week.
  const planHints = analyzePlan(plan).hints;
  const hints = isDay ? [] : planHints;
  const format = value => value.toLocaleString(language, { maximumFractionDigits: 1 });
  const muscleName = id => MUSCLES[id]?.[language] ?? MUSCLES[id]?.en ?? id;
  const hintedMuscles = new Set(hints.flatMap(hint => hint.muscles));
  const setsOf = group => groups.find(item => item.muscle === group)?.sets ?? 0;
  const chartGroups = [...MUSCLE_GROUP_NAMES, ...(setsOf('other') ? ['other'] : [])];
  const scaleMax = Math.max(GUIDELINE_SETS * 1.5, ...groups.map(item => item.sets));

  function hintText(hint) {
    const group = hint.group && t(`muscle.${hint.group}`);
    if (hint.type === 'imbalance') {
      const sides = [t(`planEditor.analysis.pairs.${hint.pair}.0`), t(`planEditor.analysis.pairs.${hint.pair}.1`)];
      const weak = hint.weakSide;
      return t('planEditor.analysis.hints.imbalance', {
        weak: sides[weak],
        strong: sides[1 - weak],
        weakSets: format(hint.sets[weak]),
        strongSets: format(hint.sets[1 - weak]),
      });
    }
    return t(`planEditor.analysis.hints.${hint.type}`, {
      group,
      sets: format(hint.sets ?? 0),
      guideline: GUIDELINE_SETS,
      muscles: hint.muscles.map(muscleName).join(', '),
    });
  }

  return (
    <Wrapper>
      <ScopeHeader>
        <Heading>{t('planEditor.analysis.title')}</Heading>
        {day && (
          <Scope role="group" aria-label={t('planEditor.analysis.scope')}>
            <ScopeButton type="button" aria-pressed={isDay} onClick={() => setScope('day')}>
              {dayTitle(day, plan.schedule, t)}
            </ScopeButton>
            <ScopeButton type="button" aria-pressed={!isDay} onClick={() => setScope('plan')}>
              {t('planEditor.analysis.wholePlan')}
            </ScopeButton>
          </Scope>
        )}
      </ScopeHeader>

      <Card aria-labelledby="analysisMusclesTitle">
        <Title id="analysisMusclesTitle">{t('planEditor.analysis.musclesTitle', { scope: scopeName })}</Title>
        {/* The muscle figure comes from the graphics package once its masks are released. */}
        <Figure role="img" aria-label={t('planEditor.analysis.figureMissing')}>
          <BiBody aria-hidden="true" />
          <span>{t('planEditor.analysis.figureMissing')}</span>
        </Figure>
        <Muted>{t('planEditor.analysis.legend')}</Muted>
        {MUSCLE_GROUP_NAMES.map(group => {
          // By default only trained muscles and muscles with a hint, so the list stays short on phones.
          const shown = muscles.filter(
            muscle =>
              muscle.group === group && (showAllMuscles || muscle.sets > 0 || hintedMuscles.has(muscle.id))
          );
          if (shown.length === 0) return null;
          return (
            <MuscleGroup key={group}>
              <h4>{t(`muscle.${group}`)}</h4>
              <MuscleList>
                {shown.map(muscle => (
                  <MuscleRow key={muscle.id} $isHinted={hintedMuscles.has(muscle.id)} $isTrained={muscle.sets > 0}>
                    <dt>
                      {muscleName(muscle.id)}
                      {muscle.isDeep && <DeepTag> · {t('planEditor.analysis.deep')}</DeepTag>}
                    </dt>
                    <dd>
                      {muscle.sets > 0
                        ? t(muscle.sets === 1 ? 'planEditor.analysis.setsValueOne' : 'planEditor.analysis.setsValue', { count: format(muscle.sets) })
                        : t('planEditor.analysis.untrained')}
                    </dd>
                  </MuscleRow>
                ))}
              </MuscleList>
            </MuscleGroup>
          );
        })}
        <div>
          <Button
            $variant="secondary"
            aria-expanded={showAllMuscles}
            onClick={() => setShowAllMuscles(!showAllMuscles)}
          >
            {t(showAllMuscles ? 'planEditor.analysis.showFewer' : 'planEditor.analysis.showAll', {
              count: muscles.length,
            })}
          </Button>
        </div>
      </Card>

      <Card aria-labelledby="analysisChartTitle">
        <Title id="analysisChartTitle">{t('planEditor.analysis.chartTitle', { scope: scopeName })}</Title>
        <Muted>
          {isDay
            ? t('planEditor.analysis.chartTextDay')
            : t('planEditor.analysis.chartText', { guideline: GUIDELINE_SETS })}
        </Muted>
        <Chart>
          {chartGroups.map(group => {
            const sets = setsOf(group);
            return (
              <Bar key={group}>
                <dt>{t(`muscle.${group}`)}</dt>
                <dd>
                  <Track aria-hidden="true">
                    <Fill style={{ width: `${(sets / scaleMax) * 100}%` }} />
                    {/* The guideline is per week, so it only belongs to the whole plan. */}
                    {!isDay && <Guideline style={{ left: `${(GUIDELINE_SETS / scaleMax) * 100}%` }} />}
                  </Track>
                  <Value>{t(sets === 1 ? 'planEditor.analysis.setsValueOne' : 'planEditor.analysis.setsValue', { count: format(sets) })}</Value>
                </dd>
              </Bar>
            );
          })}
        </Chart>
        <Muted>{t('stats.planEditor.groupLegend')}</Muted>
      </Card>

      {isDay ? (
        <Muted>{t('planEditor.analysis.hintsOnPlan', { count: planHints.length })}</Muted>
      ) : (
        <Card aria-labelledby="analysisHintsTitle">
          <Title id="analysisHintsTitle">{t('planEditor.analysis.hintsTitle')}</Title>
          {hints.length === 0 ? (
            <Good>
              <BiCheckCircle aria-hidden="true" />
              {t(plan.days.some(day => day.entries.length) ? 'planEditor.analysis.noHints' : 'planEditor.analysis.empty')}
            </Good>
          ) : (
            <HintList>
              {(showAllHints ? hints : hints.slice(0, VISIBLE_HINTS)).map((hint, index) => (
                <li key={index}>
                  <BiErrorCircle aria-hidden="true" />
                  <span>{hintText(hint)}</span>
                </li>
              ))}
            </HintList>
          )}
          {hints.length > VISIBLE_HINTS && (
            <div>
              <Button
                $variant="secondary"
                aria-expanded={showAllHints}
                onClick={() => setShowAllHints(!showAllHints)}
              >
                {t(showAllHints ? 'planEditor.analysis.fewerHints' : 'planEditor.analysis.allHints', {
                  count: hints.length,
                })}
              </Button>
            </div>
          )}
          <Muted>{t('planEditor.analysis.hintsNote')}</Muted>
        </Card>
      )}
    </Wrapper>
  );
}

const ScopeHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.sm};
`;

const Heading = styled.h2`
  font-size: ${fontSizes.section};
`;

const Scope = styled.div`
  display: flex;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  overflow: hidden;
`;

const ScopeButton = styled.button`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: none;
  background-color: ${colors.surface};
  & + & {
    border-left: 1px solid ${colors.border};
  }
  &[aria-pressed='true'] {
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.lg};
  min-width: 0;
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  min-width: 0;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Title = styled.h3`
  font-size: ${fontSizes.lead};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Chart = styled.dl`
  display: grid;
  gap: ${space.sm};
`;

const Bar = styled.div`
  display: grid;
  grid-template-columns: minmax(5rem, 7rem) minmax(0, 1fr);
  align-items: center;
  gap: ${space.sm};
  dd {
    display: flex;
    align-items: center;
    gap: ${space.sm};
    min-width: 0;
  }
`;

const Track = styled.div`
  position: relative;
  flex: 1 1 auto;
  height: 12px;
`;

// One series, one color; the value stays in text color next to the bar.
const Fill = styled.div`
  height: 100%;
  border-radius: 0 4px 4px 0;
  background-color: ${colors.primary};
`;

const Guideline = styled.div`
  position: absolute;
  top: -4px;
  bottom: -4px;
  border-left: 2px dashed ${colors.textMuted};
`;

const Value = styled.span`
  flex-shrink: 0;
  min-width: 3.5rem;
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const Good = styled.p`
  display: flex;
  align-items: center;
  gap: ${space.sm};
`;

const HintList = styled.ul`
  display: grid;
  gap: ${space.sm};
  list-style: none;
  li {
    display: flex;
    align-items: flex-start;
    gap: ${space.sm};
    padding: ${space.sm};
    border-radius: ${radii.small};
    background-color: ${colors.errorSurface};
  }
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: ${colors.error};
  }
`;

const Figure = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${space.sm};
  min-height: 10rem;
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
  text-align: center;
  svg {
    font-size: 3rem;
  }
`;

const MuscleGroup = styled.div`
  h4 {
    margin-bottom: ${space.xs};
    font-size: ${fontSizes.body};
  }
`;

const MuscleList = styled.dl`
  display: grid;
`;

const DeepTag = styled.span`
  color: ${colors.textMuted};
`;

const MuscleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${space.md};
  padding: ${space.xs} ${space.sm};
  border-left: 4px solid ${props => (props.$isHinted ? colors.error : props.$isTrained ? colors.primary : 'transparent')};
  font-size: ${fontSizes.caption};
  dd {
    color: ${props => (props.$isTrained ? colors.text : colors.textMuted)};
    font-variant-numeric: tabular-nums;
    font-weight: ${props => (props.$isTrained ? fontWeights.medium : fontWeights.regular)};
  }
`;
