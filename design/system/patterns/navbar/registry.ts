import { KjNavbar } from './KjNavbar/KjNavbar';

// Navbar patterns registry
export const navbarRegistry: Record<string, React.ComponentType<any>> = {
  kjNav: KjNavbar, // Map to 'kjNav' to match navbar.json type
};