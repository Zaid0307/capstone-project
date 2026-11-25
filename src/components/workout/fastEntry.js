// Quick number entry in the set table (docs/ux/02-tagebuch.md, 3.2.3): Enter moves
// to the next field in reading order (kg → reps → per side left, right → next set →
// next exercise); after the last field the keyboard closes. Fields take part via
// the data-fast-entry attribute, within the closest data-fast-entry-scope.
export const FAST_ENTRY = 'data-fast-entry';
export const FAST_ENTRY_SCOPE = 'data-fast-entry-scope';

// Marks the whole content on focus, so a new value replaces the old one.
export function selectOnFocus(event) {
  event.target.select?.();
}

export function focusNextField(event) {
  if (event.key !== 'Enter' || event.nativeEvent?.isComposing) return;
  event.preventDefault();
  const scope = event.currentTarget.closest(`[${FAST_ENTRY_SCOPE}]`) ?? event.currentTarget.ownerDocument;
  const fields = [...scope.querySelectorAll(`[${FAST_ENTRY}]`)].filter(field => !field.disabled);
  const next = fields[fields.indexOf(event.currentTarget) + 1];
  if (next) {
    next.focus();
    next.select?.();
  } else {
    event.currentTarget.blur();
  }
}

// Props for one field of the set table.
export const fastEntryProps = isLast => ({
  [FAST_ENTRY]: '',
  enterKeyHint: isLast ? 'done' : 'next',
  onFocus: selectOnFocus,
  onKeyDown: focusNextField,
});
