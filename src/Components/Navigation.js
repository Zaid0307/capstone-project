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
  color: black;
  width: 100%;
  &.active {
    background: #1a5276;
    color: white;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  background: #526b7a;
  color: white;
  height: 48px;
`;
