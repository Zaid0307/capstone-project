import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useTranslation();
  const nextLanguage = language === 'de' ? 'en' : 'de';

  return (
    <Button
      type="button"
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
  width: 48px;
  margin: 5px;
  border: 1px solid ${colors.surface};
  border-radius: 15px;
  background-color: transparent;
  color: ${colors.surface};
  font-weight: bold;
`;
