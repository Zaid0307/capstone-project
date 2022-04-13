import DaysMap from './DaysMap';

export default function WorkoutPlanDay({ item }) {
  return (
    <>
      {item.days.map(function (day, index) {
        return (
          <div key={`day${index}`}>
            <DaysMap day={day} />
          </div>
        );
      })}
    </>
  );
}
