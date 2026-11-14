import styled from 'styled-components';
import { BiErrorCircle } from 'react-icons/bi';
import { colors, fontWeights, radii, shadows, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

// Shown on every page when a plan or a training could not be saved, e.g.
// because the browser storage is full or blocked. Nothing is lost silently.
export default function SaveError() {
  const { t } = useTranslation();
  return (
    <Banner role="alert">
      <BiErrorCircle aria-hidden="true" />
      <p>
        <strong>{t('saveError.title')}</strong> {t('saveError.text')}
      </p>
    </Banner>
  );
}

const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  margin: ${space.sm};
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
  color: ${colors.error};
  box-shadow: ${shadows.card};
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
  strong {
    font-weight: ${fontWeights.bold};
  }
`;
