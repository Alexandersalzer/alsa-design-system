import NavbarBar from './NavbarBar/NavbarBar';
import NavbarPill from './NavbarPill/NavbarPill';
import NavbarCenterPill from './NavbarCenterPill/NavbarCenterPill';

export const navbarRegistry: Record<string, any> = {
  navbar: NavbarBar,
  navbar_bar: NavbarBar,
  navbar_pill: NavbarPill,
  navbar_center_pill: NavbarCenterPill,

  'navbar-bar': NavbarBar,
  'navbar-pill': NavbarPill,
  'navbar-center-pill': NavbarCenterPill,
  bar: NavbarBar,
  pill: NavbarPill,
  'center-pill': NavbarCenterPill,
  centerPill: NavbarCenterPill,
};
