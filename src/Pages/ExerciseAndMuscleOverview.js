import EntryMuscels from '../Components/ExercisesAndMuscels/EntryMuscels';
import { useState } from 'react';
import Card from '../Components/ExercisesAndMuscels/Card';

export default function ExerciseAndMuscleOverview({
  sholder,
  arms,
  legs,
  abs,
  chest,
  back,
  images,
}) {
  const [toggleSholder, setToggleSholder] = useState(false);
  const [togglArms, setToggleArms] = useState(false);
  const [toggleAbs, setToggleAbs] = useState(false);
  const [toggleChest, setToggleChest] = useState(false);
  const [toggleLegs, setToggleLegs] = useState(false);
  const [toggleBack, setToggleBack] = useState(false);

  function handleSholders() {
    setToggleSholder(true);
  }

  return (
    <>
      {!toggleSholder ? (
        <EntryMuscels handleSholders={handleSholders} />
      ) : (
        <>
          {sholder.map((item, index) => (
            <div key={index}>
              <Card item={item} images={images} />
            </div>
          ))}
        </>
      )}
    </>
  );
}
