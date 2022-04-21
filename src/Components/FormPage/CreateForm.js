import { useState } from 'react';
import styled from 'styled-components';
import ScreenReaderOnly from '../Styles/ScreenReaderOnly';
import Center from '../Styles/Center';
import { nanoid } from 'nanoid';

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
        return { day: element[0], id: nanoid() };
      }
    });

    onSubmit({
      id: nanoid(),
      nameOfWorkout: formInfo.workOutName,
      description: formInfo.description,
      days: daysAsArray,
    });
  }

  return (
    <PageBox>
      <StyledCenterBox>
        <Title id="fromH2">Create your Workout plan</Title>
      </StyledCenterBox>

      <form
        required
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-labelledby="fromH2"
      >
        <StyledInputBox>
          <label htmlFor="nameOfWorkout">
            <ScreenReaderOnly>Workout plan name:</ScreenReaderOnly>
          </label>
          <StyledInput
            onChange={onChange}
            name="workOutName"
            maxLength="100"
            id="nameOfWorkout"
            type="text"
            placeholder="Name your Workout plan*"
            value={formInfo.workOutName}
            required
          />
        </StyledInputBox>

        <TitleCheckbox>Choose your training days*:</TitleCheckbox>
        <div required>
          <StyledCheckBox>
            <InputCheck
              id="monday"
              name="monday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="monday">Monday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="tuseday"
              name="tuseday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="tuseday">Tuseday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="wednesday"
              name="wednesday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="wednesday">Wednesday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="thursday"
              name="thursday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="thursday"> Thursday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="friday"
              name="friday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="friday">Friday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="saturday"
              name="saturday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="saturday">Saturday</StyledLabel>
          </StyledCheckBox>

          <StyledCheckBox>
            <InputCheck
              id="sunday"
              name="sunday"
              onChange={onCheck}
              type="checkbox"
            />
            <StyledLabel htmlFor="sunday">Sunday</StyledLabel>
          </StyledCheckBox>
        </div>
        <StyledInputBox>
          <label htmlFor="discripeUrPlan">
            <ScreenReaderOnly>Description</ScreenReaderOnly>
          </label>
          <StyledInput
            required
            onChange={onChange}
            name="description"
            maxLength="200"
            id="discripeUrPlan"
            type="text"
            placeholder="Add a description for your Workout plan ..."
            value={formInfo.description}
          />
        </StyledInputBox>
        <Center>
          <SubmitButton onClick={handleSubmit}>Create</SubmitButton>
        </Center>
      </form>
    </PageBox>
  );
}

const PageBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 0 15px 15px 15px;
  padding: 5px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

const StyledCenterBox = styled.div`
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px;
  border-radius: 5px;
`;

const TitleCheckbox = styled.p`
  padding-bottom: 20px;
  color: #496b73;
`;

const StyledInputBox = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  border: none;
  border-bottom: 0.5px solid #5e888c;
  font-size: 1rem;
  padding-left: 0.25rem;
  padding-top: 0.25rem;
  min-width: 20rem;
  background-color: transparent;
  width: 100%;
  &::placeholder {
    color: #344b59;
  }
  &:focus {
    border-color: red;
    outline: none;
  }
`;

const StyledCheckBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const InputCheck = styled.input`
  opacity: 0;
  position: absolute;
  &:checked + label::before {
    background-color: #344b59;
  }
`;

const StyledLabel = styled.label`
  color: #496b73;
  display: flex;
  &::before {
    content: '';
    width: 1rem;
    height: 1rem;
    border-radius: 0.15em;
    margin-right: 0.5em;
    border: 0.09em solid #496b73;
  }
`;
const Title = styled.h2`
  font-size: 1.3rem;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  border: none;
  outline: none;
  border-radius: 5px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px;
  background-color: #283a45;
  color: #d5dee8;
  &:hover {
    background-color: #496b73;
    color: #b5dff5;
  }
`;
