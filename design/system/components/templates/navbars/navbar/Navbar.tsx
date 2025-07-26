'use client';

import { usePathname } from 'next/navigation';
import { useToggle } from '../../../../../cms-modules/context/ToggleContext';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink , NavMenu, NavMenuItem} from '../../../patterns';
export interface NavItem {
  href: string;
  label: string;
  slug?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink'; // New property to choose component type
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand'; // TextLink specific variant
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'; // TextLink weight
  underline?: 'none' | 'hover' | 'always'; // TextLink underline
}

export interface NavbarProps {
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
}

const Navbar = ({ 
  brandName = 'Blimpifyco',
  brandHref = '/',
  navItems = [],
  className,
  navVariant = 'ghost',
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 40,
  logoHeight = 40
}: NavbarProps) => {
  const { isToggled } = useToggle();
  const pathname = usePathname();
  
  // Extract current locale from pathname (e.g., "/sv/home" -> "sv")
  const currentLocale = pathname.split('/')[1] || 'sv';

  const getBrandHref = () => {
    if (isToggled) return `/${brandHref.replace('/', '')}.html`;
    return `/${currentLocale}${brandHref}`;
  };

  const getNavHref = (item: NavItem) => {
    if (isToggled) return `/${item.slug || item.href.replace('/', '')}.html`;
    return `/${currentLocale}${item.href}`;
  };

  // Transform NavItem[] to NavMenuItem[] with proper hrefs and individual variants
  const menuItems: NavMenuItem[] = navItems.map(item => ({
    ...item,
    href: getNavHref(item),
    isActive: pathname === getNavHref(item),
    variant: item.variant || navVariant, // Use individual variant or fallback to global
    size: item.size || navSize, // Use individual size or fallback to global
    rightIcon: item.rightIcon,
    leftIcon: item.leftIcon,
    componentType: item.componentType, // Pass through component type
    textLinkVariant: item.textLinkVariant, // Pass through TextLink variant
    weight: item.weight, // Pass through TextLink weight
    underline: item.underline // Pass through TextLink underline
  }));

  return (
    <Section 
      as="nav" 
      className={`shadow-md ${className || ''}`}
      style={{ backgroundColor: 'var(--primary-white)' }}
      sticky={true}
      top={0}
      zIndex={1000}
    >
      <Container maxWidth="lg">
        <Cluster justify="between" align="center" className="h-16">
          <BrandLink 
            href={getBrandHref()}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
          >
            {brandName}
          </BrandLink>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          <NavMenu 
            items={menuItems} 
            spacing="xl" 
            wrap={false}
            variant={navVariant}
            size={navSize}
          />
        </Cluster>
      </Container>
    </Section>
  );
};

export default Navbar; 