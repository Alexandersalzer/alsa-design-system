// ===============================================
// src/design-system/components/navigation/Tabs/Tabs.tsx
// Consolidated Tab + TabGroup component
// UPDATED: Adds optional animated TabPanel support via TabGroup props
// ===============================================

'use client';

import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import Link from 'next/link';
import { Label, TypographyWeight, TypographyColor } from '../../Typography';
import { Opacity } from '../../../components/animations/Opacity/Opacity';
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
 * - `segment`: Bordered pills with accent background (legacy, use pill instead)
 */
export type TabVariant = 'navigation' | 'page' | 'underline' | 'pill' | 'segment';
export type TabSize = 'sm' | 'md' | 'lg';

/**
 * Tab color scheme:
 * - `accent`: Uses accent colors for active state (text-accent, surface-accent-muted)
 * - `neutral`: Uses neutral colors for active state (text-primary, surface-raised)
 */
export type TabColorScheme = 'accent' | 'neutral';

interface BaseTabProps {
  children: ReactNode;
  /** NEW: stable identifier used by TabPanel + TabGroup active tracking */
  value?: string;
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

  /**
   * NEW: animates the active TabPanel content (fade-in) when tab changes.
   * Usage: <TabGroup animateContent> ... </TabGroup> + <TabPanel value="x">...</TabPanel>
   */
  animateContent?: boolean;

  /** NEW: duration for TabPanel fade animation (ms) */
  contentAnimationDuration?: number;

  /** NEW: delay for TabPanel fade animation (ms) */
  contentAnimationDelay?: number;
}

// ===============================================
// CONTEXT (for TabPanel)
// ===============================================

interface TabsContextValue {
  activeValue: string | null;
  animateContent: boolean;
  duration: number;
  delay: number;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  return useContext(TabsContext);
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
  value, // NEW (not rendered; used by TabGroup + TabPanel)
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
  const baseTypographyProps = createTabTypographyProps(
    variant,
    size,
    isActive,
    isDisabled,
    colorScheme
  );

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
  value?: string;
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

  // NEW
  animateContent = false,
  contentAnimationDuration = 180,
  contentAnimationDelay = 0,
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // NEW: derive active tab value from children (typed)
  const activeValue =
    React.Children.toArray(children)
      .filter((child): child is React.ReactElement<TabChildProps> =>
        React.isValidElement<TabChildProps>(child)
      )
      .find((child) => !!child.props.isActive)?.props.value ?? null;

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

  const contextValue: TabsContextValue = {
    activeValue,
    animateContent,
    duration: contentAnimationDuration,
    delay: contentAnimationDelay,
  };

  if (variant === 'navigation') {
    return (
      <TabsContext.Provider value={contextValue}>
        <nav
          ref={containerRef}
          className={cn(
            'tab-group',
            'tab-group--navigation',
            animated && 'tab-group--animated',
            className
          )}
          onKeyDown={handleKeyDown}
          role="navigation"
          aria-label="Main navigation"
        >
          {enhancedChildren}
        </nav>
      </TabsContext.Provider>
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
    animated &&
    orientation === 'horizontal' &&
    (variant === 'page' || variant === 'underline' || variant === 'segment');

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={classes}
        role="tablist"
        onKeyDown={handleKeyDown}
        aria-orientation={orientation}
      >
        {showIndicator && (
          <div
            className={`tab-group__indicator tab-group__indicator--${
              variant === 'underline' ? 'page' : variant
            }`}
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
    </TabsContext.Provider>
  );
};

// ===============================================
// TAB PANEL (NEW)
// Drives the "tabs content fade-in" behavior
// ===============================================

export interface TabPanelProps {
  /** Must match the Tab value */
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className = '' }) => {
  const ctx = useTabsContext();

  // If used outside TabGroup, render nothing to avoid confusing behavior
  if (!ctx) return null;

  const isActive = ctx.activeValue === value;

  // Only render active panel (keeps DOM clean and prevents flicker)
  if (!isActive) return null;

  // No animation requested -> render normally
  if (!ctx.animateContent) {
    return <div className={className}>{children}</div>;
  }

  // Animate on tab changes by keying to panel value
  return (
    <Opacity
      key={value}
      duration={ctx.duration}
      delay={ctx.delay}
      easing="ease-out"
      enableScrollTrigger={false}
      className={className}
    >
      {children}
    </Opacity>
  );
};

// Display names
Tab.displayName = 'Tab';
TabGroup.displayName = 'TabGroup';
TabPanel.displayName = 'TabPanel';
