import styled from 'styled-components';
import { colors, fontSizes, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

// Hints a plan keeps from its template (see templateToPlan). Missing values
// leave out their section; plans without a template show nothing.

export function SafetyHint({ hints }) {
  const { t } = useTranslation();
  if (!hints?.safety && !hints?.medicalClearance) {
    return null;
  }
  return (
    <Safety>
      <Heading>{t('plans.hints.safety')}</Heading>
      {hints.safety && <p>{hints.safety}</p>}
      {hints.medicalClearance && <p>{t('plans.hints.medicalClearance')}</p>}
    </Safety>
  );
}

export default function PlanHints({ hints }) {
  const { t } = useTranslation();
  if (!hints?.progression && !hints?.repsInReserve && !hints?.recovery) {
    return null;
  }
  return (
    <>
      {(hints.progression || hints.repsInReserve) && (
        <Section>
          <Heading>{t('plans.hints.progression')}</Heading>
          {hints.progression && <p>{hints.progression}</p>}
          {hints.repsInReserve && (
            <p>
              {t('exercise.rir')} {hints.repsInReserve}
            </p>
          )}
        </Section>
      )}
      {hints.recovery && (
        <Section>
          <Heading>{t('plans.hints.recovery')}</Heading>
          <p>{hints.recovery}</p>
        </Section>
      )}
    </>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
`;

const Safety = styled(Section)`
  padding: ${space.md};
  border-left: 4px solid ${colors.primary};
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
`;

const Heading = styled.h3`
  font-size: ${fontSizes.body};
`;
