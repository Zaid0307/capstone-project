import styled from 'styled-components';
import { MUSCLE_GROUP_NAMES } from '../../api/wger';
import { useTranslation } from '../../i18n/LanguageContext';
import muscleIcons from './muscleIcons';

export default function EntryMuscels({ handleActiveMuscle }) {
  const { t } = useTranslation();

  return (
    <Background>
      <StyledGrid>
        {MUSCLE_GROUP_NAMES.map(muscle => (
          <Button key={muscle} onClick={() => handleActiveMuscle(muscle)}>
            <img src={muscleIcons[muscle]} alt="" width="80" />
            {t(`muscle.${muscle}`)}
          </Button>
        ))}
      </StyledGrid>
    </Background>
  );
}

const Background = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
`;

const Button = styled.button`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: none;
  outline: none;
  justify-content: center;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  border-radius: 15px;
  padding: 5px;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;
