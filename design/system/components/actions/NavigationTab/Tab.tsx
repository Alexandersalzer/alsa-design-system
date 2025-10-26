// ===============================================
// src/design-system/components/primitives/Tab/Tab.tsx
// ENHANCED VERSION - Customizable Typography with Bolder Navigation
// ===============================================

import React from 'react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Label, createTabTypographyProps, TypographyWeight } from '../../Typography';

export type TabVariant = 'navigation' | 'page' | 'segment';
export type TabSize = 'sm' | 'md' | 'lg';

interface BaseTabProps {
  children: ReactNode;
  variant?: TabVariant;
  size?: TabSize;
  isActive?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  fontWeight?: TypographyWeight;
  useHeadingFont?: boolean;
  tabIndex?: number;
  onFocus?: (e: React.FocusEvent) => void;
  role?: string;
  'aria-selected'?: boolean;
  style?: React.CSSProperties;
}

interface LinkTabProps extends BaseTabProps {
  href: string;
  onClick?: never;
}

interface ButtonTabProps extends BaseTabProps {
  href?: never;
  onClick: () => void;
}

export type TabProps = LinkTabProps | ButtonTabProps;

export const Tab: React.FC<TabProps> = ({
  children,
  variant = 'navigation',
  size = 'md',
  isActive = false,
  isDisabled = false,
  icon,
  badge,
  className = '',
  href,
  onClick,
  fontWeight,
  useHeadingFont = variant === 'navigation',
  tabIndex,
  onFocus,
  role,
  'aria-selected': ariaSelected,
  style,
  ...rest
}) => {
  const baseTypographyProps = createTabTypographyProps(variant, size, isActive, isDisabled);
  
  const getWeight = (): TypographyWeight => {
    if (fontWeight) return fontWeight;
    
    if (variant === 'navigation') {
      return isActive ? 'bold' : 'semibold';
    }
    
    return baseTypographyProps.weight;
  };

  const finalTypographyProps = {
    ...baseTypographyProps,
    weight: getWeight()
  };

  const getClasses = () => {
    if (variant === 'navigation') {
      return [
        'nav-item',
        useHeadingFont && 'nav-item--heading-font',
        isActive && 'nav-item--selected',
        isDisabled && 'nav-item--disabled',
        className
      ].filter(Boolean).join(' ');
    }

    return [
      'tab',
      `tab--${variant}`,
      size !== 'md' && `tab--${size}`,
      useHeadingFont && 'tab--heading-font',
      isActive && 'tab--active',
      isDisabled && 'tab--disabled',
      className
    ].filter(Boolean).join(' ');
  };

  const getContent = () => {
    if (variant === 'navigation') {
      return (
        <>
          {icon && <div className="nav-item__icon">{icon}</div>}
          <Label
            size={finalTypographyProps.size}
            weight={finalTypographyProps.weight}
            color={finalTypographyProps.color}
            as="span"
            className={`nav-item__label ${useHeadingFont ? 'nav-item__label--heading-font' : ''}`}
          >
            {children}
          </Label>
          {badge && <div className="nav-item__action-icon">{badge}</div>}
        </>
      );
    }

    return (
      <>
        {icon && <span className="tab__icon">{icon}</span>}
        <Label
          size={finalTypographyProps.size}
          weight={finalTypographyProps.weight}
          color={finalTypographyProps.color}
          as="span"
          className={`tab__label ${useHeadingFont ? 'tab__label--heading-font' : ''}`}
        >
          {children}
        </Label>
        {badge && <span className="tab__badge">{badge}</span>}
      </>
    );
  };

  const getAccessibilityProps = () => {
    const props: any = {
      tabIndex: tabIndex ?? (isDisabled ? -1 : 0),
      onFocus,
      role: role ?? (variant !== 'navigation' ? 'tab' : undefined),
      'aria-selected': ariaSelected ?? (variant !== 'navigation' ? isActive : undefined),
      'aria-disabled': isDisabled,
      style
    };

    // Remove undefined values
    Object.keys(props).forEach(key => {
      if (props[key] === undefined) {
        delete props[key];
      }
    });

    return props;
  };

  const classes = getClasses();
  const content = getContent();
  const accessibilityProps = getAccessibilityProps();

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} {...accessibilityProps} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      type="button"
      {...accessibilityProps}
      {...rest}
    >
      {content}
    </button>
  );
};
