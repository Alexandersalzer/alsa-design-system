'use client';

import { useEditingMode } from '../../../../cms/wrappers/editing';
import { usePathname, useRouter } from 'next/navigation';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { BrandLink, NavMenu, type NavMenuItem } from '../navbar';
import { 
  getNavigationContext, 
  useNavigationMessaging,
  type NavigationItem 
} from '../../../utils/navigation';
import { ArrowRightIcon } from 'lucide-react';

export interface NavItem extends NavigationItem {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
}

export interface KjNavbarProps {
  // Props that can be passed directly or extracted from components
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
  
  // Component data from CMS (from navbar.json structure)
  components?: Record<string, {
    type: string;
    content: string | { src: string; alt: string };
    slug?: string;
    config?: {
      href: string;
    };
  }>;
}

export const KjNavbar = ({ 
  brandName,
  brandHref,
  navItems = [],
  className,
  navVariant = 'ghost',
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoSrc,
  logoAlt,
  logoWidth = 32,
  logoHeight = 32,
  height = 'var(--navbar-height)',
  components = {}
}: KjNavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const pathname = usePathname();
  const router = useRouter();

  // Extract data from components if available
  const logoComponent = Object.values(components).find(comp => comp.type === 'logo');
  const titleComponent = Object.values(components).find(comp => comp.type === 'title');
  
  // Use component data as fallbacks
  const finalBrandName = brandName || (typeof titleComponent?.content === 'string' ? titleComponent.content : 'MARKETING SWEDEN');
  const finalBrandHref = brandHref || '/hem';
  const finalLogoSrc = logoSrc || (typeof logoComponent?.content === 'object' ? logoComponent.content.src : '/images/sections/kjlogo.jpg');
  const finalLogoAlt = logoAlt || (typeof logoComponent?.content === 'object' ? logoComponent.content.alt : 'KJ Marketing Logo');

  // Convert CMS components to nav items
  const cmsNavItems: NavItem[] = Object.values(components)
    .filter((component: any) => component.type === 'navItem')
    .map((component: any, index: number) => {
    // Extract slug with better fallback logic
    let slug = '';
    if (component.slug && component.slug.trim()) {
      slug = component.slug.trim();
    } else if (component.config?.href) {
      slug = component.config.href.replace('/', '').trim();
    }
    
    console.log('🧭 Processing CMS nav item:', {
      blockSlug: component.slug,
      blockHref: component.config?.href,
      extractedSlug: slug,
      content: component.content
    });

    const navItemsArray = Object.values(components).filter((c: any) => c.type === 'navItem');
    return {
      href: component.config?.href || `/${slug || ''}`,
      label: component.content || '',
      slug: slug || '',
      componentType: index === navItemsArray.length - 1 ? 'button' : 'textlink',
      textLinkVariant: 'primary',
      weight: 'medium',
      underline: 'hover',
      variant: 'accent',
      rightIcon: index === navItemsArray.length - 1 ? <ArrowRightIcon /> : undefined,
      size: navSize
    };
  });

  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isEditingMode, null);

  // Find the home page slug - use finalBrandHref as fallback
  const getHomeSlug = (): string => {
    return finalBrandHref.replace('/', '') || 'home';
  };

  // Use dynamic home slug instead of hardcoded brandHref prop
  const dynamicBrandHref = `/${getHomeSlug()}`;

  // Use CMS items if available, otherwise fallback to passed navItems
  const finalNavItems = cmsNavItems.length > 0 ? cmsNavItems : navItems;

  console.log('🧭 Navbar navigation context:', {
    isEditingMode,
    currentLocale: nav.currentLocale,
    pathname,
    cmsNavItemsCount: cmsNavItems.length,
    finalNavItemsCount: finalNavItems.length
  });

  // Setup navigation messaging (handles both parent→child and child→parent)
  const { handleNavigationClick, currentLocale } = useNavigationMessaging(
    router,
    pathname,
    isEditingMode,
    '🧭 Navbar',
    null
  );

  // Handle navigation clicks - unified for both nav items and brand
  const handleNavClick = (item: NavMenuItem) => {
    console.log('🧭 Nav item clicked:', {
      href: item.href,
      slug: item.slug,
      currentLocale,
      isEditingMode
    });
    handleNavigationClick(item.href, item.slug);
  };

  // Handle brand link click
  const handleBrandClick = () => {
    const brandSlug = getHomeSlug();
    const fullBrandHref = nav.buildBrandHref(dynamicBrandHref);
    
    console.log('🧭 Brand clicked:', {
      dynamicBrandHref,
      brandSlug,
      fullBrandHref,
      currentLocale,
      isEditingMode
    });
    
    handleNavigationClick(fullBrandHref, brandSlug);
  };

  // Transform NavItem[] to NavMenuItem[] with proper hrefs and active states
  const menuItems: NavMenuItem[] = finalNavItems.map(item => ({
    ...item,
    href: nav.buildNavHref(item),
    isActive: nav.isNavItemActive(item, pathname),
    variant: item.variant || navVariant,
    size: item.size || navSize,
    rightIcon: item.rightIcon,
    leftIcon: item.leftIcon,
    componentType: item.componentType,
    textLinkVariant: item.textLinkVariant,
    weight: item.weight,
    underline: item.underline
  }));

  return (
    <Box
      className={className}
      style={{
        width: '100%'
      }}
    >
      {/* Content constrained wrapper */}
      <Box
        style={{
          maxWidth: 'var(--width-content)',
          margin: '0 auto',
          padding: '0 var(--foundation-space-2)',
          width: '100%',
          height: height
        }}
      >
        <HStack 
          justify="between" 
          align="center" 
          spacing="md" 
          wrap={false}
        >
          <BrandLink 
            href={nav.buildBrandHref(finalBrandHref)}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            logoSrc={finalLogoSrc}
            logoAlt={finalLogoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
            onClick={handleBrandClick}
          >
            {finalBrandName}
          </BrandLink>
          
          <NavMenu 
            items={menuItems} 
            spacing="xl" 
            wrap={false}
            variant={navVariant}
            size={navSize}
            onLinkClick={handleNavClick}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default KjNavbar;