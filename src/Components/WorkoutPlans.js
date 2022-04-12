import styled from 'styled-components';
import SpaceBetween from './Styles/SpaceBetween';
import StylesCenter from './Styles/Center';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { useState } from 'react';

export default function WorkoutPlans({ item }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [showMucsle, setShowMucsle] = useState(false);

  return (
    <WorkoutBox>
      {[item].map(function (title, index) {
        console.log(title);
        return (
          <Day key={`day.nameOfWorkout${index}`}>
            <StyledCenterBox>
              <p>{title.nameOfWorkout}</p>
              <Button onClick={() => setShowTitle(!showTitle)}>
                {showTitle ? <BiHide /> : <BiShow />}
              </Button>
            </StyledCenterBox>
            {showTitle ? (
              <>
                {title.days.map(function (day, index) {
                  return (
                    <div key={`day${index}`}>
                      <TestDayContainer>
                        <StyledDayBox>
                          <StyledDay>{day.day.toUpperCase()}</StyledDay>
                          <Button onClick={() => setShowDay(!showDay)}>
                            {showDay ? <BiHide /> : <BiShow />}
                          </Button>
                        </StyledDayBox>
                        {showDay ? (
                          <>
                            {day.muscles.map(function (test2, index) {
                              return (
                                <div key={`muscle${index}`}>
                                  <Card>
                                    <StylesCenter>
                                      <StyledMuscle>{test2.name}</StyledMuscle>
                                      <Button
                                        onClick={() =>
                                          setShowMucsle(!showMucsle)
                                        }
                                      >
                                        {showMucsle ? <BiHide /> : <BiShow />}
                                      </Button>
                                    </StylesCenter>
                                    {showMucsle ? (
                                      <>
                                        {test2.exercises.map(function (
                                          test3,
                                          index
                                        ) {
                                          return (
                                            <StyledTest key={`info${index}`}>
                                              <SpaceBetween>
                                                <p>Exercise:</p>
                                                <p>{test3.exercise}</p>
                                              </SpaceBetween>
                                              <SpaceBetween>
                                                <p>Weight:</p>
                                                <p>{test3.weight} K.g.</p>
                                              </SpaceBetween>
                                              <SpaceBetween>
                                                <p>Repetitions:</p>
                                                <p>{test3.repetitions}</p>
                                              </SpaceBetween>
                                              <SpaceBetween>
                                                <p>Sets:</p>
                                                <p>{test3.sets}</p>
                                              </SpaceBetween>
                                            </StyledTest>
                                          );
                                        })}
                                      </>
                                    ) : null}
                                    {}
                                  </Card>
                                </div>
                              );
                            })}
                          </>
                        ) : null}
                        {}
                      </TestDayContainer>
                    </div>
                  );
                })}
              </>
            ) : null}
            {}
          </Day>
        );
      })}
    </WorkoutBox>
  );
}

const StyledDay = styled.div`
  letter-spacing: 0.2em;
  font-size: 1.4rem;
  font-weight: bold;
`;

const StyledCenterBox = styled.div`
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px;
  border-radius: 15px;
`;

const StyledDayBox = styled.div`
  display: flex;
  color: #283a45;
  width: 100%;
  justify-content: center;
  padding: 5px;
  border-radius: 5px;
`;

const Day = styled.div`
  margin: 10px;
  width: 100%;
`;

const Card = styled.div`
  padding: 5px;
  margin: 10px 5px 10px 5px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const StyledMuscle = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
`;

const WorkoutBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  margin: 0 15px 15px 15px;
  padding: 5px;
  margin: 15px 10px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

const TestDayContainer = styled.div`
  box-shadow: rgba(60, 64, 67, 0.3) 0px 2px 6px 2px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 15px;
  margin: 10px 0;
  padding: 10px;
`;

const StyledTest = styled.div`
  border: 1px solid snow;
  border-radius: 15px;
  padding: 5px;
`;

const Button = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 40px;
  color: #283a45;
`;
