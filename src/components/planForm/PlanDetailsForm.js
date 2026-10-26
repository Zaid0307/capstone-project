import { useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { ErrorText, FormCard, FormTitle, Input, Label } from './formStyles';
import Button from '../ui/Button';
import Center from '../ui/Center';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';
import { WEEKDAYS } from '../../utils/workoutPlan';

// Name, description and training days of a plan.
export default function PlanDetailsForm({ onSubmit, initialDetails, isEditing }) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialDetails?.nameOfWorkout ?? '');
  const [description, setDescription] = useState(
    initialDetails?.description ?? ''
  );
  const [days, setDays] = useState(
    initialDetails?.days.map(({ day }) => day) ?? []
  );
  const [showDaysError, setShowDaysError] = useState(false);

  function handleDayChange(event) {
    const { name: day, checked } = event.target;
    setDays(checked ? [...days, day] : days.filter(other => other !== day));
    setShowDaysError(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }
    if (days.length === 0) {
      setShowDaysError(true);
      return;
    }

    // Keep the ids of existing days so a day stays the same day when editing.
    const existingDays = initialDetails?.days ?? [];
    onSubmit({
      id: initialDetails?.id ?? nanoid(),
      nameOfWorkout: name.trim(),
      description: description.trim(),
      days: WEEKDAYS.filter(day => days.includes(day)).map(day => ({
        day,
        id: existingDays.find(existing => existing.day === day)?.id ?? nanoid(),
      })),
    });
  }

  return (
    <FormCard>
      <FormTitle id="planDetailsTitle">
        {t(isEditing ? 'planDetails.editTitle' : 'planDetails.createTitle')}
      </FormTitle>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-labelledby="planDetailsTitle"
      >
        <Field>
          <Label htmlFor="planName">{t('planDetails.name')}</Label>
          <Input
            id="planName"
            type="text"
            maxLength="100"
            placeholder={t('planDetails.namePlaceholder')}
            value={name}
            onChange={event => setName(event.target.value)}
            pattern=".*\S.*"
            required
          />
        </Field>

        <Fieldset aria-describedby={showDaysError ? 'daysError' : undefined}>
          <Legend>{t('planDetails.days')}</Legend>
          {WEEKDAYS.map(day => (
            <CheckboxRow key={day}>
              <Checkbox
                id={day}
                name={day}
                type="checkbox"
                checked={days.includes(day)}
                onChange={handleDayChange}
              />
              <CheckboxLabel htmlFor={day}>{t(`day.${day}`)}</CheckboxLabel>
            </CheckboxRow>
          ))}
          {showDaysError && (
            <ErrorText id="daysError" role="alert">
              {t('planDetails.errorNoDays')}
            </ErrorText>
          )}
        </Fieldset>

        <Field>
          <label htmlFor="planDescription">
            <ScreenReaderOnly>{t('planDetails.description')}</ScreenReaderOnly>
          </label>
          <Input
            id="planDescription"
            type="text"
            maxLength="200"
            placeholder={t('planDetails.descriptionPlaceholder')}
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </Field>
        <Center>
          <Button type="submit">{t('planDetails.next')}</Button>
        </Center>
      </form>
    </FormCard>
  );
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: min(20rem, 100%);
  padding: 20px 0;
`;

const Fieldset = styled.fieldset`
  border: none;
`;

const Legend = styled.legend`
  padding-bottom: 20px;
  color: ${colors.primary};
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const Checkbox = styled.input`
  position: absolute;
  opacity: 0;
  &:checked + label::before {
    background-color: ${colors.dark};
  }
  &:focus-visible + label::before {
    outline: 2px solid ${colors.text};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  color: ${colors.primary};
  &::before {
    content: '';
    width: 1rem;
    height: 1rem;
    margin-right: 0.5em;
    border: 0.09em solid ${colors.primary};
    border-radius: 0.15em;
  }
`;
