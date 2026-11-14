import { useState } from 'react';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import { FormCard } from '../components/planEditor/formStyles';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import { clearTrainingData, downloadExport } from '../utils/dataExport';
import { Link } from 'react-router-dom';
import { routes } from '../routes';
import { useAuth } from '../auth/AuthContext';
import useFigure, { FIGURES } from '../hooks/useFigure';
import { colors, fontSizes, fontWeights, radii, sizes, space } from '../styles/tokens';
import { LANGUAGES } from '../i18n/translations';
import { useTranslation } from '../i18n/LanguageContext';

// Language, figure (male/female), the user's data and, later, the dark mode.
// onDataCleared runs after the training data was deleted (the app reloads it).
export default function SettingsPage({ onDataCleared = () => window.location.assign('/') }) {
  const { t, language, setLanguage } = useTranslation();
  const [figure, setFigure] = useFigure();
  const [isConfirming, setIsConfirming] = useState(false);
  const { user } = useAuth();

  return (
    <PageLayout>
      <PageTitle>{t('settings.title')}</PageTitle>

      <FormCard>
        <Fieldset>
          <Legend>{t('settings.language')}</Legend>
          <Choices>
            {LANGUAGES.map(code => (
              <Choice key={code}>
                <input
                  type="radio"
                  name="language"
                  value={code}
                  checked={language === code}
                  onChange={() => setLanguage(code)}
                />
                <span lang={code}>{t(`settings.languages.${code}`)}</span>
              </Choice>
            ))}
          </Choices>
        </Fieldset>
      </FormCard>

      <FormCard>
        <Fieldset aria-describedby="figureHint">
          <Legend>{t('settings.figure')}</Legend>
          <Choices>
            {FIGURES.map(value => (
              <Choice key={value}>
                <input
                  type="radio"
                  name="figure"
                  value={value}
                  checked={figure === value}
                  onChange={() => setFigure(value)}
                />
                <span>{t(`settings.figures.${value}`)}</span>
              </Choice>
            ))}
          </Choices>
          <Muted id="figureHint">{t('settings.figureHint')}</Muted>
        </Fieldset>
      </FormCard>

      <FormCard aria-labelledby="accountTitle">
        <Legend as="h2" id="accountTitle">
          {t('account.title')}
        </Legend>
        {user && <Muted>{t('account.signedInAs', { email: user.email })}</Muted>}
        <Link to={routes.account}>{t('account.settingsLink')}</Link>
        <Link to={routes.privacy}>{t('privacy.title')}</Link>
      </FormCard>

      <FormCard aria-labelledby="dataTitle">
        <Legend as="h2" id="dataTitle">
          {t('settings.data.title')}
        </Legend>
        <Muted>{t('settings.data.text')}</Muted>
        <Actions>
          <Button $variant="secondary" onClick={() => downloadExport()}>
            {t('settings.data.export')}
          </Button>
          {!isConfirming && (
            <Button $variant="secondary" onClick={() => setIsConfirming(true)}>
              {t('settings.data.delete')}
            </Button>
          )}
        </Actions>
        {isConfirming && (
          <Confirm role="alertdialog" aria-labelledby="deleteTitle" aria-describedby="deleteText">
            <p id="deleteTitle">
              <strong>{t('settings.data.confirmTitle')}</strong>
            </p>
            <p id="deleteText">{t('settings.data.confirmText')}</p>
            <Actions>
              <Button
                onClick={() => {
                  clearTrainingData();
                  onDataCleared();
                }}
              >
                {t('settings.data.confirmDelete')}
              </Button>
              <Button $variant="secondary" onClick={() => setIsConfirming(false)}>
                {t('settings.data.keep')}
              </Button>
            </Actions>
          </Confirm>
        )}
      </FormCard>

      <FormCard>
        <Legend as="h2">{t('settings.darkMode')}</Legend>
        <Muted>{t('settings.darkModeLater')}</Muted>
      </FormCard>
    </PageLayout>
  );
}

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  min-width: 0;
  border: none;
`;

const Legend = styled.legend`
  margin-bottom: ${space.sm};
  font-size: ${fontSizes.lead};
  font-weight: ${fontWeights.bold};
`;

const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
  gap: ${space.sm};
`;

const Choice = styled.label`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  cursor: pointer;
  input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: ${colors.primary};
  }
  &:has(input:checked) {
    border-color: ${colors.primary};
    background-color: ${colors.highlight};
    font-weight: ${fontWeights.medium};
  }
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const Confirm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border: 2px solid ${colors.error};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
`;
