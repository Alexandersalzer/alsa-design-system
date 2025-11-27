// src/design-system/components/primitives/SegmentedControl/SegmentedControl.tsx
// ROBUST SEGMENTED CONTROL — stable first paint, no jank, SSR-safe

import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Label } from '../../Typography/Typography'; // ← ONLY CHANGE: Added /Typography
import { cn } from '../../../utils/cn';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pill' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** useIsomorphicLayoutEffect to avoid SSR warnings */
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

  /** Read container padding (content-box) to position indicator precisely */
  const readContainerPadding = (el: HTMLElement | null) => {
    if (!el) return { left: 0, top: 0 };
    const s = getComputedStyle(el);
    return {
      left: parseFloat(s.paddingLeft) || 0,
      top: parseFloat(s.paddingTop) || 0,
    };
  };

  /** Measure & update indicator (idempotent + resilient) */
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

    // Left offset relative to the *content box* of container
    const relativeLeft = btnRect.left - containerRect.left - pad.left;
    const width = btnRect.width;

    // Guard against tiny/zero widths from early paints
    if (!width || width < 40) {
      // schedule one more pass next frame
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

  /** Schedule a safe measurement after paint */
  const scheduleMeasure = useCallback(() => {
    // Double rAF: after layout & any subsequent reflow (fonts/flex)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateIndicator();
      });
    });
  }, [updateIndicator]);

  // Mark mounted to control initial animation (no slide-in on first paint)
  useIsoLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Measure on mount and whenever options/value change
  useEffect(() => {
    scheduleMeasure();
  }, [scheduleMeasure, options.length, value]);

  // Re-measure on resize
  useEffect(() => {
    const onResize = () => scheduleMeasure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scheduleMeasure]);

  // Re-measure on container/button size changes (ResizeObserver)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => scheduleMeasure());
    ro.observe(container);

    // Also observe each option
    const buttons = container.querySelectorAll('.segmented-control__option');
    buttons.forEach((b) => ro.observe(b));

    return () => {
      ro.disconnect();
    };
  }, [options.length, scheduleMeasure]);

  // Re-measure after fonts load (handles late webfont swaps)
  useEffect(() => {
    // Safari/older may not support document.fonts — guard it
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

  // Keyboard navigation
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

    // Skip disabled options
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
        variant !== 'default' && `segmented-control--${variant}`,
        fullWidth && 'segmented-control--full-width',
        disabled && 'segmented-control--disabled',
        className
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      // Data flag to enable transitions only after first stable paint
      data-mounted={mounted ? 'true' : 'false'}
    >
      {/* Sliding background indicator */}
      <div
        className="segmented-control__indicator"
        style={{
          ...indicatorStyle,
          // Disable transition on first paint; enable afterwards
          transition:
            mounted
              ? undefined // use CSS default transitions
              : 'none',
        }}
        aria-hidden="true"
      />

      {/* Options */}
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;
        const isBeforeSelected = index === selectedIndex - 1;
        const isAfterSelected = index === selectedIndex + 1;

        return (
          <button
            key={option.value}
            className={cn(
              'segmented-control__option',
              isDisabled && 'segmented-control__option--disabled'
            )}
            onClick={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled || undefined}
            tabIndex={isSelected ? 0 : -1}
            data-value={option.value}
            data-selected={isSelected}
            data-before-selected={isBeforeSelected}
            data-after-selected={isAfterSelected}
            type="button"
          >
            {option.icon && <span className="segmented-control__icon">{option.icon}</span>}
            <Label
              size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'primary' : 'secondary'}
            >
              {option.label}
            </Label>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;