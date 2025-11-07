'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEditingMode } from '../../../../cms/wrappers/editing';
import { usePathname } from 'next/navigation';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Button } from '../../../components';
import { TextLink } from '../../../components';
import { 
  getNavigationContext, 
  useNavigationMessaging,
  type NavigationItem 
} from '../../../utils/navigation';
import { ArrowRightIcon } from 'lucide-react';

// ===== NAV MENU INTERFACES & COMPONENTS =====
export interface NavMenuItem {
  href: string;
  label: string;
  slug?: string;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
}

interface NavMenuProps {
  items: NavMenuItem[];
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
  onLinkClick?: (item: NavMenuItem) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const NavMenu = ({ 
  items, 
  spacing = 'sm', 
  wrap = false,
  className = '',
  onLinkClick,
  variant = 'ghost',
  size = 'md'
}: NavMenuProps) => {
  const router = useRouter();

  const handleItemClick = (item: NavMenuItem) => {
    // Check if this is a .html file (edit mode)
    const isHtmlFile = item.href.endsWith('.html');
    
    if (isHtmlFile) {
      // Navigate to .html file directly
      window.location.href = item.href;
    } else {
      // Use Next.js router for internal navigation
      router.push(item.href);
    }
    
    // Call optional click handler
    onLinkClick?.(item);
  };

  return (
    <HStack spacing={spacing} wrap={wrap} className={className} align='center'>
      {items.map((item, index) => {
        // Use individual item variant/size or fallback to global defaults
        const itemVariant = item.variant || variant;
        const itemSize = item.size || size;
        
        // Check if this should be a TextLink or Button
        if (item.componentType === 'textlink') {
          // Render as TextLink (it handles .html vs regular routes internally)
          const textLinkVariant = item.textLinkVariant || 'primary';
          const activeVariant = item.isActive ? 'accent' : textLinkVariant;
          
          return (
            <TextLink
              key={item.href || index}
              href={item.href}
              variant={activeVariant}
              size={itemSize}
              weight={item.weight || 'medium'}
              underline={item.underline || 'hover'}
              onClick={() => onLinkClick?.(item)}
              leftIcon={item.leftIcon}
              rightIcon={item.rightIcon}
            >
              {item.label}
            </TextLink>
          );
        } else {
          // Render as Button (default behavior)
          const buttonVariant = item.isActive ? 'secondary' : itemVariant;
          
          return (
            <Button
              key={item.href || index}
              variant={buttonVariant}
              size={itemSize}
              onClick={() => handleItemClick(item)}
              rightIcon={item.rightIcon}
              leftIcon={item.leftIcon}
            >
              {item.label}
            </Button>
          );
        }
      })}
    </HStack>
  );
};

// ===== BRAND LINK COMPONENT =====
interface BrandLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  underline?: 'none' | 'hover' | 'always';
  onClick?: () => void;
}

const BrandLink = ({ 
  href, 
  children, 
  className = '',
  variant = 'brand',
  size = 'lg',
  weight = 'bold',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 40,
  logoHeight = 40,
  underline = 'none',
  onClick
}: BrandLinkProps) => {
  return (
    <TextLink
      href={href}
      variant={variant}
      size={size}
      weight={weight}
      underline={underline}
      className={className}
      onClick={onClick}
    >
      <HStack align="center">
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="object-contain flex-shrink-0"
            style={{ display: 'component' }}
          />
        )}
        <span className="brand-text" style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
      </HStack>
    </TextLink>
  );
};

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
  logoEndpoint?: string; // Only the endpoint part, base URL is hardcoded
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
  logoEndpoint,
  logoAlt,
  logoWidth = 32,
  logoHeight = 32,
  height = 'var(--navbar-height)',
  components = {}
}: KjNavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const pathname = usePathname();
  const router = useRouter();

  // Hardcoded S3 base URL
  const S3_BASE_URL_MEMBERS = 'https://cdn.blimpify-im.com/members';

  // Extract data from components if available
  const logoComponent = Object.values(components).find(comp => comp.type === 'logo');
  const titleComponent = Object.values(components).find(comp => comp.type === 'title');
  
  // Extract logo endpoint from components or props
  let logoEndpointFromComponent = '';
  if (typeof logoComponent?.content === 'object' && logoComponent.content.src) {
    // Extract only the endpoint part if it's a full URL, otherwise use as is
    const logoSrc = logoComponent.content.src;
    if (logoSrc.startsWith('https://cdn.blimpify-im.com/members/')) {
      logoEndpointFromComponent = logoSrc.replace('https://cdn.blimpify-im.com/members/', '');
    } else if (logoSrc.startsWith('/')) {
      logoEndpointFromComponent = logoSrc.substring(1); // Remove leading slash
    } else {
      logoEndpointFromComponent = logoSrc;
    }
  }

  // Use component data as fallbacks, no hardcoded fallbacks
  const finalBrandName = brandName || (typeof titleComponent?.content === 'string' ? titleComponent.content : undefined);
  const finalBrandHref = brandHref || '/';
  const finalLogoEndpoint = logoEndpoint || logoEndpointFromComponent;
  const finalLogoSrc = finalLogoEndpoint ? `${S3_BASE_URL_MEMBERS}/${finalLogoEndpoint}` : undefined;
  const finalLogoAlt = logoAlt || (typeof logoComponent?.content === 'object' ? logoComponent.content.alt : undefined);

  console.log('🖼️ Logo processing:', {
    logoEndpointProp: logoEndpoint,
    logoEndpointFromComponent,
    finalLogoEndpoint,
    finalLogoSrc,
    logoComponentContent: logoComponent?.content
  });

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