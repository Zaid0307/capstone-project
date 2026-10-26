import img from '../Img/fitness.png';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import LanguageSwitch from '../Nav/LanguageSwitch';

export default function LandingPage({ handleLandingpage }) {
  const { t } = useTranslation();

  return (
    <BackgroundImg>
      <SwitchBox>
        <LanguageSwitch />
      </SwitchBox>
      <TextContent>{t('landing.title')}</TextContent>

      <Button onClick={handleLandingpage}>{t('landing.start')}</Button>
    </BackgroundImg>
  );
}

const BackgroundImg = styled.div`
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

const TextContent = styled.h1`
  text-align: center;
  color: white;
`;

const Button = styled.button`
  display: inline-flex;
  border: none;
  outline: none;
  border-radius: 5px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px;
  justify-content: center;
  width: 150px;
  background-color: #283a45;
  color: #d5dee8;
`;
