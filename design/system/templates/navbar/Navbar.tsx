'use client';

import { Section } from '../../components/frames/section';
import { Container } from '../../components/frames/container';
import { KjNavbar, type NavItem } from '../../patterns/client/KjNavbar';

interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  navItems?: NavItem[];
  className?: string;
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  navSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  brandSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  height?: string;
  // Add prop for navbar data
  section?: {
    navbar_fjVaWmY?: {
      type: string;
      pattern?: {
        navbar_fjVaWmY?: {
          type: string;
          components?: Record<string, {
            type: string;
            content: string;
            slug: string;
            config?: {
              href: string;
            };
          }>;
        };
      };
    };
  };
}

const Navbar = ({ 
  brandName,
  brandHref,
  navItems,
  className,
  navVariant,
  navSize,
  brandVariant,
  brandSize,
  brandWeight,
  brandUnderline,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  height,
  section
}: NavbarProps) => {
  // Extract navbar data from props
  const navbarPattern = section?.navbar_fjVaWmY?.pattern?.navbar_fjVaWmY;
  const components = navbarPattern?.components || {};

  return (
    <Section
      as="nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--primary-white)',
        borderBottom: '1px solid var(--border-light)',
        paddingTop: '0',
        paddingBottom: '0',
        height: height || 'var(--navbar-height)'
      }}
    >
      <Container
        align="center"
        height="auto"
      >
        <KjNavbar
          brandName={brandName}
          brandHref={brandHref}
          navItems={navItems}
          className={className}
          navVariant={navVariant}
          navSize={navSize}
          brandVariant={brandVariant}
          brandSize={brandSize}
          brandWeight={brandWeight}
          brandUnderline={brandUnderline}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          logoWidth={logoWidth}
          logoHeight={logoHeight}
          height={height}
          components={components}
        />
      </Container>
    </Section>
  );
};

export default Navbar;