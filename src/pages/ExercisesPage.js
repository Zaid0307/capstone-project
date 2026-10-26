import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import BackToTopButton from '../components/layout/BackToTopButton';
import ExerciseCard from '../components/exercises/ExerciseCard';
import MuscleGroupNav from '../components/exercises/MuscleGroupNav';
import MuscleGroupPicker from '../components/exercises/MuscleGroupPicker';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import { MUSCLE_GROUP_NAMES } from '../api/wger';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function ExercisesPage({ groups, isLoading, error, reload }) {
  const { t } = useTranslation();
  const { muscle } = useParams();

  if (!muscle) {
    return (
      <PageLayout>
        <MuscleGroupPicker />
      </PageLayout>
    );
  }
  if (!MUSCLE_GROUP_NAMES.includes(muscle)) {
    return <Navigate to={routes.exercises} replace />;
  }

  function renderExercises() {
    if (error) {
      return (
        <Message role="alert">
          <p>{t('exercises.error')}</p>
          <Button onClick={reload}>{t('exercises.retry')}</Button>
        </Message>
      );
    }
    if (isLoading && !groups) {
      return <Message role="status">{t('exercises.loading')}</Message>;
    }
    const exercises = groups[muscle];
    if (exercises.length === 0) {
      return <Message>{t('exercises.empty')}</Message>;
    }
    return exercises.map(exercise => (
      <ExerciseCard key={exercise.id} exercise={exercise} />
    ));
  }

  return (
    <PageLayout>
      <MuscleGroupNav />
      <BackToTopButton />
      <CardList>{renderExercises()}</CardList>
    </PageLayout>
  );
}

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
