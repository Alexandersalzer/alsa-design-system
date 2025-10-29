'use client';

import { useEditingMode } from '../../../../cms/wrappers/editing/EditingWrapper';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname, useRouter } from 'next/navigation';
import { Box } from '../../../components/layout/box/Box';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Button } from '../../../components/actions/Button/Button';
import { TextLink } from '../../../components/actions/TextLink/TextLink';
import { 
  getNavigationContext, 
  useNavigationMessaging,
  type NavigationItem 
} from '../../../utils/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { ContentBlock } from '../../../../cms/wrappers/content/types/content';

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
  maxWidth?: string;
  height?: string;
}

const Navbar = ({ 
  brandName = 'MARKETING SWEDEN',
  brandHref = '/home',
  navItems = [],
  className,
  navVariant = 'ghost',
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoSrc = '/images/sections/kjlogo.jpg',
  logoAlt = 'KJ Marketing Logo',
  logoWidth = 40,
  logoHeight = 40,
  maxWidth = '1280px',
  height = '5rem' // Increased from 4rem (64px) to 5rem (80px) for better spacing
}: NavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const { getGlobalComponent, getTemplateBlocks, getBlocksByType, content } = useContent();
  const pathname = usePathname();
  const router = useRouter();

  // Get navbar global component using generic function
  const navbarComponent = getGlobalComponent('navbar');
  
  // Get blocks from navbar pattern
  const navbarBlocks = getTemplateBlocks(navbarComponent, 'navbar');
  
  // Get nav items from blocks
  const navItemBlocks = getBlocksByType(navbarBlocks, 'navItem');

  // Convert CMS blocks to nav items with better slug handling
  const cmsNavItems: NavItem[] = navItemBlocks.map((block: ContentBlock, index: number) => {
    // Extract slug with better fallback logic
    let slug = '';
    if (block.slug && block.slug.trim()) {
      slug = block.slug.trim();
    } else if (block.config?.href) {
      slug = block.config.href.replace('/', '').trim();
    }
    
    console.log('🧭 Processing CMS nav item:', {
      blockSlug: block.slug,
      blockHref: block.config?.href,
      extractedSlug: slug,
      content: block.content
    });

    return {
      href: block.config?.href || `/${slug || ''}`,
      label: block.content || '',
      slug: slug || '',
      componentType: index === navItemBlocks.length - 1 ? 'button' : 'textlink', // Last item as button
      textLinkVariant: 'primary',
      weight: 'medium',
      underline: 'hover',
      variant: 'primary',
      rightIcon: index === navItemBlocks.length - 1 ? <ArrowRightIcon /> : undefined,
      size: navSize
    };
  });

  // Use navigation utilities for consistent route handling with CMS content
  const nav = getNavigationContext(pathname, isEditingMode, content);

  // Use CMS items if available, otherwise fallback to passed navItems
  const finalNavItems = cmsNavItems.length > 0 ? cmsNavItems : navItems;

  console.log('🧭 Navbar navigation context:', {
    isEditingMode,
    currentLocale: nav.currentLocale,
    pathname,
    cmsNavItemsCount: cmsNavItems.length,
    finalNavItemsCount: finalNavItems.length,
    hasContentMeta: !!content?.meta,
    contentLocale: content?.meta?.locale
  });

  // Setup navigation messaging (handles both parent→child and child→parent)
  const { handleNavigationClick, currentLocale } = useNavigationMessaging(
    router,
    pathname,
    isEditingMode,
    '🧭 Navbar',
    content // Pass CMS content for locale detection
  );

  // Handle brand link click
  const handleBrandClick = () => {
    const brandSlug = brandHref.replace('/', '') || 'home';
    const fullBrandHref = nav.buildBrandHref(brandHref);
    
    console.log('🧭 Brand clicked:', {
      originalHref: brandHref,
      brandSlug,
      fullBrandHref,
      currentLocale,
      isEditingMode
    });
    
    handleNavigationClick(fullBrandHref, brandSlug);
  };

  // Handle nav item clicks
  const handleNavItemClick = (item: NavItem) => {
    console.log('🧭 Nav item clicked:', {
      href: item.href,
      slug: item.slug,
      currentLocale,
      isEditingMode
    });
    
    // Check if this is a .html file (edit mode)
    const isHtmlFile = item.href.endsWith('.html');
    
    if (isHtmlFile) {
      // Navigate to .html file directly
      window.location.href = item.href;
    } else {
      // Use navigation messaging for internal routes
      handleNavigationClick(item.href, item.slug);
    }
  };

  return (
    <Box
      as="nav"
      className={className}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--primary-white)',
        borderBottom: '1px solid var(--border-light)',
        width: '100%',
        height: height
      }}
    >
      {/* Inner container with max width and full height */}
      <Box
        display="flex"
        align="center"
        style={{
          maxWidth: maxWidth,
          margin: '0 auto',
          padding: '0 var(--foundation-space-6)',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Main HStack - takes full height and centers content vertically */}
        <HStack 
          justify="between" 
          align="center" 
          spacing="xl"
        >
          {/* Brand Section */}
          <TextLink
            href={nav.buildBrandHref(brandHref)}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            onClick={handleBrandClick}
          >
            <HStack spacing="sm" align="center">
              {logoSrc && (
                <img 
                  src={logoSrc} 
                  alt={logoAlt}
                  width={logoWidth}
                  height={logoHeight}
                  style={{ 
                    objectFit: 'contain',
                    flexShrink: 0,
                    display: 'block'
                  }}
                />
              )}
              <span>{brandName}</span>
            </HStack>
          </TextLink>
          
          {/* Navigation Items */}
          <HStack spacing="lg" align="center" wrap={false}>
            {finalNavItems.map((item, index) => {
              const itemHref = nav.buildNavHref(item);
              const isActive = nav.isNavItemActive(item, pathname);
              const itemVariant = item.variant || navVariant;
              const itemSize = item.size || navSize;
              
              // Render as TextLink or Button based on componentType
              if (item.componentType === 'textlink') {
                const textLinkVariant = item.textLinkVariant || 'primary';
                const activeVariant = isActive ? 'accent' : textLinkVariant;
                
                return (
                  <TextLink
                    key={itemHref || index}
                    href={itemHref}
                    variant={activeVariant}
                    size={itemSize}
                    weight={item.weight || 'medium'}
                    underline={item.underline || 'hover'}
                    leftIcon={item.leftIcon}
                    rightIcon={item.rightIcon}
                    onClick={() => handleNavItemClick({ ...item, href: itemHref })}
                  >
                    {item.label}
                  </TextLink>
                );
              } else {
                // Button variant
                const buttonVariant = isActive ? 'secondary' : itemVariant;
                
                return (
                  <Button
                    key={itemHref || index}
                    variant={buttonVariant}
                    size={itemSize}
                    onClick={() => handleNavItemClick({ ...item, href: itemHref })}
                    leftIcon={item.leftIcon}
                    rightIcon={item.rightIcon}
                  >
                    {item.label}
                  </Button>
                );
              }
            })}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default Navbar;