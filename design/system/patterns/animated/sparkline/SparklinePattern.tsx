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
    marginTop,
  } = props as {
    data?: number[];
    width?: number;
    height?: number;
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
    marginTop?: string;
  };

  return (
    <div style={{ marginTop }}>
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
