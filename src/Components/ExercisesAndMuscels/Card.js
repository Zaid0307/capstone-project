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
  border: 1px solid black;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  /* height: 100px;
  width: 250px; */
`;

const DiscriptionDiv = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
`;

const Img1 = styled.img`
  align-self: center;
`;
