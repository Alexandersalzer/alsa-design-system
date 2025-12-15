// blimpify-ui/design/system/components/forms/Slider/Slider.tsx

import React, { useRef, useCallback, useMemo } from 'react';
import { useSliderState } from '@react-stately/slider';
import { useSlider as useAriaSlider } from '@react-aria/slider';
import { useNumberFormatter, useLocale } from '@react-aria/i18n';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useSliderThumb as useAriaSliderThumb } from '@react-aria/slider';
import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import type { AriaSliderProps } from '@react-aria/slider';
import type { SliderState } from '@react-stately/slider';
import './Slider.css';

export type SliderValue = number | number[];

export type SliderStepMark = {
  value: number;
  label: string;
};

export interface SliderProps extends Omit<AriaSliderProps, 'onChange'> {
  /**
   * The content to display as the label.
   */
  label?: React.ReactNode;
  /**
   * The input name.
   */
  name?: string;
  /**
   * Custom class name for the base element
   */
  className?: string;
  /**
   * The offset from which to start the fill.
   */
  fillOffset?: number;
  /**
   * The display format of the value label.
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * The display format of the tooltip value label.
   * @default formatOptions
   */
  tooltipValueFormatOptions?: Intl.NumberFormatOptions;
  /**
   * Whether to show the step indicators.
   * @default false
   */
  showSteps?: boolean;
  /**
   * Whether the thumbs should have a tooltip with the value on hover.
   * @default false
   */
  showTooltip?: boolean;
  /**
   * Custom steps labels.
   */
  marks?: SliderStepMark[];
  /**
   * Element to be rendered in the start side of the slider.
   */
  startContent?: React.ReactNode;
  /**
   * Element to be rendered in the end side of the slider.
   */
  endContent?: React.ReactNode;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color variant
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /**
   * Border radius
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Whether to show outline on thumb
   */
  showOutline?: boolean;
  /**
   * Whether to hide the value label
   */
  hideValue?: boolean;
  /**
   * Whether to hide the thumb
   */
  hideThumb?: boolean;
  /**
   * Whether to disable thumb scale animation
   */
  disableThumbScale?: boolean;
  /**
   * Whether animations are disabled
   */
  disableAnimation?: boolean;
  /**
   * Custom class names for different parts
   */
  classNames?: {
    base?: string;
    labelWrapper?: string;
    label?: string;
    value?: string;
    trackWrapper?: string;
    track?: string;
    filler?: string;
    thumb?: string;
    step?: string;
    mark?: string;
    startContent?: string;
    endContent?: string;
  };
  /**
   * A function that returns the content to display as the value label.
   */
  getValue?: (value: SliderValue) => string;
  /**
   * A function that returns the content to display as the tooltip label.
   */
  getTooltipValue?: (value: SliderValue, index?: number) => string | number;
  /**
   * Function to render the label.
   */
  renderLabel?: (props: React.LabelHTMLAttributes<HTMLLabelElement>) => React.ReactNode;
  /**
   * Function to render the value label.
   */
  renderValue?: (props: React.HTMLAttributes<HTMLOutputElement>) => React.ReactNode;
  /**
   * Function to render the thumb.
   */
  renderThumb?: (props: React.HTMLAttributes<HTMLDivElement> & { index?: number }) => React.ReactNode;
  /**
   * Tooltip props (simplified - you can extend based on your tooltip component)
   */
  tooltipProps?: {
    placement?: 'top' | 'bottom' | 'left' | 'right';
    content?: React.ReactNode;
    offset?: number;
    className?: string;
  };
  /**
   * Change handler
   */
  onChange?: (value: SliderValue) => void;
  /**
   * Change end handler
   */
  onChangeEnd?: (value: SliderValue) => void;
}

interface SliderThumbProps {
  index: number;
  state: SliderState;
  trackRef: React.RefObject<HTMLDivElement | null>;
  name?: string;
  isVertical: boolean;
  showTooltip?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  getTooltipValue?: (value: SliderValue, index?: number) => string | number;
  renderThumb?: SliderProps['renderThumb'];
  className?: string;
  tooltipProps?: SliderProps['tooltipProps'];
}

const SliderThumb: React.FC<SliderThumbProps> = ({
  index,
  state,
  trackRef,
  name,
  isVertical,
  showTooltip,
  formatOptions,
  getTooltipValue,
  renderThumb,
  className,
  tooltipProps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const numberFormatter = useNumberFormatter(formatOptions);

  const { thumbProps, inputProps, isDragging, isFocused } = useAriaSliderThumb(
    {
      index,
      trackRef,
      inputRef,
      name,
    },
    state
  );

  const { hoverProps, isHovered } = useHover({
    isDisabled: state.isDisabled,
  });
  const { focusProps, isFocusVisible } = useFocusRing();
  const { pressProps, isPressed } = usePress({
    isDisabled: state.isDisabled,
  });

  const stateValue = tooltipProps?.content
    ? tooltipProps.content
    : getTooltipValue
    ? state.values.length === 1
      ? getTooltipValue(state.values[index])
      : getTooltipValue(state.values, index)
    : state.values[index];

  const tooltipValue =
    numberFormatter && typeof stateValue === 'number'
      ? numberFormatter.format(stateValue)
      : stateValue;

  const thumbClassName = [
    'slider-thumb',
    className,
    isHovered && 'slider-thumb--hovered',
    isPressed && 'slider-thumb--pressed',
    isDragging && 'slider-thumb--dragging',
    isFocused && 'slider-thumb--focused',
    isFocusVisible && 'slider-thumb--focus-visible',
  ]
    .filter(Boolean)
    .join(' ');

  const defaultThumbProps = {
    ...mergeProps(thumbProps, pressProps, hoverProps),
    className: thumbClassName,
    'data-index': index,
  };

  const thumbElement = renderThumb ? (
    renderThumb({ ...defaultThumbProps, index })
  ) : (
    <div {...defaultThumbProps}>
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={inputRef} />
      </VisuallyHidden>
    </div>
  );

  if (showTooltip && (isHovered || isDragging || isFocused || isFocusVisible)) {
    return (
      <div className="slider-thumb-wrapper" style={{ position: 'relative' }}>
        {thumbElement}
        <div
          className={`slider-tooltip slider-tooltip--${tooltipProps?.placement || (isVertical ? 'right' : 'top')} ${tooltipProps?.className || ''}`}
          role="tooltip"
          aria-label={`Current value: ${tooltipValue}`}
        >
          {tooltipValue}
        </div>
      </div>
    );
  }

  return thumbElement;
};

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      label,
      name,
      formatOptions,
      value: valueProp,
      defaultValue,
      maxValue = 100,
      minValue = 0,
      step = 1,
      showSteps = false,
      showTooltip = false,
      orientation = 'horizontal',
      marks = [],
      startContent,
      endContent,
      fillOffset,
      classNames = {},
      size = 'md',
      color = 'primary',
      radius = 'full',
      showOutline = false,
      hideValue = false,
      hideThumb = false,
      disableThumbScale = false,
      disableAnimation = false,
      renderThumb,
      renderLabel,
      renderValue,
      onChange,
      onChangeEnd,
      getValue,
      getTooltipValue,
      tooltipValueFormatOptions = formatOptions,
      tooltipProps = {},
      isDisabled = false,
      className,
      ...otherProps
    },
    ref
  ) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const numberFormatter = useNumberFormatter(formatOptions);
    const { direction } = useLocale();

    const clampValue = useCallback(
      (valueToClamp: number) => {
        return Math.min(Math.max(valueToClamp, minValue), maxValue);
      },
      [minValue, maxValue]
    );

    const validatedValue = useMemo(() => {
      if (valueProp === undefined) return undefined;

      if (Array.isArray(valueProp)) {
        return valueProp.map(clampValue);
      }

      return clampValue(valueProp);
    }, [valueProp, clampValue]);

    const state = useSliderState({
      ...otherProps,
      value: validatedValue,
      defaultValue,
      isDisabled,
      orientation,
      step,
      minValue,
      maxValue,
      numberFormatter,
      onChange,
      onChangeEnd,
    });

    const { groupProps, trackProps, labelProps, outputProps } = useAriaSlider(
      otherProps,
      state,
      trackRef
    );
    const { isHovered, hoverProps } = useHover({ isDisabled });

    const isVertical = orientation === 'vertical';
    const hasMarks = marks?.length > 0;
    const hasSingleThumb = fillOffset === undefined ? state.values.length === 1 : false;

    const [startOffset, endOffset] = [
      state.values.length > 1
        ? state.getThumbPercent(0)
        : fillOffset !== undefined
        ? state.getValuePercent(fillOffset)
        : 0,
      state.getThumbPercent(state.values.length - 1),
    ].sort();

    const value =
      state.values.length === 1
        ? numberFormatter.format(state.values[0])
        : numberFormatter.formatRange(state.values[0], state.values[state.values.length - 1]);

    const steps = showSteps ? Math.floor((maxValue - minValue) / step) + 1 : 0;

    const baseClassName = [
      'slider',
      `slider--${size}`,
      `slider--${color}`,
      `slider--radius-${radius}`,
      isVertical && 'slider--vertical',
      isDisabled && 'slider--disabled',
      hasMarks && 'slider--has-marks',
      hasSingleThumb && 'slider--single-thumb',
      showOutline && 'slider--outlined',
      hideValue && 'slider--hide-value',
      hideThumb && 'slider--hide-thumb',
      disableThumbScale && 'slider--no-thumb-scale',
      disableAnimation && 'slider--no-animation',
      isHovered && 'slider--hovered',
      classNames.base,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Get edge padding based on size
    const edgePadding =
      size === 'sm' ? 'var(--foundation-space-2)' :
      size === 'lg' ? 'var(--foundation-space-4)' :
      'var(--foundation-space-3)';

    const fillWidth = (endOffset - startOffset) * 100;
    const fillStyle: React.CSSProperties = isVertical
      ? {
          bottom: `calc(${edgePadding} + ${startOffset * 100}%)`,
          height: `${fillWidth}%`,
        }
      : {
          [direction === 'rtl' ? 'right' : 'left']: `calc(${edgePadding} + ${startOffset * 100}%)`,
          width: `${fillWidth}%`,
        };

    return (
      <div
        {...mergeProps(groupProps, hoverProps, otherProps)}
        ref={ref}
        className={baseClassName}
        data-orientation={orientation}
      >
        {label && (
          <div className={`slider-label-wrapper ${classNames.labelWrapper || ''}`}>
            {renderLabel ? (
              renderLabel({ ...labelProps, className: `slider-label ${classNames.label || ''}` })
            ) : (
              <label {...labelProps} className={`slider-label ${classNames.label || ''}`}>
                {label}
              </label>
            )}
            {!hideValue &&
              (renderValue ? (
                renderValue({
                  ...outputProps,
                  className: `slider-value ${classNames.value || ''}`,
                })
              ) : (
                <output {...outputProps} className={`slider-value ${classNames.value || ''}`}>
                  {getValue && typeof getValue === 'function' ? getValue(state.values) : value}
                </output>
              ))}
          </div>
        )}
        <div className={`slider-track-wrapper ${classNames.trackWrapper || ''}`}>
          {startContent && (
            <div className={`slider-start-content ${classNames.startContent || ''}`}>
              {startContent}
            </div>
          )}
          <div
            {...trackProps}
            ref={trackRef}
            className={`slider-track ${classNames.track || ''}`}
            data-vertical={isVertical}
          >
            <div className={`slider-filler ${classNames.filler || ''}`} style={fillStyle} />
            {Number.isFinite(steps) &&
              Array.from({ length: steps }, (_, index) => {
                const percent = state.getValuePercent(index * step + minValue);
                const stepStyle: React.CSSProperties = isVertical
                  ? {
                      bottom: `calc(${edgePadding} + ${percent * 100}%)`,
                    }
                  : {
                      [direction === 'rtl' ? 'right' : 'left']: `calc(${edgePadding} + ${percent * 100}%)`,
                    };
                const inRange = percent <= endOffset && percent >= startOffset;

                return (
                  <div
                    key={index}
                    className={`slider-step ${classNames.step || ''}`}
                    data-in-range={inRange}
                    style={stepStyle}
                  />
                );
              })}
            {state.values.map((_, index) => (
              <SliderThumb
                key={index}
                index={index}
                state={state}
                trackRef={trackRef}
                name={name}
                isVertical={isVertical}
                showTooltip={showTooltip}
                formatOptions={tooltipValueFormatOptions}
                getTooltipValue={getTooltipValue}
                renderThumb={renderThumb}
                className={classNames.thumb}
                tooltipProps={tooltipProps}
              />
            ))}
            {marks?.length > 0 &&
              marks.map((mark, index) => {
                const percent = state.getValuePercent(mark.value);
                const markStyle: React.CSSProperties = isVertical
                  ? {
                      bottom: `calc(${edgePadding} + ${percent * 100}%)`,
                    }
                  : {
                      [direction === 'rtl' ? 'right' : 'left']: `calc(${edgePadding} + ${percent * 100}%)`,
                    };
                const inRange = percent <= endOffset && percent >= startOffset;

                return (
                  <div
                    key={index}
                    className={`slider-mark ${classNames.mark || ''}`}
                    data-in-range={inRange}
                    style={markStyle}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (state.values.length === 1) {
                        state.setThumbPercent(0, percent);
                      } else {
                        const leftThumbVal = state.values[0];
                        const rightThumbVal = state.values[1];

                        if (mark.value < leftThumbVal) {
                          state.setThumbPercent(0, percent);
                        } else if (mark.value > rightThumbVal) {
                          state.setThumbPercent(1, percent);
                        } else if (
                          Math.abs(mark.value - leftThumbVal) <
                          Math.abs(mark.value - rightThumbVal)
                        ) {
                          state.setThumbPercent(0, percent);
                        } else {
                          state.setThumbPercent(1, percent);
                        }
                      }
                    }}
                  >
                    {mark.label}
                  </div>
                );
              })}
          </div>
          {endContent && (
            <div className={`slider-end-content ${classNames.endContent || ''}`}>{endContent}</div>
          )}
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';