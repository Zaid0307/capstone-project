import SpaceBetween from '../Styles/SpaceBetween';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';

export default function WorkoutplanExersice({ muscle }) {
  const { t } = useTranslation();

  return (
    <>
      {(muscle.exercises ?? []).map((info, index) => (
        <StyledTest key={info.id ?? `info${index}`}>
          <SpaceBetween>
            <p>{t('exercise.exercise')}</p>
            <p>{info.exercise}</p>
          </SpaceBetween>
          <SpaceBetween>
            <p>{t('exercise.weight')}</p>
            <p>{info.weight} kg</p>
          </SpaceBetween>
          <SpaceBetween>
            <p>{t('exercise.repetitions')}</p>
            <p>{info.repetitions}</p>
          </SpaceBetween>
          <SpaceBetween>
            <p>{t('exercise.sets')}</p>
            <p>{info.sets}</p>
          </SpaceBetween>
        </StyledTest>
      ))}
    </>
  );
}

const StyledTest = styled.div`
  border: 1px solid snow;
  border-radius: 15px;
  padding: 5px;
`;
