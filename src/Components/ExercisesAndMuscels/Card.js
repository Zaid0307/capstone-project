import styled from 'styled-components';
import { BiDumbbell } from 'react-icons/bi';
import { useTranslation } from '../../i18n/LanguageContext';

export default function Card({ exercise }) {
  const { t } = useTranslation();

  return (
    <StyledDiv>
      <StyledTitle>{exercise.name}</StyledTitle>
      <DiscriptionDiv>
        {exercise.image ? (
          <Img1 src={exercise.image} alt={exercise.name} height="80" />
        ) : (
          <Placeholder role="img" aria-label={t('exercises.noImage')}>
            <BiDumbbell size={50} />
          </Placeholder>
        )}
        <STyledDescription>{exercise.description}</STyledDescription>
      </DiscriptionDiv>
    </StyledDiv>
  );
}

const StyledTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

const STyledDescription = styled.p`
  font-size: small;
`;

const StyledDiv = styled.article`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: #d5dee8;
  width: 350px;
  max-width: calc(100vw - 20px);
  height: 150px;
`;

const DiscriptionDiv = styled.div`
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  display: flex;
  word-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
`;

const Img1 = styled.img`
  align-self: center;
  background-color: snow;
  border-radius: 15px;
  margin-right: 15px;
  padding: 5px;
  border: 2px solid #283a45;
  max-width: 100px;
  object-fit: contain;
`;

const Placeholder = styled.div`
  align-self: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 15px;
  background-color: snow;
  color: #5e888c;
`;
