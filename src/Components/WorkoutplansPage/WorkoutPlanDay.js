import DaysMap from './DaysMap';

export default function WorkoutPlanDay({ item }) {
  return (
    <>
      {item.days.map(function (day, index) {
        return <DaysMap day={day} index={index} />;
      })}
    </>
  );
}
