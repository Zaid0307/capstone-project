import styled from 'styled-components';
import { BiDumbbell } from 'react-icons/bi';
import {
  colors,
  fontSizes,
  radii,
  shadows,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ExerciseCard({ exercise }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Header>
        {exercise.image ? (
          <Image src={exercise.image} alt={exercise.name} loading="lazy" />
        ) : (
          <Placeholder role="img" aria-label={t('exercises.noImage')}>
            <BiDumbbell />
          </Placeholder>
        )}
        <Title>{exercise.name}</Title>
      </Header>
      <p>{exercise.description}</p>
    </Card>
  );
}

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.md};
`;

const Title = styled.h2`
  min-width: 0;
  font-size: ${fontSizes.lead};
`;

const Image = styled.img`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: ${radii.small};
  object-fit: contain;
`;

// Without a real exercise image only a small symbol, not a large empty box.
const Placeholder = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${radii.small};
  background-color: ${colors.surfaceMuted};
  color: ${colors.textMuted};
  font-size: 1.5rem;
`;
