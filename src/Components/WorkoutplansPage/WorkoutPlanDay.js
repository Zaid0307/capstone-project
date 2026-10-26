import DaysMap from './DaysMap';
import { sortDays } from '../../utils/workoutPlan';

export default function WorkoutPlanDay({ item, handleDeleteDays }) {
  return (
    <>
      {sortDays(item.days ?? []).map(day => (
        <DaysMap
          key={day.id}
          day={day}
          itemId={item.id}
          handleDeleteDays={handleDeleteDays}
        />
      ))}
    </>
  );
}
