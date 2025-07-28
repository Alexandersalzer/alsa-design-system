import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../primitives/Button';
import { TextLink } from '../../primitives/TextLink';
import { Cluster } from '../../../layout/utilities/cluster';

// ===== NAV LINK COMPONENT =====
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NavLink = ({ 
  href, 
  children, 
  className = '',
  isActive = false,
  onClick,
  variant = 'ghost',
  size = 'md'
}: NavLinkProps) => {
  // Use different variant for active state
  const buttonVariant = isActive ? 'secondary' : variant;

  return (
    <Link href={href} className={className}>
      <Button 
        variant={buttonVariant}
        size={size}
        onClick={onClick}
        className="w-full"
      >
        {children}
      </Button>
    </Link>
  );
};

// ===== NAV MENU COMPONENT =====
export interface NavMenuItem {
  href: string;
  label: string;
  slug?: string;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink'; // New property to choose component type
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand'; // TextLink specific variant
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'; // TextLink weight
  underline?: 'none' | 'hover' | 'always'; // TextLink underline
}

export interface NavMenuProps {
  items: NavMenuItem[];
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
  onLinkClick?: (item: NavMenuItem) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NavMenu = ({ 
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
    <Cluster spacing={spacing} wrap={wrap} className={className}>
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
    </Cluster>
  );
};

// ===== BRAND LINK COMPONENT =====
export interface BrandLinkProps {
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
}

export const BrandLink = ({ 
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
  underline = 'none'
}: BrandLinkProps) => {
  return (
    <TextLink
      href={href}
      variant={variant}
      size={size}
      weight={weight}
      underline={underline}
      className={className}
    >
      <Cluster spacing="sm" align="center" className="brand-cluster">
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="object-contain flex-shrink-0"
          />
        )}
        <span className="brand-text">{children}</span>
      </Cluster>
    </TextLink>
  );
};
