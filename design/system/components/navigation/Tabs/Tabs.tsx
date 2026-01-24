// ===============================================
// src/design-system/components/navigation/Tabs/Tabs.tsx
// Consolidated Tab + TabGroup component
// ===============================================

'use client';

import React, { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Label, TypographyWeight, TypographyColor } from '../../Typography';
import { cn } from '../../../utils/cn';

// ===============================================
// TYPES
// ===============================================

/**
 * Tab variants:
 * - `navigation`: Sidebar/vertical navigation with accent background on active
 * - `page`: Underline + accent-muted background on active (default page tabs)
 * - `underline`: Underline + accent text on active, no background
 * - `pill`: Accent background on active, no underline (compact pills)
 * - `soft`: Like pill - accent-muted background on active, no underline
 * - `segment`: Bordered pills with accent background (legacy, use pill instead)
 */
export type TabVariant = 'navigation' | 'page' | 'underline' | 'pill' | 'soft' | 'segment';
export type TabSize = 'sm' | 'md' | 'lg';

/**
 * Tab color scheme:
 * - `accent`: Uses accent colors for active state (text-accent, surface-accent-muted)
 * - `neutral`: Uses neutral colors for active state (text-primary, surface-raised)
 */
export type TabColorScheme = 'accent' | 'neutral';

interface BaseTabProps {
  children: ReactNode;
  variant?: TabVariant;
  size?: TabSize;
  colorScheme?: TabColorScheme;
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

export interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  colorScheme?: TabColorScheme;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  animated?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

// ===============================================
// TYPOGRAPHY HELPERS
// ===============================================

type LabelSize = 'xs' | 'sm' | 'md' | 'lg';

interface TabTypographyProps {
  size: LabelSize;
  weight: TypographyWeight;
  color: TypographyColor;
}

function createTabTypographyProps(
  variant: TabVariant,
  size: TabSize,
  isActive: boolean,
  isDisabled: boolean,
  colorScheme: TabColorScheme = 'accent'
): TabTypographyProps {
  const sizeMap: Record<TabSize, LabelSize> = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  };

  const getColor = (): TypographyColor => {
    if (isDisabled) return 'disabled';
    if (isActive) {
      // Accent colorScheme uses accent color, neutral uses primary
      return colorScheme === 'accent' ? 'accent' : 'primary';
    }
    return 'secondary';
  };

  const getWeight = (): TypographyWeight => {
    if (variant === 'navigation') {
      return isActive ? 'bold' : 'semibold';
    }
    return isActive ? 'semibold' : 'medium';
  };

  return {
    size: sizeMap[size],
    weight: getWeight(),
    color: getColor(),
  };
}

// ===============================================
// TAB COMPONENT
// ===============================================

export const Tab: React.FC<TabProps> = ({
  children,
  variant = 'navigation',
  size = 'md',
  colorScheme = 'accent',
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
  const baseTypographyProps = createTabTypographyProps(variant, size, isActive, isDisabled, colorScheme);

  const getWeight = (): TypographyWeight => {
    if (fontWeight) return fontWeight;
    if (variant === 'navigation') {
      return isActive ? 'bold' : 'semibold';
    }
    return baseTypographyProps.weight;
  };

  const finalTypographyProps = {
    ...baseTypographyProps,
    weight: getWeight(),
  };

  const getClasses = () => {
    if (variant === 'navigation') {
      return cn(
        'tab',
        'tab--navigation',
        `tab--color-${colorScheme}`,
        useHeadingFont && 'tab--heading-font',
        isActive && 'tab--active',
        isDisabled && 'tab--disabled',
        className
      );
    }

    return cn(
      'tab',
      `tab--${variant}`,
      `tab--color-${colorScheme}`,
      size !== 'md' && `tab--${size}`,
      useHeadingFont && 'tab--heading-font',
      isActive && 'tab--active',
      isDisabled && 'tab--disabled',
      className
    );
  };

  const getContent = () => (
    <>
      {icon && <span className="tab__icon">{icon}</span>}
      <Label
        size={finalTypographyProps.size}
        weight={finalTypographyProps.weight}
        color={finalTypographyProps.color}
        as="span"
        className={cn('tab__label', useHeadingFont && 'tab__label--heading-font')}
      >
        {children}
      </Label>
      {badge && <span className="tab__badge">{badge}</span>}
    </>
  );

  const getAccessibilityProps = () => {
    const props: Record<string, unknown> = {
      tabIndex: tabIndex ?? (isDisabled ? -1 : 0),
      onFocus,
      role: role ?? (variant !== 'navigation' ? 'tab' : undefined),
      'aria-selected': ariaSelected ?? (variant !== 'navigation' ? isActive : undefined),
      'aria-disabled': isDisabled,
      style,
    };

    // Remove undefined values
    Object.keys(props).forEach((key) => {
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

// ===============================================
// TAB GROUP COMPONENT
// ===============================================

interface TabChildProps {
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  colorScheme?: TabColorScheme;
  tabIndex?: number;
  onFocus?: (e: React.FocusEvent) => void;
  [key: string]: unknown;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  children,
  variant = 'navigation',
  colorScheme = 'accent',
  orientation = 'horizontal',
  className = '',
  animated = true,
  justify = 'start',
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (variant !== 'navigation') return;

      const container = containerRef.current;
      if (!container) return;

      const tabItems = Array.from(
        container.querySelectorAll('.tab:not(.tab--disabled)')
      ) as HTMLElement[];
      if (tabItems.length === 0) return;

      const currentIndex = tabItems.findIndex((item) => item === document.activeElement);
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (currentIndex + 1) % tabItems.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (currentIndex - 1 + tabItems.length) % tabItems.length;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = tabItems.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const focusedItem = tabItems[currentIndex];
          if (focusedItem) {
            focusedItem.click();
          }
          break;
      }

      if (newIndex !== currentIndex && tabItems[newIndex]) {
        setFocusedIndex(newIndex);
        tabItems[newIndex].focus();
      }
    },
    [variant]
  );

  useEffect(() => {
    if (!animated || variant === 'navigation' || orientation === 'vertical') return;

    let rafId: number | null = null;
    let lastWidth = 0;
    let lastLeft = 0;

    const updateIndicator = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeTab = container.querySelector(
          '.tab--active, .active, [aria-selected="true"]'
        ) as HTMLElement;

        if (activeTab) {
          const containerRect = container.getBoundingClientRect();
          const tabRect = activeTab.getBoundingClientRect();
          const newWidth = tabRect.width;
          const newLeft = tabRect.left - containerRect.left;

          if (newWidth !== lastWidth || newLeft !== lastLeft) {
            lastWidth = newWidth;
            lastLeft = newLeft;
            setIndicatorStyle({
              width: newWidth,
              left: newLeft,
            });
          }
        }
      });
    };

    updateIndicator();

    const observer = new MutationObserver((mutations) => {
      const hasRelevantChange = mutations.some(
        (mutation) =>
          (mutation.type === 'attributes' &&
            (mutation.attributeName === 'class' || mutation.attributeName === 'aria-selected')) ||
          mutation.type === 'childList'
      );

      if (hasRelevantChange) {
        updateIndicator();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected'],
      });
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [animated, variant, orientation]);

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabChildProps>(child)) {
      const childProps = child.props as TabChildProps;

      const enhancedProps: Partial<TabChildProps> = {
        ...childProps,
        className: cn(childProps.className, animated && 'tab--animated'),
        colorScheme: childProps.colorScheme ?? colorScheme,
      };

      if (variant === 'navigation') {
        enhancedProps.tabIndex = index === focusedIndex ? 0 : -1;
        enhancedProps.onFocus = () => setFocusedIndex(index);
      }

      return React.cloneElement(child, enhancedProps);
    }
    return child;
  });

  if (variant === 'navigation') {
    return (
      <nav
        ref={containerRef}
        className={cn('tab-group', 'tab-group--navigation', animated && 'tab-group--animated', className)}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation"
      >
        {enhancedChildren}
      </nav>
    );
  }

  const classes = cn(
    'tab-group',
    `tab-group--${variant}`,
    `tab-group--${orientation}`,
    `tab-group--justify-${justify}`,
    animated && 'tab-group--animated',
    className
  );

  const showIndicator =
    animated && orientation === 'horizontal' && (variant === 'page' || variant === 'underline' || variant === 'segment');

  return (
    <div
      ref={containerRef}
      className={classes}
      role="tablist"
      onKeyDown={handleKeyDown}
      aria-orientation={orientation}
    >
      {showIndicator && (
        <div
          className={`tab-group__indicator tab-group__indicator--${variant === 'underline' ? 'page' : variant}`}
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
            opacity: indicatorStyle.width > 0 ? 1 : 0,
          }}
          aria-hidden="true"
        />
      )}
      {enhancedChildren}
    </div>
  );
};

// ===============================================
// TAB PANEL COMPONENT (Content wrapper with fade animation)
// ===============================================

export interface TabPanelProps {
  children: ReactNode;
  /** Unique key for the tab - changing this triggers the fade animation */
  tabKey?: string | number;
  /** Custom className */
  className?: string;
  /** Animation duration in ms (default: 150) */
  animationDuration?: number;
  /** Disable animation */
  animated?: boolean;
  /** Role for accessibility (default: tabpanel) */
  role?: string;
  /** aria-labelledby for accessibility */
  'aria-labelledby'?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  tabKey,
  className = '',
  animationDuration = 150,
  animated = true,
  role = 'tabpanel',
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedKey, setDisplayedKey] = useState(tabKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (tabKey !== displayedKey) {
      if (animated) {
        setIsAnimating(true);
        // Small delay to allow fade-out, then update content
        const timeout = setTimeout(() => {
          setDisplayedKey(tabKey);
          setDisplayedChildren(children);
          setIsAnimating(false);
        }, animationDuration / 2);
        return () => clearTimeout(timeout);
      } else {
        setDisplayedKey(tabKey);
        setDisplayedChildren(children);
      }
    } else {
      // Same key but children might have changed
      setDisplayedChildren(children);
    }
  }, [tabKey, children, displayedKey, animated, animationDuration]);

  const classes = cn(
    'tab-panel',
    animated && 'tab-panel--animated',
    isAnimating && 'tab-panel--animating',
    className
  );

  const style: React.CSSProperties = animated
    ? { '--tab-panel-duration': `${animationDuration}ms` } as React.CSSProperties
    : {};

  return (
    <div
      className={classes}
      role={role}
      aria-labelledby={ariaLabelledBy}
      style={style}
    >
      {displayedChildren}
    </div>
  );
};

// Display names
Tab.displayName = 'Tab';
TabGroup.displayName = 'TabGroup';
TabPanel.displayName = 'TabPanel';
