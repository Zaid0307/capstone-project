import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemplatePicker from './TemplatePicker';
import { renderWithProviders } from '../../test-utils';
import { PLAN_TEMPLATES } from '../../data/planTemplates';

function renderPicker() {
  const onChoose = vi.fn();
  renderWithProviders(<TemplatePicker plans={[]} onChoose={onChoose} />);
  return { onChoose };
}

const filterGroup = name => within(screen.getByRole('group', { name }));
const templateHeadings = () => screen.queryAllByRole('heading', { level: 4 }).map(heading => heading.textContent);

describe('TemplatePicker', () => {
  beforeEach(() => localStorage.clear());

  it('filters the templates by level, place and days per week', async () => {
    renderPicker();
    expect(screen.getByRole('status')).toHaveTextContent(`${PLAN_TEMPLATES.length} templates match`);

    await userEvent.click(filterGroup('Place').getByRole('button', { name: 'Home' }));
    expect(filterGroup('Place').getByRole('button', { name: 'Home' })).toHaveAttribute('aria-pressed', 'true');
    const homeNames = PLAN_TEMPLATES.filter(template => template.setting === 'home').map(template => template.name.en);
    expect([...templateHeadings()].sort()).toEqual([...homeNames].sort());
    expect(templateHeadings()).not.toContain('Muscle building full body, 3 days');

    await userEvent.click(filterGroup('Days per week').getByRole('button', { name: '5 or more' }));
    await userEvent.click(filterGroup('Level').getByRole('button', { name: 'Beginner' }));
    const shown = templateHeadings();
    expect(shown.length).toBeGreaterThan(0);
    expect(screen.getByRole('status')).toHaveTextContent(
      shown.length === 1 ? '1 template matches' : `${shown.length} templates match`
    );

    // Gym plans with 5 or more days are all for experienced users.
    await userEvent.click(filterGroup('Place').getByRole('button', { name: 'Gym' }));
    expect(templateHeadings()).toEqual([]);
    expect(screen.getByText('No template matches these filters.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(templateHeadings()).toHaveLength(PLAN_TEMPLATES.length);
    expect(screen.queryByRole('button', { name: 'Reset filters' })).not.toBeInTheDocument();
  });

  it('counts the templates per category with the filters applied', async () => {
    renderPicker();
    await userEvent.click(filterGroup('Place').getByRole('button', { name: 'Gym' }));
    const categories = filterGroup('Categories');
    expect(categories.getByRole('button', { name: /^Home and bands 0$/ })).toBeInTheDocument();
    expect(categories.getByRole('button', { name: /^All \d+$/ })).toHaveTextContent(String(templateHeadings().length));
  });

  it('previews a template with its days, exercises and muscle load before taking it over', async () => {
    const { onChoose } = renderPicker();
    const card = () => screen.getByRole('heading', { name: 'Muscle building full body, 3 days' }).closest('article');

    const previewButton = within(card()).getByRole('button', { name: 'Preview' });
    expect(previewButton).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(previewButton);

    const preview = within(screen.getByRole('region', { name: 'Preview of Muscle building full body, 3 days' }));
    expect(within(card()).getByRole('button', { name: 'Close preview' })).toHaveAttribute('aria-expanded', 'true');
    expect(preview.getByRole('heading', { name: /^Monday/ })).toBeInTheDocument();
    expect(preview.getByRole('list', { name: 'Exercises of Monday' })).toHaveTextContent(/Goblet squat/i);
    expect(preview.getByRole('heading', { name: 'Sets per muscle group: Whole plan' })).toBeInTheDocument();

    await userEvent.click(within(card()).getByRole('button', { name: 'Use template Muscle building full body, 3 days' }));
    const plan = onChoose.mock.calls[0][0];
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(plan.template.id).toBe('hypertrophy_fullbody_3');
    expect(plan.days.map(day => day.weekday)).toEqual(['monday', 'wednesday', 'friday']);
  });

  it('shows one preview at a time', async () => {
    renderPicker();
    const previews = screen.getAllByRole('button', { name: 'Preview' });
    await userEvent.click(previews[0]);
    await userEvent.click(screen.getAllByRole('button', { name: 'Preview' })[0]);
    expect(screen.getAllByRole('button', { name: 'Close preview' })).toHaveLength(1);
    expect(screen.getAllByRole('region', { name: /^Preview of / })).toHaveLength(1);
  });
});
