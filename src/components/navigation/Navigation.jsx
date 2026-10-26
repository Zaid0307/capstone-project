import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { BiDumbbell } from 'react-icons/bi';
import { MdFormatAlignJustify } from 'react-icons/md';
import { ImHome } from 'react-icons/im';
import LanguageSwitch from './LanguageSwitch';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';

export default function Navigation() {
  const { t } = useTranslation();

  return (
    <Nav>
      <NavItem to={routes.newPlan} aria-label={t('nav.createPlan')}>
        <MdFormatAlignJustify size={40} />
      </NavItem>
      <NavItem to={routes.exercises} aria-label={t('nav.exercises')}>
        <ImHome size={40} />
      </NavItem>
      <NavItem to={routes.plans} end aria-label={t('nav.workoutPlans')}>
        <BiDumbbell size={40} />
      </NavItem>
      <LanguageSwitch />
    </Nav>
  );
}

const NavItem = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: ${colors.surface};
  text-decoration: none;
  &.active {
    margin: 5px;
    border-radius: ${radii.large};
    background: ${colors.surface};
    color: ${colors.primary};
  }
`;

const Nav = styled.nav`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  height: 48px;
  border-top: 1px solid ${colors.surface};
  background: ${colors.primary};
  color: white;
`;
