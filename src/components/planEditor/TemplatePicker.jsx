import { useState } from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';
import PageTitle from '../ui/PageTitle';
import {
  PLAN_TEMPLATES,
  TEMPLATE_CATEGORIES,
  templateCategory,
  templateToPlan,
} from '../../data/planTemplates';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { createStarterPlan, defaultDayName, suggestPlanName } from '../../utils/workoutPlan';

const localized = (text, language) => text?.[language] ?? text?.en ?? '';

// First step of a new plan: start empty or copy a template and adapt it.
export default function TemplatePicker({ plans = [], onChoose }) {
  const { t, language } = useTranslation();
  const [category, setCategory] = useState('all');
  const counts = Object.fromEntries(
    TEMPLATE_CATEGORIES.map(key => [key, PLAN_TEMPLATES.filter(template => templateCategory(template) === key).length])
  );
  const shownCategories = category === 'all' ? TEMPLATE_CATEGORIES : [category];

  return (
    <>
      <PageTitle>{t('planEditor.createTitle')}</PageTitle>
      <Card>
        <h2>{t('planEditor.start.emptyTitle')}</h2>
        <p>{t('planEditor.start.emptyText')}</p>
        <div>
          <Button
            onClick={() =>
              onChoose(createStarterPlan({ name: suggestPlanName(plans, t), dayName: defaultDayName(0, t) }))
            }
          >
            {t('planEditor.start.empty')}
          </Button>
        </div>
      </Card>
      <section aria-labelledby="templatesTitle">
        <SectionTitle id="templatesTitle">{t('planEditor.start.templatesTitle')}</SectionTitle>
        <Muted>{t('planEditor.start.templatesText')}</Muted>
        <Chips role="group" aria-label={t('planEditor.start.categories')}>
          {['all', ...TEMPLATE_CATEGORIES].map(key => (
            <Chip
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {t(`planEditor.start.category.${key}`)}{' '}
              <ChipCount>{key === 'all' ? PLAN_TEMPLATES.length : counts[key]}</ChipCount>
            </Chip>
          ))}
        </Chips>
        {shownCategories.map(key => (
          <CategorySection key={key} aria-labelledby={`templates-${key}`}>
            <CategoryTitle id={`templates-${key}`}>{t(`planEditor.start.category.${key}`)}</CategoryTitle>
            <Muted>{t(`planEditor.start.categoryText.${key}`)}</Muted>
            <TemplateList>
              {PLAN_TEMPLATES.filter(template => templateCategory(template) === key).map(template => {
                const name = localized(template.name, language);
                return (
                  <li key={template.id}>
                    <Card as="article">
                      <h4>{name}</h4>
                      <Muted>
                        {t('planEditor.start.daysPerWeek', { count: template.weeklyTrainingDays })} ·{' '}
                        {t(`planEditor.start.level.${template.level}`)}
                      </Muted>
                      <p>{localized(template.description, language)}</p>
                      <div>
                        <Button
                          $variant="secondary"
                          aria-label={t('planEditor.start.useTemplate', { name })}
                          onClick={() => onChoose(templateToPlan(template, language))}
                        >
                          {t('planEditor.start.use')}
                        </Button>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </TemplateList>
          </CategorySection>
        ))}
      </section>
    </>
  );
}

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  h2,
  h3,
  h4 {
    font-size: ${fontSizes.lead};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const TemplateList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  margin-top: ${space.md};
  list-style: none;
`;

// One row of category chips that scrolls sideways on phones.
const Chips = styled.div`
  display: flex;
  gap: ${space.sm};
  margin: ${space.md} calc(-1 * ${space.sm}) 0;
  padding: ${space.sm};
  overflow-x: auto;
  & > * {
    flex-shrink: 0;
  }
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space.xs};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  color: ${colors.text};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

const ChipCount = styled.span`
  min-width: 1.5rem;
  padding: 0 ${space.xs};
  border-radius: ${radii.pill};
  background-color: ${colors.surfaceMuted};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  text-align: center;
`;

const CategorySection = styled.section`
  margin-top: ${space.xl};
`;

const CategoryTitle = styled.h3`
  font-size: ${fontSizes.lead};
`;
