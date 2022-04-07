import { useState } from 'react';
import Button from './Button';
import styled from 'styled-components';

export default function CreateForm({ onSubmit }) {
  const [formInfo, setFormInfo] = useState({
    workOutName: '',
    description: '',
  });
  const [days, setDays] = useState();

  function onCheck(event) {
    const { name, checked } = event.target;
    setDays({ ...days, [name]: checked });
  }

  function onChange(event) {
    const { name, value } = event.target;
    setFormInfo({ ...formInfo, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const daysAsArray = Object.entries(days).map(element => {
      if (element[1]) {
        return { day: element[0] };
      }
    });

    onSubmit({
      nameOfWorkout: formInfo.workOutName,
      description: formInfo.description,
      days: daysAsArray,
    });
  }

  return (
    <PageBox>
      <StyledCenterBox>
        <h2 id="fromH2">Create Workout plan</h2>
      </StyledCenterBox>

      <form onSubmit={handleSubmit} autoComplete="off" aria-labelledby="fromH2">
        <StyledInputBox>
          <label htmlFor="nameOfWorkout">Workout plan name*:</label>

          <StyledInput
            onChange={onChange}
            name="workOutName"
            required
            maxLength="100"
            id="nameOfWorkout"
            type="text"
            placeholder="Name your Workout plan"
            value={formInfo.workOutName}
          />
        </StyledInputBox>

        <TitleCheckbox>Choose your training days*:</TitleCheckbox>

        <StyledCheckBox>
          <input id="monday" name="monday" onChange={onCheck} type="checkbox" />
          <label htmlFor="monday">Monday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input
            id="tuseday"
            name="tuseday"
            onChange={onCheck}
            type="checkbox"
          />
          <label htmlFor="tuseday">Tuseday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input
            id="wednesday"
            name="wednesday"
            onChange={onCheck}
            type="checkbox"
          />
          <label htmlFor="wednesday">Wednesday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input
            id="thursday"
            name="thursday"
            onChange={onCheck}
            type="checkbox"
          />
          <label htmlFor="thursday"> Thursday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input id="friday" name="friday" onChange={onCheck} type="checkbox" />
          <label htmlFor="friday">Friday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input
            id="saturday"
            name="saturday"
            onChange={onCheck}
            type="checkbox"
          />
          <label htmlFor="saturday">Saturday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input id="sunday" name="sunday" onChange={onCheck} type="checkbox" />
          <label htmlFor="sunday">Sunday</label>
        </StyledCheckBox>

        <StyledInputBox>
          <label htmlFor="discripeUrPlan">Description:</label>
          <StyledInput
            onChange={onChange}
            name="description"
            maxLength="200"
            id="discripeUrPlan"
            type="text"
            placeholder="Add a description for your Workout plan ..."
            value={formInfo.description}
          />
        </StyledInputBox>

        <Button name="Create Workout Plan" onClick={handleSubmit} />
      </form>
    </PageBox>
  );
}

const PageBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  padding: 5px;
  margin: 5px;
`;

const StyledCenterBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 5px;
`;

const TitleCheckbox = styled.p`
  padding-bottom: 20px;
`;

const StyledInputBox = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
`;

const StyledCheckBox = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;
