import { useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { BiCheck } from 'react-icons/bi';
import {
  ErrorText,
  Field,
  FormCard,
  FormTitle,
  Input,
  Label,
  StepText,
} from './formStyles';
import Button from '../ui/Button';
import {
  colors,
  fontWeights,
  motion,
  radii,
  sizes,
  space,
} from '../../styles/tokens';
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

    // Keep existing days as they are (id, name, …), so a day stays the same day when editing.
    const existingDays = initialDetails?.days ?? [];
    onSubmit({
      id: initialDetails?.id ?? nanoid(),
      nameOfWorkout: name.trim(),
      description: description.trim(),
      days: WEEKDAYS.filter(day => days.includes(day)).map(
        day => existingDays.find(existing => existing.day === day) ?? { day, id: nanoid() }
      ),
    });
  }

  return (
    <FormCard>
      <div>
        <StepText>{t('planForm.step', { step: 1 })}</StepText>
        <FormTitle as="h1" id="planDetailsTitle">
          {t(isEditing ? 'planDetails.editTitle' : 'planDetails.createTitle')}
        </FormTitle>
      </div>

      <Form
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
          <DayOptions>
            {WEEKDAYS.map(day => (
              <DayOption key={day}>
                <Checkbox
                  id={day}
                  name={day}
                  type="checkbox"
                  checked={days.includes(day)}
                  onChange={handleDayChange}
                />
                <DayLabel htmlFor={day}>
                  <BiCheck aria-hidden="true" />
                  {t(`day.${day}`)}
                </DayLabel>
              </DayOption>
            ))}
          </DayOptions>
          {showDaysError && (
            <ErrorText id="daysError" role="alert">
              {t('planDetails.errorNoDays')}
            </ErrorText>
          )}
        </Fieldset>

        <Field>
          <Label htmlFor="planDescription">{t('planDetails.description')}</Label>
          <Input
            id="planDescription"
            type="text"
            maxLength="200"
            placeholder={t('planDetails.descriptionPlaceholder')}
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </Field>
        <div>
          <Button type="submit">{t('planDetails.next')}</Button>
        </div>
      </Form>
    </FormCard>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${space.xl};
`;

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  min-width: 0;
  border: none;
`;

const Legend = styled.legend`
  margin-bottom: ${space.sm};
  font-weight: ${fontWeights.medium};
`;

// The weekdays wrap onto as many lines as they need.
const DayOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const DayOption = styled.div`
  position: relative;
`;

// The real checkbox stays in the page for keyboard and screen readers;
// the label next to it is what people see and tap.
const Checkbox = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 1px;
  height: 1px;
  &:focus-visible + label {
    outline: 3px solid ${colors.focus};
    outline-offset: 3px;
    box-shadow: 0 0 0 3px ${colors.white};
  }
  &:checked + label {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
  }
  &:checked + label svg {
    visibility: visible;
  }
`;

const DayLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md} 0 ${space.sm};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  cursor: pointer;
  transition: background-color ${motion.fast}, border-color ${motion.fast};
  svg {
    visibility: hidden;
    font-size: 1.25rem;
  }
  &:hover {
    border-color: ${colors.text};
  }
`;
