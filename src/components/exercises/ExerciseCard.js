import styled from 'styled-components';
import { BiDumbbell } from 'react-icons/bi';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ExerciseCard({ exercise }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Title>{exercise.name}</Title>
      <Content>
        {exercise.image ? (
          <Image
            src={exercise.image}
            alt={exercise.name}
            height="80"
            loading="lazy"
          />
        ) : (
          <Placeholder role="img" aria-label={t('exercises.noImage')}>
            <BiDumbbell size={50} />
          </Placeholder>
        )}
        <Description>{exercise.description}</Description>
      </Content>
    </Card>
  );
}

const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 350px;
  max-width: calc(100vw - 20px);
  height: 150px;
  padding: 10px;
  border-radius: 15px;
  background-color: ${colors.surface};
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Content = styled.div`
  display: flex;
  margin: 5px;
  padding: 10px;
  overflow-y: auto;
`;

const Description = styled.p`
  font-size: small;
`;

const imageBox = `
  align-self: center;
  flex-shrink: 0;
  margin-right: 15px;
  border-radius: 15px;
  background-color: ${colors.white};
`;

const Image = styled.img`
  ${imageBox}
  max-width: 100px;
  padding: 5px;
  border: 2px solid ${colors.text};
  object-fit: contain;
`;

const Placeholder = styled.div`
  ${imageBox}
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  color: ${colors.secondary};
`;
