// ===============================================
// src/design-system/components/navigation/Tabs/Tabs.tsx
// Consolidated Tab + TabGroup + TabPanels (animated content)
// ===============================================

'use client';

import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
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

  /**
   * Optional value identifier (useful when pairing Tab with TabPanels)
   * Not required if you control active state via `isActive`.
   */
  value?: string;
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
// TAB PANELS (CONTENT ANIMATION)
// ===============================================

export type TabPanelsAnimation = 'none' | 'fade' | 'fade-slide';

export interface TabPanelProps {
  /** Must match the active value passed to TabPanels */
  value: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Marker component used inside TabPanels.
 * It does not render anything by itself; TabPanels will render the active panel.
 */
export const TabPanel: React.FC<TabPanelProps> = () => null;

TabPanel.displayName = 'TabPanel';

export interface TabPanelsProps {
  /** Active panel value */
  value: string;

  /** TabPanel children */
  children: ReactNode;

  /** Enable/disable content animation (default: true) */
  animated?: boolean;

  /** Animation type (default: 'fade-slide') */
  animation?: TabPanelsAnimation;

  /** Animation duration in ms (default: 220) */
  duration?: number;

  /**
   * If true, TabPanels will lock to the larger of (leaving/entering) heights during transition
   * to avoid the page “jumping” vertically. (default: true)
   */
  keepHeight?: boolean;

  /**
   * If true, will keep the previous panel mounted until the animation completes.
   * This is generally required for exit animations (default: true)
   */
  keepMountedDuringExit?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

function isTabPanelElement(node: unknown): node is React.ReactElement<TabPanelProps> {
  return React.isValidElement<TabPanelProps>(node) && (node.type as any)?.displayName === 'TabPanel';
}

function pickPanelByValue(
  children: ReactNode,
  value: string
): React.ReactElement<TabPanelProps> | null {
  const panels = React.Children.toArray(children).filter(isTabPanelElement);
  const match = panels.find((p) => p.props.value === value) as React.ReactElement<TabPanelProps> | undefined;
  return match ?? (panels[0] as React.ReactElement<TabPanelProps> | undefined) ?? null;
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
  value,
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
      'data-value': value,
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
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (variant !== 'navigation') return;

      const container = containerRef.current;
      if (!container) return;

      const tabItems = Array.from(container.querySelectorAll('.tab:not(.tab--disabled)')) as HTMLElement[];
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
          {
            const focusedItem = tabItems[currentIndex];
            if (focusedItem) focusedItem.click();
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
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeTab = container.querySelector('.tab--active, .active, [aria-selected="true"]') as HTMLElement;

        if (activeTab) {
          const containerRect = container.getBoundingClientRect();
          const tabRect = activeTab.getBoundingClientRect();
          const newWidth = tabRect.width;
          const newLeft = tabRect.left - containerRect.left;

          if (newWidth !== lastWidth || newLeft !== lastLeft) {
            lastWidth = newWidth;
            lastLeft = newLeft;
            setIndicatorStyle({ width: newWidth, left: newLeft });
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

      if (hasRelevantChange) updateIndicator();
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
      if (rafId) cancelAnimationFrame(rafId);
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
    <div ref={containerRef} className={classes} role="tablist" onKeyDown={handleKeyDown} aria-orientation={orientation}>
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
// TAB PANELS COMPONENT (ANIMATED CONTENT SWITCHING)
// ===============================================

export const TabPanels: React.FC<TabPanelsProps> = ({
  value,
  children,
  animated = true,
  animation = 'fade-slide',
  duration = 220,
  keepHeight = true,
  keepMountedDuringExit = true,
  className = '',
  style,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [leavingValue, setLeavingValue] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  const enterRef = useRef<HTMLDivElement>(null);
  const leaveRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const currentPanel = pickPanelByValue(children, currentValue);
  const nextPanel = pickPanelByValue(children, value);

  const shouldAnimate = animated && animation !== 'none' && duration > 0;

  // Start transition when `value` changes
  useEffect(() => {
    if (value === currentValue) return;

    // If no animation: just swap immediately
    if (!shouldAnimate) {
      setLeavingValue(null);
      setIsTransitioning(false);
      setLockedHeight(null);
      setCurrentValue(value);
      return;
    }

    // Begin exit/enter
    setLeavingValue(currentValue);
    setIsTransitioning(true);
    setCurrentValue(value);

    // Cleanup prior timer
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = window.setTimeout(() => {
      setLeavingValue(null);
      setIsTransitioning(false);
      setLockedHeight(null);
      timeoutRef.current = null;
    }, duration);
  }, [value, currentValue, shouldAnimate, duration]);

  // Height lock to avoid vertical jump during transition
  useLayoutEffect(() => {
    if (!keepHeight) return;
    if (!shouldAnimate) return;
    if (!isTransitioning) return;

    const enterEl = enterRef.current;
    const leaveEl = leaveRef.current;

    const enterH = enterEl ? enterEl.getBoundingClientRect().height : 0;
    const leaveH = leaveEl ? leaveEl.getBoundingClientRect().height : 0;

    const maxH = Math.max(enterH, leaveH);
    if (maxH > 0) setLockedHeight(maxH);
  }, [keepHeight, shouldAnimate, isTransitioning, value]);

  // If content changes size while transitioning (e.g. async loading), keep lock updated
  useEffect(() => {
    if (!keepHeight) return;
    if (!shouldAnimate) return;
    if (!isTransitioning) return;

    const enterEl = enterRef.current;
    if (!enterEl || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      const leaveEl = leaveRef.current;
      const enterH = enterEl.getBoundingClientRect().height;
      const leaveH = leaveEl ? leaveEl.getBoundingClientRect().height : 0;
      const maxH = Math.max(enterH, leaveH);
      if (maxH > 0) setLockedHeight(maxH);
    });

    ro.observe(enterEl);
    return () => ro.disconnect();
  }, [keepHeight, shouldAnimate, isTransitioning]);

  // Styles for entering/leaving panels
  const transitionBase: React.CSSProperties = shouldAnimate
    ? { transition: `opacity ${duration}ms ease, transform ${duration}ms ease` }
    : {};

  const enteringStyle: React.CSSProperties = (() => {
    if (!shouldAnimate) return {};
    if (!isTransitioning) return { opacity: 1, transform: 'translateY(0px)' };

    if (animation === 'fade') return { opacity: 1, transform: 'translateY(0px)' };
    // fade-slide
    return { opacity: 1, transform: 'translateY(0px)' };
  })();

  const leavingStyle: React.CSSProperties = (() => {
    if (!shouldAnimate) return {};
    if (!isTransitioning) return { opacity: 0 };

    if (animation === 'fade') return { opacity: 0, transform: 'translateY(0px)' };
    // fade-slide
    return { opacity: 0, transform: 'translateY(6px)' };
  })();

  const enteringInitial: React.CSSProperties = (() => {
    if (!shouldAnimate) return {};
    if (!isTransitioning) return {};

    if (animation === 'fade') return { opacity: 0, transform: 'translateY(0px)' };
    // fade-slide
    return { opacity: 0, transform: 'translateY(-6px)' };
  })();

  // Force initial style on first paint of the entering panel during transition
  const [enterHasMounted, setEnterHasMounted] = useState(false);
  useEffect(() => {
    if (!isTransitioning) {
      setEnterHasMounted(false);
      return;
    }
    // next tick so transition can run from initial -> final
    const id = window.requestAnimationFrame(() => setEnterHasMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [isTransitioning, value]);

  const renderPanel = (panel: React.ReactElement<TabPanelProps> | null) => {
    if (!panel) return null;
    return panel.props.children;
  };

  const leavingPanel = leavingValue ? pickPanelByValue(children, leavingValue) : null;

  return (
    <div
      className={cn('tab-panels', className)}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        ...(keepHeight && lockedHeight ? { height: `${lockedHeight}px` } : null),
      }}
    >
      {/* Leaving panel (absolute overlay) */}
      {keepMountedDuringExit && leavingPanel && shouldAnimate && (
        <div
          ref={leaveRef}
          className={cn('tab-panels__panel', leavingPanel.props.className)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            ...transitionBase,
            ...leavingStyle,
            ...(leavingPanel.props.style ?? {}),
          }}
          aria-hidden="true"
        >
          {renderPanel(leavingPanel)}
        </div>
      )}

      {/* Entering/current panel */}
      {nextPanel && (
        <div
          ref={enterRef}
          className={cn('tab-panels__panel', nextPanel.props.className)}
          style={{
            width: '100%',
            ...transitionBase,
            ...(shouldAnimate && isTransitioning && !enterHasMounted ? enteringInitial : null),
            ...enteringStyle,
            ...(nextPanel.props.style ?? {}),
          }}
          role="tabpanel"
        >
          {renderPanel(nextPanel)}
        </div>
      )}
    </div>
  );
};

// Display names
Tab.displayName = 'Tab';
TabGroup.displayName = 'TabGroup';
TabPanels.displayName = 'TabPanels';
