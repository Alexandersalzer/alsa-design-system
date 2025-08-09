'use client';

import { useEditingMode } from '../../../../../cms/wrappers/editing/EditingWrapper';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname, useRouter } from 'next/navigation';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink, NavMenu, type NavMenuItem } from '../../../patterns/client/navbar';
import { 
  getNavigationContext, 
  useNavigationMessaging,
  type NavigationItem 
} from '../../../../utils/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { ContentBlock } from '../../../../../cms/wrappers/content/types/content';

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
  logoWidth = 32,
  logoHeight = 32
}: NavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const { getGlobalComponent, getTemplateBlocks, getBlocksByType } = useContent();
  const pathname = usePathname();
  const router = useRouter();

  // Get navbar global component using generic function
  const navbarComponent = getGlobalComponent('navbar');
  
  // Get blocks from navbar pattern
  const navbarBlocks = getTemplateBlocks(navbarComponent, 'navbar');
  
  // Get nav items from blocks
  const navItemBlocks = getBlocksByType(navbarBlocks, 'navItem');

  // Convert CMS blocks to nav items
  const cmsNavItems: NavItem[] = navItemBlocks.map((block: ContentBlock, index: number) => ({
    href: block.config?.href || `/${block.slug || ''}`,
    label: block.content || '',
    slug: block.slug || '',
    componentType: index === navItemBlocks.length - 1 ? 'button' : 'textlink', // Last item as button
    textLinkVariant: 'primary',
    weight: 'medium',
    underline: 'hover',
    variant: 'primary',
    rightIcon: index === navItemBlocks.length - 1 ? <ArrowRightIcon /> : undefined,
    size: navSize
  }));

  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isEditingMode);

  // Use CMS items if available, otherwise fallback to passed navItems
  const finalNavItems = cmsNavItems.length > 0 ? cmsNavItems : navItems;

  // Setup navigation messaging (handles both parent→child and child→parent)
  const { handleNavigationClick } = useNavigationMessaging(
    router,
    pathname,
    isEditingMode,
    '🧭 Navbar'
  );

  // Handle navigation clicks - unified for both nav items and brand
  const handleNavClick = (menuItem: NavMenuItem) => {
    // Find the original navigation item to pass complete data
    const originalItem = finalNavItems.find(item => item.href === menuItem.href || nav.buildNavHref(item) === menuItem.href);
    handleNavigationClick(menuItem.href, menuItem.slug, originalItem);
  };

  // Handle brand link click
  const handleBrandClick = () => {
    const brandSlug = brandHref.replace('/', '') || 'home';
    const fullBrandHref = nav.buildBrandHref(brandHref);
    
    // Create brand navigation item
    const brandItem: NavigationItem = {
      href: brandHref,
      slug: brandSlug
    };
    
    handleNavigationClick(fullBrandHref, brandSlug, brandItem);
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
    <Section 
      as="nav"
      style={{ backgroundColor: 'var(--primary-white)' }}
      sticky={true}
      top={0}
      zIndex={1000}
    >
      <Container maxWidth="lg">
        <Cluster justify="between" align="center" className="h-16">
          <BrandLink 
            href={nav.buildBrandHref(brandHref)}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
            onClick={handleBrandClick}
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
            onLinkClick={handleNavClick}
          />
        </Cluster>
      </Container>
    </Section>
  );
};

export default Navbar; 