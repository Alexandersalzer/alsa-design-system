import { Navbar } from './Navbar';
import { NavbarBar } from './NavbarBar';
import { NavbarPill } from './NavbarPill';

export const navbarRegistry = {
  navbar: Navbar,        // base if you ever want direct simple use
  navbar_bar: NavbarBar, // variant
  navbar_pill: NavbarPill, // variant
};
