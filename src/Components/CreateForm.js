import { useState } from 'react';
import Button from './Button';
import styled from 'styled-components';

export default function CreateForm({ handleSubmit }) {
  return (
    <PageBox>
      <StyledCenterBox>
        <h2 id="fromH2">Create Workout plan</h2>
      </StyledCenterBox>

      <form onSubmit={handleSubmit} autoComplete="off" aria-labelledby="fromH2">
        <StyledInputBox>
          <label htmlFor="nameOfWorkout">Workout plan name*:</label>

          <StyledInput
            /*onChange={onCheck}*/
            name="workOutName"
            required
            maxLength="100"
            id="nameOfWorkout"
            type="text"
            placeholder="Name your Workout plan"
          />
        </StyledInputBox>

        <TitleCheckbox>Choose your training days*:</TitleCheckbox>

        <StyledCheckBox>
          <input name="monday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Monday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="tuseday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Tuseday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="wednesday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Wednesday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="thursday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Thursday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="friday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Friday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="saturday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Saturday</label>
        </StyledCheckBox>

        <StyledCheckBox>
          <input name="sunday" /*onChange={onCheck}*/ type="checkbox" />
          <label>Sunday</label>
        </StyledCheckBox>

        <StyledInputBox>
          <label htmlFor="discripeUrPlan">Description:</label>
          <StyledInput
            //onChange={onChange}
            name="description"
            maxLength="200"
            id="discripeUrPlan"
            type="text"
            placeholder="Add a description for your Workout plan ..."
          />
        </StyledInputBox>

        <Button name="Create Workout Plan" onClick={handleSubmit} />
      </form>
    </PageBox>
  );
}

//Styled-Component
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
