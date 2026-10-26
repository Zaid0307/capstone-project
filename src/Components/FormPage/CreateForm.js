import { useState } from 'react';
import styled from 'styled-components';
import ScreenReaderOnly from '../Styles/ScreenReaderOnly';
import Center from '../Styles/Center';
import { nanoid } from 'nanoid';
import { useTranslation } from '../../i18n/LanguageContext';
import { WEEKDAYS } from '../../utils/workoutPlan';

export default function CreateForm({ onSubmit }) {
  const { t } = useTranslation();
  const [formInfo, setFormInfo] = useState({
    workOutName: '',
    description: '',
  });
  const [days, setDays] = useState([]);
  const [showDaysError, setShowDaysError] = useState(false);

  function onCheck(event) {
    const { name, checked } = event.target;
    setDays(checked ? [...days, name] : days.filter(day => day !== name));
    setShowDaysError(false);
  }

  function onChange(event) {
    const { name, value } = event.target;
    setFormInfo({ ...formInfo, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formInfo.workOutName.trim()) {
      return;
    }
    if (days.length === 0) {
      setShowDaysError(true);
      return;
    }

    onSubmit({
      id: nanoid(),
      nameOfWorkout: formInfo.workOutName.trim(),
      description: formInfo.description.trim(),
      days: WEEKDAYS.filter(day => days.includes(day)).map(day => ({
        day,
        id: nanoid(),
      })),
    });
  }

  return (
    <PageBox>
      <StyledCenterBox>
        <Title id="fromH2">{t('createForm.title')}</Title>
      </StyledCenterBox>

      <form onSubmit={handleSubmit} autoComplete="off" aria-labelledby="fromH2">
        <StyledInputBox>
          <label htmlFor="nameOfWorkout">{t('createForm.name')}</label>
          <StyledInput
            onChange={onChange}
            name="workOutName"
            maxLength="100"
            id="nameOfWorkout"
            type="text"
            placeholder={t('createForm.namePlaceholder')}
            value={formInfo.workOutName}
            pattern=".*\S.*"
            required
          />
        </StyledInputBox>

        <fieldset aria-describedby={showDaysError ? 'daysError' : undefined}>
          <TitleCheckbox as="legend">{t('createForm.days')}</TitleCheckbox>
          {WEEKDAYS.map(day => (
            <StyledCheckBox key={day}>
              <InputCheck
                id={day}
                name={day}
                onChange={onCheck}
                type="checkbox"
                checked={days.includes(day)}
              />
              <StyledLabel htmlFor={day}>{t(`day.${day}`)}</StyledLabel>
            </StyledCheckBox>
          ))}
          {showDaysError && (
            <ErrorText id="daysError" role="alert">
              {t('createForm.errorNoDays')}
            </ErrorText>
          )}
        </fieldset>
        <StyledInputBox>
          <label htmlFor="discripeUrPlan">
            <ScreenReaderOnly>{t('createForm.description')}</ScreenReaderOnly>
          </label>
          <StyledInput
            onChange={onChange}
            name="description"
            maxLength="200"
            id="discripeUrPlan"
            type="text"
            placeholder={t('createForm.descriptionPlaceholder')}
            value={formInfo.description}
          />
        </StyledInputBox>
        <Center>
          <SubmitButton type="submit">{t('createForm.submit')}</SubmitButton>
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
  fieldset {
    border: none;
  }
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

const ErrorText = styled.p`
  color: #a12a2a;
  font-size: 0.9rem;
`;

const StyledInputBox = styled.div`
  display: flex;
  flex-direction: column;
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
  min-width: min(20rem, 100%);
  background-color: transparent;
  width: 100%;
  &:focus {
    border-color: #d5dee8;
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
  &:focus-visible + label::before {
    outline: 2px solid #283a45;
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
