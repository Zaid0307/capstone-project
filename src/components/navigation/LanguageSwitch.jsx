import styled from 'styled-components';
import {
  colors,
  fontSizes,
  fontWeights,
  motion,
  radii,
  sizes,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

export default function LanguageSwitch({ className }) {
  const { language, setLanguage, t } = useTranslation();
  const nextLanguage = language === 'de' ? 'en' : 'de';

  return (
    <Button
      type="button"
      className={className}
      lang={nextLanguage}
      aria-label={t('language.switchLabel')}
      onClick={() => setLanguage(nextLanguage)}
    >
      {nextLanguage.toUpperCase()}
    </Button>
  );
}

const Button = styled.button`
  flex-shrink: 0;
  min-width: ${sizes.touchTarget};
  min-height: ${sizes.touchTarget};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: transparent;
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  font-weight: ${fontWeights.bold};
  transition: background-color ${motion.fast};
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
  &:active {
    background-color: ${colors.highlight};
  }
`;
