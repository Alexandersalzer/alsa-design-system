// blimpify-ui/design/system/components/forms/Slider/Slider.tsx
//
// Custom-thumb slider. Track + filler + thumbs are plain divs we position
// ourselves, so geometry is fully under our control (no native input quirks).
// Each thumb is a focusable role="slider" element handling drag + keyboard.

import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type CSSProperties,
} from 'react';
import './Slider.css';

export type SliderValue = number | number[];

export type SliderStepMark = {
  value: number;
  label: string;
};

export interface SliderProps {
  label?: React.ReactNode;
  name?: string;
  className?: string;
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

  value?: SliderValue;
  defaultValue?: SliderValue;
  minValue?: number;
  maxValue?: number;
  step?: number;

  fillOffset?: number;

  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  showSteps?: boolean;
  marks?: SliderStepMark[];
  showTooltip?: boolean;
  hideValue?: boolean;
  hideThumb?: boolean;
  showOutline?: boolean;
  isDisabled?: boolean;

  startContent?: React.ReactNode;
  endContent?: React.ReactNode;

  formatOptions?: Intl.NumberFormatOptions;
  getValue?: (value: SliderValue) => string;
  getTooltipValue?: (value: SliderValue, index?: number) => string | number;

  onChange?: (value: SliderValue) => void;
  onChangeEnd?: (value: SliderValue) => void;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const toPercent = (v: number, min: number, max: number) =>
  ((v - min) / (max - min)) * 100;

const isRange = (v: SliderValue | undefined): v is number[] => Array.isArray(v);

const formatNumber = (
  v: number | string,
  formatter?: Intl.NumberFormat
): string => {
  if (typeof v === 'string') return v;
  return formatter ? formatter.format(v) : String(v);
};

// Snap an arbitrary numeric value to the nearest step within [min, max].
const snapToStep = (v: number, min: number, max: number, step: number) => {
  const snapped = Math.round((v - min) / step) * step + min;
  // Floating-point tidy-up: keep step's decimal precision.
  const decimals = (String(step).split('.')[1] || '').length;
  const rounded = decimals > 0 ? Number(snapped.toFixed(decimals)) : snapped;
  return clamp(rounded, min, max);
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    label,
    name,
    className,
    classNames = {},

    value: valueProp,
    defaultValue,
    minValue = 0,
    maxValue = 100,
    step = 1,
    fillOffset,

    size = 'md',
    color = 'primary',
    radius = 'full',

    showSteps = false,
    marks,
    showTooltip = false,
    hideValue = false,
    hideThumb = false,
    showOutline = false,
    isDisabled = false,

    startContent,
    endContent,

    formatOptions,
    getValue,
    getTooltipValue,

    onChange,
    onChangeEnd,
  },
  ref
) {
  const isRangeMode = isRange(valueProp ?? defaultValue);

  const initial = useMemo<SliderValue>(() => {
    if (valueProp !== undefined) return valueProp;
    if (defaultValue !== undefined) return defaultValue;
    return isRangeMode ? [minValue, maxValue] : minValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [internal, setInternal] = useState<SliderValue>(initial);
  const current = valueProp !== undefined ? valueProp : internal;

  const singleValue = !isRangeMode
    ? clamp(current as number, minValue, maxValue)
    : 0;

  const rangeValues = isRangeMode
    ? [
        clamp((current as number[])[0] ?? minValue, minValue, maxValue),
        clamp((current as number[])[1] ?? maxValue, minValue, maxValue),
      ]
    : [0, 0];
  if (isRangeMode && rangeValues[0] > rangeValues[1]) {
    [rangeValues[0], rangeValues[1]] = [rangeValues[1], rangeValues[0]];
  }

  const formatter = useMemo(
    () => (formatOptions ? new Intl.NumberFormat(undefined, formatOptions) : undefined),
    [formatOptions]
  );

  const commit = useCallback(
    (next: SliderValue) => {
      if (valueProp === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, valueProp]
  );

  const valueDisplay = useMemo(() => {
    if (getValue) return getValue(current as SliderValue);
    if (isRangeMode) {
      return `${formatNumber(rangeValues[0], formatter)} – ${formatNumber(rangeValues[1], formatter)}`;
    }
    return formatNumber(singleValue, formatter);
  }, [getValue, current, isRangeMode, rangeValues, singleValue, formatter]);

  // Filler bounds in percent.
  const fillStart = !isRangeMode
    ? toPercent(fillOffset ?? minValue, minValue, maxValue)
    : toPercent(rangeValues[0], minValue, maxValue);
  const fillEnd = !isRangeMode
    ? toPercent(singleValue, minValue, maxValue)
    : toPercent(rangeValues[1], minValue, maxValue);
  const [fillFrom, fillTo] = fillStart <= fillEnd ? [fillStart, fillEnd] : [fillEnd, fillStart];

  // Step dot positions.
  const stepDots = useMemo(() => {
    if (!showSteps) return [];
    const span = maxValue - minValue;
    const count = Math.floor(span / step) + 1;
    if (!Number.isFinite(count) || count <= 0 || count > 200) return [];
    return Array.from({ length: count }, (_, i) => {
      const v = minValue + i * step;
      const pct = toPercent(v, minValue, maxValue);
      const inRange = pct >= fillFrom && pct <= fillTo;
      return { pct, inRange };
    });
  }, [showSteps, minValue, maxValue, step, fillFrom, fillTo]);

  // ----- Drag handling -----
  // Translate clientX into a percentage of the *rail* (inner) width, which is
  // the track width minus one thumb (the rail is inset by thumb/2 on each side).
  // We read the rail element directly so the math doesn't rely on assumed sizes.
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const pctFromClientX = useCallback((clientX: number) => {
    const el = railRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const x = clientX - rect.left;
    return clamp((x / rect.width) * 100, 0, 100);
  }, []);

  const valueFromPct = useCallback(
    (pct: number) => {
      const raw = minValue + (pct / 100) * (maxValue - minValue);
      return snapToStep(raw, minValue, maxValue, step);
    },
    [minValue, maxValue, step]
  );

  // Mirror the latest value into a ref so drag handlers always see fresh data,
  // even though they were registered with the closure from pointerdown.
  const valueRef = useRef<SliderValue>(current as SliderValue);
  useEffect(() => {
    valueRef.current = current as SliderValue;
  }, [current]);

  const dragStateRef = useRef<{ idx: 0 | 1 | null }>({ idx: null });

  const beginDrag = useCallback(
    (idx: 0 | 1, e: ReactPointerEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).focus();
      dragStateRef.current.idx = idx;

      const move = (ev: PointerEvent) => {
        if (dragStateRef.current.idx === null) return;
        const v = valueFromPct(pctFromClientX(ev.clientX));
        const cur = valueRef.current;
        if (Array.isArray(cur)) {
          const i = dragStateRef.current.idx;
          const other = cur[i === 0 ? 1 : 0];
          const next: [number, number] = i === 0
            ? [Math.min(v, other), other]
            : [other, Math.max(v, other)];
          commit(next);
        } else {
          commit(v);
        }
      };

      const up = () => {
        dragStateRef.current.idx = null;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        onChangeEnd?.(valueRef.current);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    },
    [isDisabled, valueFromPct, pctFromClientX, commit, onChangeEnd]
  );

  // Click on track moves the nearest thumb to that position (and starts dragging it).
  const onTrackPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      // Ignore clicks that originated on a thumb (those have their own handler).
      const target = e.target as HTMLElement;
      if (target.closest('.slider-thumb')) return;

      const v = valueFromPct(pctFromClientX(e.clientX));
      let idx: 0 | 1 = 0;
      if (isRangeMode) {
        const distLow = Math.abs(v - rangeValues[0]);
        const distHigh = Math.abs(v - rangeValues[1]);
        idx = distLow <= distHigh ? 0 : 1;
        const other = rangeValues[idx === 0 ? 1 : 0];
        const next: [number, number] = idx === 0
          ? [Math.min(v, other), other]
          : [other, Math.max(v, other)];
        commit(next);
      } else {
        commit(v);
      }
      // Continue as a drag so the user can scrub without re-pressing.
      beginDrag(idx, e);
    },
    [isDisabled, isRangeMode, rangeValues, valueFromPct, pctFromClientX, commit, beginDrag]
  );

  const onThumbKeyDown = useCallback(
    (idx: 0 | 1) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      const span = maxValue - minValue;
      const big = Math.max(step, span / 10);
      let delta = 0;
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          delta = -step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          delta = step;
          break;
        case 'PageDown':
          delta = -big;
          break;
        case 'PageUp':
          delta = big;
          break;
        case 'Home': {
          e.preventDefault();
          if (isRangeMode) {
            const other = rangeValues[idx === 0 ? 1 : 0];
            const next: [number, number] = idx === 0 ? [minValue, other] : [other, other];
            commit(next);
          } else {
            commit(minValue);
          }
          onChangeEnd?.(valueProp ?? (isRangeMode ? rangeValues : minValue));
          return;
        }
        case 'End': {
          e.preventDefault();
          if (isRangeMode) {
            const other = rangeValues[idx === 0 ? 1 : 0];
            const next: [number, number] = idx === 0 ? [other, other] : [other, maxValue];
            commit(next);
          } else {
            commit(maxValue);
          }
          onChangeEnd?.(valueProp ?? (isRangeMode ? rangeValues : maxValue));
          return;
        }
        default:
          return;
      }
      e.preventDefault();
      if (isRangeMode) {
        const other = rangeValues[idx === 0 ? 1 : 0];
        const target = clamp(rangeValues[idx] + delta, minValue, maxValue);
        const snapped = snapToStep(target, minValue, maxValue, step);
        const next: [number, number] = idx === 0
          ? [Math.min(snapped, other), other]
          : [other, Math.max(snapped, other)];
        commit(next);
      } else {
        const target = clamp(singleValue + delta, minValue, maxValue);
        commit(snapToStep(target, minValue, maxValue, step));
      }
    },
    [isDisabled, isRangeMode, rangeValues, singleValue, minValue, maxValue, step, valueProp, commit, onChangeEnd]
  );

  // ----- Tooltip -----
  const [hoverIdx, setHoverIdx] = useState<0 | 1 | null>(null);
  const tipText = (idx: 0 | 1) => {
    const v = isRangeMode ? rangeValues[idx] : singleValue;
    if (getTooltipValue) {
      const arg = isRangeMode ? rangeValues : v;
      const res = isRangeMode ? getTooltipValue(arg as number[], idx) : getTooltipValue(arg as number);
      return typeof res === 'string' ? res : formatNumber(res, formatter);
    }
    return formatNumber(v, formatter);
  };

  const containerClass = [
    'slider',
    `slider--${size}`,
    `slider--${color}`,
    `slider--radius-${radius}`,
    isDisabled && 'slider--disabled',
    hideValue && 'slider--hide-value',
    hideThumb && 'slider--hide-thumb',
    showOutline && 'slider--outlined',
    marks && marks.length > 0 && 'slider--has-marks',
    classNames.base,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const thumbAriaLabel = (idx: 0 | 1) => {
    const base = typeof label === 'string' ? label : 'Slider';
    if (!isRangeMode) return base;
    return idx === 0 ? `${base} (min)` : `${base} (max)`;
  };

  const renderThumb = (idx: 0 | 1, value: number) => {
    const pct = toPercent(value, minValue, maxValue);
    // CSS reads `--slider-thumb-pct` (unitless 0-100) and maps it onto the
    // inner rail width, then centers the thumb on that point.
    const style = { ['--slider-thumb-pct' as string]: pct } as CSSProperties;
    return (
      <div
        key={`thumb-${idx}`}
        className={`slider-thumb ${classNames.thumb || ''}`}
        style={style}
        role="slider"
        tabIndex={isDisabled ? -1 : 0}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuenow={value}
        aria-valuetext={formatNumber(value, formatter)}
        aria-label={thumbAriaLabel(idx)}
        aria-disabled={isDisabled || undefined}
        onPointerDown={(e) => beginDrag(idx, e)}
        onKeyDown={onThumbKeyDown(idx)}
        onPointerEnter={() => showTooltip && setHoverIdx(idx)}
        onPointerLeave={() => setHoverIdx((cur) => (cur === idx ? null : cur))}
        onFocus={() => showTooltip && setHoverIdx(idx)}
        onBlur={() => setHoverIdx((cur) => (cur === idx ? null : cur))}
      >
        {showTooltip && hoverIdx === idx && (
          <div className="slider-tooltip" role="tooltip">
            {tipText(idx)}
          </div>
        )}
      </div>
    );
  };

  // Unitless numbers — CSS multiplies them against (100% - thumb-size).
  const trackVars: CSSProperties = {
    ['--slider-fill-from' as string]: fillFrom,
    ['--slider-fill-to' as string]: fillTo,
  };

  return (
    <div ref={ref} className={containerClass}>
      {label && (
        <div className={`slider-label-wrapper ${classNames.labelWrapper || ''}`}>
          <label className={`slider-label ${classNames.label || ''}`}>{label}</label>
          {!hideValue && (
            <output className={`slider-value ${classNames.value || ''}`}>
              {valueDisplay}
            </output>
          )}
        </div>
      )}

      <div className={`slider-track-wrapper ${classNames.trackWrapper || ''}`}>
        {startContent && (
          <div className={`slider-start-content ${classNames.startContent || ''}`}>
            {startContent}
          </div>
        )}

        <div
          ref={trackRef}
          className={`slider-track ${classNames.track || ''}`}
          style={trackVars}
          onPointerDown={onTrackPointerDown}
        >
          <div ref={railRef} className="slider-rail" aria-hidden="true" />
          <div className={`slider-filler ${classNames.filler || ''}`} aria-hidden="true" />

          {stepDots.map((d, i) => (
            <span
              key={`step-${i}`}
              className={`slider-step ${classNames.step || ''}`}
              style={{ ['--slider-pos' as string]: d.pct } as CSSProperties}
              data-in-range={d.inRange ? 'true' : 'false'}
              aria-hidden="true"
            />
          ))}

          {marks?.map((m, i) => {
            const pct = toPercent(m.value, minValue, maxValue);
            const inRange = pct >= fillFrom && pct <= fillTo;
            return (
              <span
                key={`mark-${i}`}
                className={`slider-mark ${classNames.mark || ''}`}
                style={{ ['--slider-pos' as string]: pct } as CSSProperties}
                data-in-range={inRange ? 'true' : 'false'}
                aria-hidden="true"
              >
                {m.label}
              </span>
            );
          })}

          {!hideThumb && (
            isRangeMode
              ? (
                <>
                  {renderThumb(0, rangeValues[0])}
                  {renderThumb(1, rangeValues[1])}
                </>
              )
              : renderThumb(0, singleValue)
          )}

          {/* Hidden native input(s) for forms / accessibility tree completeness. */}
          {name && !isRangeMode && (
            <input type="hidden" name={name} value={singleValue} />
          )}
          {name && isRangeMode && (
            <>
              <input type="hidden" name={`${name}_min`} value={rangeValues[0]} />
              <input type="hidden" name={`${name}_max`} value={rangeValues[1]} />
            </>
          )}
        </div>

        {endContent && (
          <div className={`slider-end-content ${classNames.endContent || ''}`}>
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';
