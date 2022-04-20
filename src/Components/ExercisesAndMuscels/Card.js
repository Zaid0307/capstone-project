import styled from 'styled-components';

export default function Card({ item, images }) {
  const regex = /(<([^>]+)>)/gi;

  const renderImg = images.filter(
    img => img.exercise_base == item.exercise_base
  );

  console.log(renderImg);
  return (
    <StyledDiv>
      <StyledTitle>{item.name}</StyledTitle>
      <DiscriptionDiv>
        {!item.exercise_base ? (
          <img
            src="https://img.icons8.com/carbon-copy/100/000000/no-image.png"
            alt="noImg"
          />
        ) : (
          <>
            {item.exercise_base === renderImg.exercise_base && (
              <img src={renderImg.image} />
            )}
          </>
        )}

        {/* {item.exercise_base === renderImg.exercise_base ? (
          <img src={renderImg.image} />
        ) : (
          <img
            src="https://img.icons8.com/carbon-copy/100/000000/no-image.png"
            alt="noImg"
          />
        )} */}
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
`;
