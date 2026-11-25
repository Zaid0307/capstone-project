import styled from 'styled-components';
import { MdEdit } from 'react-icons/md';
import { colors, fontSizes, fontWeights, radii, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

const timeOf = (iso, language) =>
  new Date(iso).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });

// Marks a finished training that is opened again (docs/ux/02-tagebuch.md, 3.5):
// changes are saved right away, start and end time stay as they were.
export default function EditModeBanner({ workout }) {
  const { t, language } = useTranslation();
  const dateLabel = new Date(`${workout.date}T12:00:00`).toLocaleDateString(language, {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  });
  const times =
    workout.startedAt && workout.finishedAt
      ? ` · ${timeOf(workout.startedAt, language)}–${timeOf(workout.finishedAt, language)}`
      : '';
  const changed = new Date(workout.updatedAt).toLocaleString(language, {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Banner aria-labelledby="editModeTitle">
      <MdEdit aria-hidden="true" />
      <div>
        <Title id="editModeTitle">{t('workout.edit.title')}</Title>
        <p>{t('workout.edit.of', { date: `${dateLabel}${times}` })}</p>
        <Small>{t('workout.edit.hint')}</Small>
        <Small>{t('workout.edit.changed', { time: changed })}</Small>
      </div>
    </Banner>
  );
}

const Banner = styled.section`
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  padding: ${space.md};
  border: 2px solid ${colors.primary};
  border-radius: ${radii.large};
  background-color: ${colors.highlight};
  overflow-wrap: anywhere;
  & > svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${colors.primary};
    font-size: 1.25rem;
  }
`;

const Title = styled.h2`
  font-size: ${fontSizes.lead};
  font-weight: ${fontWeights.bold};
`;

const Small = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
