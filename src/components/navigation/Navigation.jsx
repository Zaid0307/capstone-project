import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { BiBarChartAlt2, BiCalendar, BiDumbbell, BiHomeAlt, BiListUl, BiUserCircle } from 'react-icons/bi';
import {
  colors,
  fontSizes,
  fontWeights,
  motion,
  radii,
  shadows,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';
import { useIsGuest } from '../../auth/useAccess';

// Bottom navigation with five areas; language and figure are in the settings.
// Without an account only plans, exercises and the sign-in are shown.
// NavLink marks the current page with aria-current="page".
export default function Navigation() {
  const { t } = useTranslation();
  const isGuest = useIsGuest();

  if (isGuest) {
    return (
      <Nav aria-label={t('nav.label')}>
        <NavItem to={routes.plans}>
          <BiListUl aria-hidden="true" />
          <span>{t('nav.plans')}</span>
        </NavItem>
        <NavItem to={routes.exercises}>
          <BiDumbbell aria-hidden="true" />
          <span>{t('nav.exercises')}</span>
        </NavItem>
        <NavItem to={routes.account}>
          <BiUserCircle aria-hidden="true" />
          <span>{t('account.navSignIn')}</span>
        </NavItem>
      </Nav>
    );
  }

  return (
    <Nav aria-label={t('nav.label')}>
      <NavItem to={routes.today}>
        <BiHomeAlt aria-hidden="true" />
        <span>{t('nav.today')}</span>
      </NavItem>
      <NavItem to={routes.calendar}>
        <BiCalendar aria-hidden="true" />
        <span>{t('nav.calendar')}</span>
      </NavItem>
      <NavItem to={routes.plans}>
        <BiListUl aria-hidden="true" />
        <span>{t('nav.plans')}</span>
      </NavItem>
      <NavItem to={routes.analysis}>
        <BiBarChartAlt2 aria-hidden="true" />
        <span>{t('nav.analysis')}</span>
      </NavItem>
      <NavItem to={routes.exercises}>
        <BiDumbbell aria-hidden="true" />
        <span>{t('nav.exercises')}</span>
      </NavItem>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: ${space.xs};
  min-height: ${sizes.navigationHeight};
  padding: ${space.xs} ${space.sm} calc(${space.xs} + env(safe-area-inset-bottom, 0px));
  background-color: ${colors.surface};
  box-shadow: ${shadows.navigation};
`;

const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 56px;
  padding: ${space.xs};
  border-radius: ${radii.small};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  text-align: center;
  text-decoration: none;
  transition: background-color ${motion.fast};
  svg {
    font-size: 1.5rem;
  }
  &:hover {
    background-color: ${colors.surfaceMuted};
  }
  &[aria-current='page'] {
    background-color: ${colors.highlight};
    font-weight: ${fontWeights.medium};
  }
  /* A bar on top marks the current page without relying on color alone. */
  &[aria-current='page']::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 3px;
    border-radius: ${radii.pill};
    background-color: ${colors.primary};
  }
`;
