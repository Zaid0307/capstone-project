import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MuscleIcon from './MuscleIcon';
import PageTitle from '../ui/PageTitle';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import {
  colors,
  fontWeights,
  motion,
  radii,
  shadows,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';

export default function MuscleGroupPicker() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('exercises.title')}</PageTitle>
      <Grid>
        {MUSCLE_GROUP_NAMES.map(muscle => (
          <li key={muscle}>
            <Tile to={routes.muscleGroup(muscle)}>
              <MuscleIcon muscle={muscle} size={80} />
              {t(`muscle.${muscle}`)}
            </Tile>
          </li>
        ))}
      </Grid>
    </>
  );
}

// Two columns; one column when a tile would get narrower than 9rem
// (small screens or large text).
const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(9rem, calc(50% - ${space.md})), 1fr));
  gap: ${space.md};
  list-style: none;
`;

const Tile = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${space.sm};
  height: 100%;
  min-height: ${sizes.touchTarget};
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
  text-align: center;
  text-decoration: none;
  box-shadow: ${shadows.card};
  transition: background-color ${motion.fast};
  &:hover {
    background-color: ${colors.highlight};
  }
  &:active {
    background-color: ${colors.surfaceMuted};
  }
`;
