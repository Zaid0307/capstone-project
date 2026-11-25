import styled from 'styled-components';
import { EQUIPMENT } from '../../data/equipment';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { setPlanPlace, togglePlanEquipment } from '../../utils/planEditing';
import { ALWAYS_AVAILABLE_EQUIPMENT, PLACES } from '../../utils/workoutPlan';

// Equipment kinds in the order a home user thinks of them.
const KINDS = [
  'free_weight',
  'band',
  'bodyweight_aid',
  'bench_rack',
  'cardio_machine',
  'combat',
  'mobility_aid',
  'machine',
  'surface',
];

// Where a plan is trained (gym, home, mixed) and, outside the gym, which
// equipment is there. The exercise selection of the plan shows only exercises
// that fit (see ExercisePicker, availableEquipment).
export default function PlanSetupFields({ plan, edit }) {
  const { t, language } = useTranslation();
  const place = plan.setup?.place ?? null;
  const equipment = plan.setup?.equipment ?? [];
  const name = item => EQUIPMENT[item][language] ?? EQUIPMENT[item].en;
  const groups = KINDS.map(kind => ({
    kind,
    items: Object.keys(EQUIPMENT)
      .filter(item => EQUIPMENT[item].kind === kind && !ALWAYS_AVAILABLE_EQUIPMENT.includes(item))
      .sort((a, b) => name(a).localeCompare(name(b), language)),
  })).filter(group => group.items.length > 0);

  return (
    <Fieldset aria-describedby="planSetupHint">
      <Legend>{t('planEditor.setup.place')}</Legend>
      <Segments>
        {PLACES.map(value => (
          <Segment key={value}>
            <input
              type="radio"
              name="planPlace"
              value={value}
              checked={place === value}
              onChange={() => edit(current => setPlanPlace(current, value))}
            />
            <span>{t(`planEditor.setup.places.${value}`)}</span>
          </Segment>
        ))}
      </Segments>
      {place === 'gym' && <Muted id="planSetupHint">{t('planEditor.setup.gymHint')}</Muted>}
      {(place === 'home' || place === 'mixed') && (
        <>
          <Muted id="planSetupHint">{t('planEditor.setup.equipmentHint')}</Muted>
          <Details>
            <Summary>{t('planEditor.setup.equipmentCount', { count: equipment.length })}</Summary>
            {groups.map(group => (
              <Group key={group.kind}>
                <legend>{t(`planEditor.setup.kinds.${group.kind}`)}</legend>
                <Items>
                  {group.items.map(item => (
                    <Check key={item}>
                      <input
                        type="checkbox"
                        checked={equipment.includes(item)}
                        onChange={() => edit(current => togglePlanEquipment(current, item))}
                      />
                      <span>{name(item)}</span>
                    </Check>
                  ))}
                </Items>
              </Group>
            ))}
          </Details>
        </>
      )}
    </Fieldset>
  );
}

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

// Three choices side by side; the real radio buttons stay for keyboard and screen readers.
const Segments = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  overflow-wrap: anywhere;
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

const Details = styled.details`
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  padding: 0 ${space.md};
`;

const Summary = styled.summary`
  display: flex;
  align-items: center;
  min-height: ${sizes.touchTarget};
  font-weight: ${fontWeights.medium};
  cursor: pointer;
`;

const Group = styled.fieldset`
  margin-bottom: ${space.md};
  border: none;
  legend {
    margin-bottom: ${space.xs};
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(11rem, 100%), 1fr));
`;

const Check = styled.label`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  cursor: pointer;
  input {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }
`;
