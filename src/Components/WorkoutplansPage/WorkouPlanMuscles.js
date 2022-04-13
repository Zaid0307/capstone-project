import MusclesMap from './MusclesMap';

export default function WorkoutPlanMuscles({ day }) {
  return (
    <>
      {day.muscles.map(function (muscle, index) {
        return <MusclesMap muscle={muscle} index={index} />;
      })}
    </>
  );
}
