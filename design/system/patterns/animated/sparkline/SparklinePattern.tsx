'use client';

import { Sparkline } from '../../../components/data/Sparkline/Sparkline';
import { PatternNode } from '../../../core/types/nodes';

interface SparklinePatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const SparklinePattern = ({ props = {} }: SparklinePatternProps) => {
  const {
    data = [],
    width,
    height = 120,
    maxWidth,
    color = 'accent',
    showArea = true,
    smooth = true,
    showValue,
    valueLabel,
    showTrend,
    showGrid,
    showScale,
    showTooltip,
    className,
  } = props as {
    data?: number[];
    width?: number;
    height?: number;
    maxWidth?: string;
    color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
    showArea?: boolean;
    smooth?: boolean;
    showValue?: boolean;
    valueLabel?: string;
    showTrend?: boolean;
    showGrid?: boolean;
    showScale?: boolean;
    showTooltip?: boolean;
    className?: string;
  };

  const wrapperStyle = maxWidth ? { maxWidth, width: '100%' } : undefined;

  return (
    <div style={wrapperStyle}>
      <Sparkline
        data={data}
        width={width}
        height={height}
        color={color}
        showArea={showArea}
        smooth={smooth}
        showValue={showValue}
        valueLabel={valueLabel}
        showTrend={showTrend}
        showGrid={showGrid}
        showScale={showScale}
        showTooltip={showTooltip}
        className={className}
      />
    </div>
  );
};

SparklinePattern.displayName = 'SparklinePattern';

export default SparklinePattern;
