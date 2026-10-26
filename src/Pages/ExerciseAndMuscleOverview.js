import EntryMuscels from '../Components/ExercisesAndMuscels/EntryMuscels';
import { useState } from 'react';
import Card from '../Components/ExercisesAndMuscels/Card';
import styled from 'styled-components';
import NavEntryMuscels from '../Components/ExercisesAndMuscels/NavEntryMuscles';
import BacktoTopButton from '../Components/BacktoTopButton';
import Navigation from '../Components/Nav/Navigation';
import { useTranslation } from '../i18n/LanguageContext';

export default function ExerciseAndMuscleOverview({
  groups,
  isLoading,
  error,
  reload,
}) {
  const [activeMuscle, setActiveMuscle] = useState(null);
  const { t } = useTranslation();

  function renderExercises() {
    if (error) {
      return (
        <Message role="alert">
          <p>{t('exercises.error')}</p>
          <RetryButton onClick={reload}>{t('exercises.retry')}</RetryButton>
        </Message>
      );
    }
    if (isLoading && !groups) {
      return <Message role="status">{t('exercises.loading')}</Message>;
    }
    const exercises = groups[activeMuscle] ?? [];
    if (exercises.length === 0) {
      return <Message>{t('exercises.empty')}</Message>;
    }
    return exercises.map(exercise => (
      <Card key={exercise.id} exercise={exercise} />
    ));
  }

  return (
    <GridWrap>
      <Background>
        {!activeMuscle ? (
          <EntryMuscels handleActiveMuscle={setActiveMuscle} />
        ) : (
          <BackgroundCards>
            <NavEntryMuscels
              handleActiveMuscle={setActiveMuscle}
              activeMuscle={activeMuscle}
            />
            <BacktoTopButton />
            {renderExercises()}
          </BackgroundCards>
        )}
      </Background>
      <Navigation />
    </GridWrap>
  );
}

const Background = styled.div`
  height: 100%;
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
`;

const BackgroundCards = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px;
  padding: 15px;
  border-radius: 15px;
  background-color: #d5dee8;
  color: #283a45;
  text-align: center;
`;

const RetryButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: #283a45;
  color: #d5dee8;
`;
