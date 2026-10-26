import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import img from '../assets/fitness.png';
import Button from '../components/ui/Button';
import LanguageSwitch from '../components/navigation/LanguageSwitch';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BackgroundImg>
      <SwitchBox>
        <LanguageSwitch />
      </SwitchBox>
      <Title>{t('landing.title')}</Title>
      <StartButton onClick={() => navigate(routes.exercises)}>
        {t('landing.start')}
      </StartButton>
    </BackgroundImg>
  );
}

const BackgroundImg = styled.main`
  position: relative;
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const SwitchBox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 40px;
  display: flex;
`;

const Title = styled.h1`
  text-align: center;
  color: white;
`;

const StartButton = styled(Button)`
  width: 150px;
`;
