import { SectionBody } from './shared/sectionBody/SectionBody';
import { SpinningBanner } from './client/spinning-banner/SpinningBanner';
import { MediaPattern } from './client/media/MediaPattern';
import { FormPattern } from './forms/form';
import { KjFooter } from './footer/KjFooter';
import { KjNavbar } from './navbar/KjNavbar/KjNavbar';

// Mappa typ → komponent
export const patternRegistry: Record<string, React.ComponentType<any>> = {
  sectionBody: SectionBody,
  spinningLogos: SpinningBanner,
  media: MediaPattern,
  form: FormPattern,
  kj: KjFooter, // Map to 'kj' to match footer.json type
  kjNav: KjNavbar, // Map to 'kjNav' to match navbar.json type
};