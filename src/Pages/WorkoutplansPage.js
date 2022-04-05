import WorkoutPlans from '../Components/WorkoutPlans';
export default function WorkoutplansPage({ data }) {
  return (
    <>
      {data.map(function (item, index) {
        return (
          <>
            <div key={index}>
              <WorkoutPlans item={item} />
            </div>
          </>
        );
      })}
    </>
  );
}
