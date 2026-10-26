// Builds one exercise entry. Keeps the data files compact and every entry the same shape.
export function exercise(id, category, equipment, primary, secondary, [nameDe, nameEn], [descriptionDe, descriptionEn]) {
  return {
    id,
    category,
    equipment,
    muscles: { primary, secondary },
    name: { de: nameDe, en: nameEn },
    description: { de: descriptionDe, en: descriptionEn },
  };
}
