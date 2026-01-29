// src/design-system/components/primitives/SegmentedControl/SegmentedControl.tsx
// FIXED SEGMENTED CONTROL - Proper click handling on all options

import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Label } from '../../Typography/Typography';
import { Tooltip } from '../../overlays/Tooltip/Tooltip';
import { cn } from '../../../utils/cn';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string; // Optional tooltip text (defaults to label if iconOnly is true)
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Visual style variant (like Button variants)
   * - 'default': Page background, default border, raised thumb
   * - 'raised': Raised background, elevated thumb
   * - 'accent': Page background, accent border, accent thumb
   * - 'pill': Pill shape with elevated background
   * - 'ghost': No background, minimal styling
   */
  variant?: 'default' | 'raised' | 'accent' | 'pill' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  iconOnly?: boolean; // Hide labels, show only icons with tooltips
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'; // Control tooltip position (default: 'bottom')
  className?: string;
  'aria-label'?: string;
}

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  iconOnly = false,
  tooltipPlacement = 'bottom',
  className,
  'aria-label': ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    transform: string;
    width: string;
  }>({ transform: 'translateX(0px)', width: '0px' });

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );

  const readContainerPadding = (el: HTMLElement | null) => {
    if (!el) return { left: 0, top: 0 };
    const s = getComputedStyle(el);
    return {
      left: parseFloat(s.paddingLeft) || 0,
      top: parseFloat(s.paddingTop) || 0,
    };
  };

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (selectedIndex < 0 || selectedIndex >= options.length) return;

    const buttons = container.querySelectorAll<HTMLButtonElement>(
      '.segmented-control__option'
    );
    const selectedBtn = buttons[selectedIndex];
    if (!selectedBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = selectedBtn.getBoundingClientRect();
    const pad = readContainerPadding(container);

    const relativeLeft = btnRect.left - containerRect.left - pad.left;
    const width = btnRect.width;

    if (!width || width < 40) {
      requestAnimationFrame(() => {
        const btnRect2 = selectedBtn.getBoundingClientRect();
        const containerRect2 = container.getBoundingClientRect();
        const pad2 = readContainerPadding(container);
        const left2 = btnRect2.left - containerRect2.left - pad2.left;
        const width2 = btnRect2.width;
        if (width2 && width2 >= 40) {
          setIndicatorStyle({
            transform: `translateX(${left2}px)`,
            width: `${width2}px`,
          });
        }
      });
    }

    setIndicatorStyle({
      transform: `translateX(${relativeLeft}px)`,
      width: `${width}px`,
    });
  }, [options, selectedIndex]);

  const scheduleMeasure = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateIndicator();
      });
    });
  }, [updateIndicator]);

  useIsoLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scheduleMeasure();
  }, [scheduleMeasure, options.length, value]);

  useEffect(() => {
    const onResize = () => scheduleMeasure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scheduleMeasure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => scheduleMeasure());
    ro.observe(container);

    const buttons = container.querySelectorAll('.segmented-control__option');
    buttons.forEach((b) => ro.observe(b));

    return () => {
      ro.disconnect();
    };
  }, [options.length, scheduleMeasure]);

  useEffect(() => {
    const anyDoc = document as any;
    const fonts = anyDoc?.fonts;
    if (!fonts || !fonts.ready || typeof fonts.ready.then !== 'function') return;

    let cancelled = false;
    fonts.ready.then(() => {
      if (!cancelled) scheduleMeasure();
    });
    return () => {
      cancelled = true;
    };
  }, [scheduleMeasure]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    const current = selectedIndex;
    if (current < 0) return;

    let newIndex = current;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = current > 0 ? current - 1 : options.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = current < options.length - 1 ? current + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = options.length - 1;
        break;
      default:
        return;
    }

    let safety = 0;
    while (options[newIndex]?.disabled && safety++ < options.length) {
      newIndex =
        event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home'
          ? (newIndex > 0 ? newIndex - 1 : options.length - 1)
          : (newIndex < options.length - 1 ? newIndex + 1 : 0);
    }

    if (!options[newIndex]?.disabled && newIndex !== current) {
      onChange(options[newIndex].value);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'segmented-control',
        `segmented-control--${size}`,
        `segmented-control--${variant}`,
        fullWidth && 'segmented-control--full-width',
        disabled && 'segmented-control--disabled',
        className
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      data-mounted={mounted ? 'true' : 'false'}
    >
      {/* Sliding background indicator */}
      <div
        className="segmented-control__indicator"
        style={{
          ...indicatorStyle,
          transition: mounted ? undefined : 'none',
          // CRITICAL FIX: pointer-events none so it doesn't block clicks
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Options */}
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;
        const isBeforeSelected = index === selectedIndex - 1;
        const isAfterSelected = index === selectedIndex + 1;
        const tooltipText = option.tooltip || option.label;
        const showTooltip = iconOnly && tooltipText;

        const buttonElement = (
          <button
            key={option.value}
            className={cn(
              'segmented-control__option',
              iconOnly && 'segmented-control__option--icon-only',
              isDisabled && 'segmented-control__option--disabled'
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDisabled) {
                console.log(`🔘 Clicked option: ${option.value}, current: ${value}`);
                onChange(option.value);
              }
            }}
            disabled={isDisabled}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled || undefined}
            aria-label={iconOnly ? option.label : undefined}
            tabIndex={isSelected ? 0 : -1}
            data-value={option.value}
            data-selected={isSelected}
            data-before-selected={isBeforeSelected}
            data-after-selected={isAfterSelected}
            type="button"
          >
            {option.icon && <span className="segmented-control__icon">{option.icon}</span>}
            {!iconOnly && (
              <Label
                size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
                weight={isSelected ? 'semibold' : 'medium'}
                color={isSelected ? 'primary' : 'secondary'}
              >
                {option.label}
              </Label>
            )}
          </button>
        );

        // Wrap with Tooltip if iconOnly mode
        if (showTooltip) {
          return (
            <Tooltip
              size="sm"
              key={option.value}
              content={tooltipText}
              placement={tooltipPlacement}
              delay={500}
            >
              {buttonElement}
            </Tooltip>
          );
        }

        return buttonElement;
      })}
    </div>
  );
};

export default SegmentedControl;