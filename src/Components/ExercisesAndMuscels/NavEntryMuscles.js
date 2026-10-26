import styled from 'styled-components';
import { BiArrowBack } from 'react-icons/bi';
import { MUSCLE_GROUP_NAMES } from '../../api/wger';
import { useTranslation } from '../../i18n/LanguageContext';
import muscleIcons from './muscleIcons';

export default function NavEntryMuscels({ handleActiveMuscle, activeMuscle }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Button
        aria-label={t('exercises.back')}
        onClick={() => handleActiveMuscle(null)}
      >
        <BiArrowBack size={30} />
      </Button>
      {MUSCLE_GROUP_NAMES.map(muscle => (
        <Button
          key={muscle}
          aria-label={t(`muscle.${muscle}`)}
          aria-pressed={activeMuscle === muscle}
          isActive={activeMuscle === muscle}
          onClick={() => handleActiveMuscle(muscle)}
        >
          <img src={muscleIcons[muscle]} alt="" width="30" />
        </Button>
      ))}
    </Box>
  );
}

const Button = styled.button`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isActive ? '#d5dee8' : 'transparent')};
  border-radius: 15px;
  border: none;
  outline: none;
  color: #283a45;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
`;

const Box = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  margin: 5px;
  background-color: #496b73;
`;
