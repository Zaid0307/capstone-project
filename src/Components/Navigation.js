import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { BiDumbbell } from 'react-icons/bi';
import { MdFormatAlignJustify } from 'react-icons/md';

export default function Navigation() {
  return (
    <Nav>
      <LinkStyled to="/">
        <MdFormatAlignJustify size={40} />
      </LinkStyled>
      <LinkStyled to="/Workoutplans">
        <BiDumbbell size={40} />
      </LinkStyled>
    </Nav>
  );
}

const LinkStyled = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #283a45;
  width: 100%;
  &.active {
    background: #283a45;
    color: #6fa0a6;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  background: #496b73;
  color: white;
  height: 48px;
`;
