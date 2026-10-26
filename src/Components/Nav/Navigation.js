import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { BiDumbbell } from 'react-icons/bi';
import { MdFormatAlignJustify } from 'react-icons/md';
import { ImHome } from 'react-icons/im';
import { useTranslation } from '../../i18n/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

export default function Navigation() {
  const { t } = useTranslation();

  return (
    <Nav>
      <LinkStyled to="/Create_Plan" aria-label={t('nav.createPlan')}>
        <MdFormatAlignJustify size={40} />
      </LinkStyled>
      <LinkStyled to="/home" aria-label={t('nav.exercises')}>
        <ImHome size={40} />
      </LinkStyled>
      <LinkStyled to="/Workoutplans" aria-label={t('nav.workoutPlans')}>
        <BiDumbbell size={40} />
      </LinkStyled>
      <LanguageSwitch />
    </Nav>
  );
}

const LinkStyled = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #d5dee8;
  width: 100%;
  &.active {
    background: #d5dee8;
    color: #496b73;
    border-radius: 15px;
    margin: 5px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  background: #496b73;
  color: white;
  height: 48px;
  position: sticky;
  bottom: 0;
  border-top: 1px solid #d5dee8;
`;
