import { KjNavbar } from './KjNavbar/KjNavbar';
import { Navbar } from './Navbar/Navbar';

// Navbar patterns registry
export const navbarRegistry: Record<string, React.ComponentType<any>> = {
  kjNav: KjNavbar,    // Legacy client-specific navbar
  navbar: Navbar,     // ← Universal navbar pattern (ONLY THIS!)
};