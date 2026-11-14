import { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';

const DECIMAL = /^\d*(?:[.,]\d*)?$/;

export function parseDecimal(text) {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  if (!DECIMAL.test(trimmed)) return undefined;
  const number = Number(trimmed.replace(',', '.'));
  return Number.isFinite(number) ? number : undefined;
}

function formatDecimal(value, language) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return language === 'de' ? text.replace('.', ',') : text;
}

// A number field for weights that takes "62,5" as well as "62.5". While typing,
// the text stays as entered (e.g. "62,"); only valid numbers are passed on.
export default function DecimalInput({ as: Component = 'input', value, onValueChange, onBlur, ...props }) {
  const { language } = useTranslation();
  const [draft, setDraft] = useState(null);

  function handleChange(event) {
    const text = event.target.value;
    setDraft(text);
    const number = parseDecimal(text);
    if (number !== undefined && number !== value) onValueChange(number);
  }

  return (
    <Component
      {...props}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-invalid={(draft !== null && parseDecimal(draft) === undefined) || props['aria-invalid'] || undefined}
      value={draft ?? formatDecimal(value, language)}
      onChange={handleChange}
      onBlur={event => {
        setDraft(null);
        onBlur?.(event);
      }}
    />
  );
}
