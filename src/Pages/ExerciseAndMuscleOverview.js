import EntryMuscels from '../Components/ExercisesAndMuscels/EntryMuscels';
import { useState } from 'react';
import Card from '../Components/ExercisesAndMuscels/Card';
import styled from 'styled-components';
import NavEntryMuscels from '../Components/ExercisesAndMuscels/NavEntryMuscles';
import BacktoTopButton from '../Components/BacktoTopButton';
import Navigation from '../Components/Nav/Navigation';
export default function ExerciseAndMuscleOverview({
  shoulders,
  arms,
  legs,
  abs,
  chest,
  back,
  images,
}) {
  const [activeMuscle, setActiveMuscle] = useState(null);

  function handleActiveMuscle(name) {
    setActiveMuscle(name);
  }

  return (
    <GridWrap>
      <Background>
        {!activeMuscle ? (
          <EntryMuscels handleActiveMuscle={handleActiveMuscle} />
        ) : (
          <>
            {activeMuscle === 'shoulders' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {shoulders.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
            {activeMuscle === 'legs' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {legs.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
            {activeMuscle === 'arms' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {arms.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
            {activeMuscle === 'abs' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {abs.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
            {activeMuscle === 'chest' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {chest.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
            {activeMuscle === 'back' && (
              <BackgroundCards>
                <NavEntryMuscels
                  handleActiveMuscle={handleActiveMuscle}
                  activeMuscle={activeMuscle}
                />
                <BacktoTopButton />
                {back.map((item, index) => (
                  <div key={index}>
                    <Card item={item} images={images} />
                  </div>
                ))}
              </BackgroundCards>
            )}
          </>
        )}
      </Background>
      <Navigation />
    </GridWrap>
  );
}

const Background = styled.div`
  height: 100%;
`;
const BackgroundCards = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
`;
const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
