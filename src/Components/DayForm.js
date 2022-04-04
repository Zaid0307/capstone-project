import Button from './Button';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';

export default function DayForm({ day }) {
  return (
    <>
      <ScreenReaderOnly id="formSpan" Create your workout sessions />
      <h2>{day}</h2>
      <form
        autoComplete="off"
        aria-labelledby="formSpan"
        //onSubmit={}
      >
        <div>
          <p>mucels</p> <Button name="+" />
          <p>0</p>
          <Button name="-" />
        </div>

        <input
          lable="Exercise"
          id="exercise"
          name="exercise"
          required="required"
          maxLenght={20}
          type="text"
          placeholder="add ur exercise"
          //value=""
          //onChange={}
        />
        <input
          lable="Weight"
          id="weight"
          name="weight"
          required="required"
          maxLenght={5}
          type="text"
          placeholder="add your weight"
          //value=""
          //onChange={}
        />
        <input
          lable="Repetitions"
          id="repetitions"
          name="repetitions"
          required="required"
          maxLenght={2}
          type="text"
          placeholder="add your repetitions"
          //value=""
          //onChange={}
        />
        <input
          lable="Sets"
          id="sets"
          name="sets"
          required="required"
          maxLenght={2}
          type="text"
          placeholder="add your sets"
          //value=""
          //onChange={}
        />
        <Button
          name="Save"
          type="submit"
          //onClick={}
        />
      </form>
    </>
  );
}
