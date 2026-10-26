import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BiArrowBack } from 'react-icons/bi';
import muscleIcons from './muscleIcons';
import { MUSCLE_GROUP_NAMES } from '../../api/wger';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';

export default function MuscleGroupNav() {
  const { t } = useTranslation();

  return (
    <Nav aria-label={t('nav.exercises')}>
      <BackLink to={routes.exercises} aria-label={t('exercises.back')}>
        <BiArrowBack size={30} />
      </BackLink>
      {MUSCLE_GROUP_NAMES.map(muscle => (
        <MuscleLink
          key={muscle}
          to={routes.muscleGroup(muscle)}
          aria-label={t(`muscle.${muscle}`)}
        >
          <img src={muscleIcons[muscle]} alt="" width="30" />
        </MuscleLink>
      ))}
    </Nav>
  );
}

const linkStyle = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: ${radii.large};
  color: ${colors.text};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
`;

const BackLink = styled(Link)`
  ${linkStyle}
`;

const MuscleLink = styled(NavLink)`
  ${linkStyle}
  &.active {
    background-color: ${colors.surface};
  }
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  height: 48px;
  margin-bottom: 20px;
  padding: 5px;
  background-color: ${colors.primary};
`;
