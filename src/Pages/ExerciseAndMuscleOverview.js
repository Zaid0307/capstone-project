import EntryMuscels from '../Components/ExercisesAndMuscels/EntryMuscels';
import { useState } from 'react';
import Card from '../Components/ExercisesAndMuscels/Card';
import styled from 'styled-components';
import NavEntryMuscels from '../Components/ExercisesAndMuscels/NavEntryMuscles';
import BacktoTopButton from '../Components/BacktoTopButton';

export default function ExerciseAndMuscleOverview({
  sholder,
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
    <Background>
      {!activeMuscle ? (
        <EntryMuscels handleActiveMuscle={handleActiveMuscle} />
      ) : (
        <>
          {activeMuscle === 'sholders' && (
            <div>
              <NavEntryMuscels
                handleActiveMuscle={handleActiveMuscle}
                activeMuscle={activeMuscle}
              />
              <BacktoTopButton />
              {sholder.map((item, index) => (
                <div key={index}>
                  <Card item={item} images={images} />
                </div>
              ))}
            </div>
          )}
          {activeMuscle === 'legs' && (
            <div>
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
            </div>
          )}
          {activeMuscle === 'arms' && (
            <div>
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
            </div>
          )}
          {activeMuscle === 'abs' && (
            <div>
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
            </div>
          )}
          {activeMuscle === 'chest' && (
            <div>
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
            </div>
          )}
          {activeMuscle === 'back' && (
            <div>
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
            </div>
          )}
        </>
      )}
    </Background>
  );
}

const Background = styled.div`
  height: 100%;
`;
