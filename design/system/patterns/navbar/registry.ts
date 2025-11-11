import NavbarBar from './NavbarBar/NavbarBar';
import NavbarPill from './NavbarPill/NavbarPill';

export const navbarRegistry: Record<string, any> = {
  navbar: NavbarBar,
  navbar_bar: NavbarBar,
  navbar_pill: NavbarPill,

  'navbar-bar': NavbarBar,
  'navbar-pill': NavbarPill,
  bar: NavbarBar,
  pill: NavbarPill,
};
