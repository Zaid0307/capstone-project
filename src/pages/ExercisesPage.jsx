import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import BackToTopButton from '../components/layout/BackToTopButton';
import ExerciseCard from '../components/exercises/ExerciseCard';
import MuscleGroupNav from '../components/exercises/MuscleGroupNav';
import MuscleGroupPicker from '../components/exercises/MuscleGroupPicker';
import Message from '../components/ui/Message';
import { exercisesByGroup } from '../data/exerciseLibrary';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function ExercisesPage() {
  const { t, language } = useTranslation();
  const { muscle } = useParams();
  const groups = useMemo(() => exercisesByGroup(language), [language]);

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

  const exercises = groups[muscle];

  return (
    <PageLayout>
      <MuscleGroupNav />
      <BackToTopButton />
      <CardList>
        {exercises.length === 0 ? (
          <Message>{t('exercises.empty')}</Message>
        ) : (
          exercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        )}
      </CardList>
    </PageLayout>
  );
}

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
