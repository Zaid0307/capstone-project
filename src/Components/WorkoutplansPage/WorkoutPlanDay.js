import DaysMap from './DaysMap';

export default function WorkoutPlanDay({ item, handleDeleteDays }) {
  return (
    <>
      {item.days.map(function (day, index) {
        return (
          <div key={`day${index}`}>
            <DaysMap
              day={day}
              itemId={item.id}
              handleDeleteDays={handleDeleteDays}
            />
          </div>
        );
      })}
    </>
  );
}
