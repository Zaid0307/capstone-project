import styled from 'styled-components';

export default function Card({ item, images }) {
  const regex = /(<([^>]+)>)/gi;

  const renderImg = images.filter(
    img => img.exercise_base == item.exercise_base
  );

  const img = renderImg.map(img => img.image);

  return (
    <StyledDiv>
      <StyledTitle>{item.name}</StyledTitle>
      <DiscriptionDiv>
        {renderImg.length === 0 ? (
          <Img1
            src="https://img.icons8.com/carbon-copy/100/000000/no-image.png"
            alt="noImg"
            width="80"
            height="80"
          />
        ) : (
          <Img1 src={img[0]} alt="" height="80" />
        )}
        <STyledDescription>
          {item.description.replace(regex, '')}
        </STyledDescription>
      </DiscriptionDiv>
    </StyledDiv>
  );
}

const StyledTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const STyledDescription = styled.p`
  font-size: small;
`;

const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: #d5dee8;
  width: 350px;
  height: 150px;
`;

const DiscriptionDiv = styled.div`
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  display: flex;
  word-wrap: wrap;
  overflow: hidden;
  overflow-y: scroll;
`;

const Img1 = styled.img`
  align-self: center;
  background-color: snow;
  border-radius: 15px;
  margin-right: 15px;
  padding: 5px;
  border: 2px solid #283a45;
`;
