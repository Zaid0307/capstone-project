import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import img from '../assets/fitness.png';
import Button from '../components/ui/Button';
import LanguageSwitch from '../components/navigation/LanguageSwitch';
import { colors, fontSizes, radii, shadows, space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Page>
      <SwitchBox>
        <LanguageSwitch />
      </SwitchBox>
      <Panel>
        <Title>{t('landing.title')}</Title>
        <Button onClick={() => navigate(routes.exercises)}>{t('landing.start')}</Button>
      </Panel>
    </Page>
  );
}

// The photo is only decoration; all text sits on an opaque panel.
const Page = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: ${space.lg};
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${space.lg} ${space.lg} calc(${space.xxl} + env(safe-area-inset-bottom, 0px));
  background: ${colors.dark} url(${img}) center / cover no-repeat;
`;

const SwitchBox = styled.div`
  align-self: flex-end;
  margin-bottom: auto;
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${space.lg};
  width: 100%;
  max-width: 28rem;
  padding: ${space.xl} ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${fontSizes.hero};
`;
