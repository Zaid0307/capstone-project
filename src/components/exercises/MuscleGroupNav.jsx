import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { BiArrowBack } from 'react-icons/bi';
import MuscleIcon from './MuscleIcon';
import PageTitle from '../ui/PageTitle';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import {
  colors,
  fontSizes,
  fontWeights,
  motion,
  radii,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';

// Header of a muscle group page: back link, group name and links to the other groups.
// NavLink marks the current group with aria-current="page".
export default function MuscleGroupNav({ muscle }) {
  const { t } = useTranslation();

  return (
    <Header>
      <BackLink to={routes.exercises} aria-label={t('exercises.back')}>
        <BiArrowBack aria-hidden="true" />
        {t('exercises.backShort')}
      </BackLink>
      <PageTitle>{t(`muscle.${muscle}`)}</PageTitle>
      <GroupNav aria-label={t('exercises.groups')}>
        <GroupList>
          {MUSCLE_GROUP_NAMES.map(name => (
            <li key={name}>
              <GroupLink to={routes.muscleGroup(name)}>
                <MuscleIcon muscle={name} size={28} />
                {t(`muscle.${name}`)}
              </GroupLink>
            </li>
          ))}
        </GroupList>
      </GroupNav>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${space.md};
  min-width: 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md} 0 ${space.sm};
  border-radius: ${radii.small};
  color: ${colors.text};
  font-weight: ${fontWeights.medium};
  text-decoration: none;
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
`;

const GroupNav = styled.nav`
  align-self: stretch;
  min-width: 0;
`;

// Scrolls sideways; the padding keeps focus rings from being cut off.
const GroupList = styled.ul`
  display: flex;
  gap: ${space.sm};
  margin: calc(-1 * ${space.sm});
  padding: ${space.sm};
  overflow-x: auto;
  list-style: none;
`;

const GroupLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: ${space.sm};
  min-height: ${sizes.touchTarget};
  padding: ${space.xs} ${space.md};
  border: 2px solid transparent;
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  white-space: nowrap;
  text-decoration: none;
  transition: background-color ${motion.fast};
  &:hover {
    background-color: ${colors.highlight};
  }
  &:active {
    background-color: ${colors.surfaceMuted};
  }
  &[aria-current='page'] {
    border-color: ${colors.primary};
    background-color: ${colors.highlight};
    font-weight: ${fontWeights.medium};
  }
`;
