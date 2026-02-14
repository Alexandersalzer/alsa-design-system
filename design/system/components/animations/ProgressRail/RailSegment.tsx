// ===============================================
// RailSegment.tsx - Modular rail pieces that stack together
// Enhanced with variants, colors, and custom content
// ===============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './RailSegment.css';

export interface RailSegmentProps {
  /** Segment type: start, middle, or end */
  type: 'start' | 'middle' | 'end';

  /** Variant: 'segments' (default, separate segments) or 'connected' (full connected line) */
  variant?: 'segments' | 'connected';

  /** Content to display inside the node (number, icon, or React element) */
  content?: React.ReactNode;

  /** @deprecated Use content instead. Node number to display */
  number?: string;

  /** Whether this segment is active (can be overridden by scroll) */
  active?: boolean;

  /** Size of the node indicator */
  nodeSize?: number;

  /** Width of the connecting line */
  lineWidth?: number;

  /** Color of active line */
  activeLineColor?: string;

  /** Color of inactive line */
  inactiveLineColor?: string;

  /** Color of active node */
  activeNodeColor?: string;

  /** Color of inactive node */
  inactiveNodeColor?: string;

  /** Custom className */
  className?: string;

  /** Scroll offset to trigger activation (0-1, default 0.75 = 3/4 from top) */
  scrollOffset?: number;

  /** Distance threshold in pixels for activation (default 150px) */
  activationThreshold?: number;
}

export const RailSegment: React.FC<RailSegmentProps> = ({
  type,
  variant = 'segments',
  content,
  number, // Deprecated, fallback to content
  active: propActive = false,
  nodeSize = 16,
  lineWidth = 1,
  activeLineColor,
  inactiveLineColor,
  activeNodeColor,
  inactiveNodeColor,
  className = '',
  scrollOffset = 0.75,
  activationThreshold = 150,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(propActive);
  const [topLineFill, setTopLineFill] = useState(0); // 0-1
  const [bottomLineFill, setBottomLineFill] = useState(0); // 0-1

  // Use content if provided, otherwise fall back to deprecated number prop
  const displayContent = content !== undefined ? content : number;

  useEffect(() => {
    // If active is explicitly set to true, use that
    if (propActive) {
      setIsActive(true);
      return;
    }

    let rafId: number | null = null;
    let isScheduled = false;

    const handleScroll = () => {
      if (!nodeRef.current) return;

      const rect = nodeRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * scrollOffset;
      const nodeTop = rect.top;
      const nodeCenter = nodeTop + rect.height / 2;
      const nodeBottom = rect.bottom;

      // Activate node when it crosses the trigger point
      const nodeIsActive = nodeCenter <= triggerPoint;
      setIsActive(nodeIsActive);

      // For connected variant, we want a continuous smooth animation
      // The key is to make each line fill based on its actual position relative to trigger

      // Top line (middle/end): Fill based on how far above the node the trigger is
      if (type === 'middle' || type === 'end') {
        // Top line should be fully filled when the node is active
        // and should start filling as we approach the node from above
        const lineStart = nodeTop; // Top of the segment
        const lineEnd = nodeCenter; // Center where the node is

        if (triggerPoint >= lineEnd) {
          // Trigger is past the node center - fully filled
          setTopLineFill(1);
        } else if (triggerPoint <= lineStart) {
          // Trigger hasn't reached the top yet - empty
          setTopLineFill(0);
        } else {
          // Trigger is between line start and node - partial fill
          const progress = (triggerPoint - lineStart) / (lineEnd - lineStart);
          setTopLineFill(Math.max(0, Math.min(1, progress)));
        }
      }

      // Bottom line (start/middle): Fill as we scroll past the node
      if (type === 'start' || type === 'middle') {
        const lineStart = nodeCenter; // Center where the node is
        const lineEnd = nodeBottom; // Bottom of the segment

        if (triggerPoint >= lineEnd) {
          // Trigger is past the bottom - fully filled
          setBottomLineFill(1);
        } else if (triggerPoint <= lineStart) {
          // Trigger hasn't reached the node yet - empty
          setBottomLineFill(0);
        } else {
          // Trigger is between node and bottom - partial fill
          const progress = (triggerPoint - lineStart) / (lineEnd - lineStart);
          setBottomLineFill(Math.max(0, Math.min(1, progress)));
        }
      }

      isScheduled = false;
    };

    const scheduleUpdate = () => {
      if (!isScheduled) {
        isScheduled = true;
        rafId = requestAnimationFrame(handleScroll);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener with RAF throttling
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [propActive, scrollOffset, activationThreshold, type]);

  // Build custom CSS properties
  const customStyles = {
    '--node-size': `${nodeSize}px`,
    '--line-width': `${lineWidth}px`,
    ...(activeLineColor && { '--rail-line-active-color': activeLineColor }),
    ...(inactiveLineColor && { '--rail-line-inactive-color': inactiveLineColor }),
    ...(activeNodeColor && { '--rail-node-active-color': activeNodeColor }),
    ...(inactiveNodeColor && { '--rail-node-inactive-color': inactiveNodeColor }),
  } as React.CSSProperties;

  return (
    <div
      ref={nodeRef}
      className={`rail-segment rail-segment--${type} rail-segment--${variant} ${isActive ? 'rail-segment--active' : ''} ${className}`}
      style={customStyles}
    >
      {/* Top line (only for middle and end, OR connected variant for all except start) */}
      {(type === 'middle' || type === 'end' || (variant === 'connected' && type !== 'start')) && (
        <div className="rail-segment__line-container rail-segment__line-container--top">
          <div className="rail-segment__line rail-segment__line--base" />
          <div
            className="rail-segment__line rail-segment__line--fill"
            style={{ transform: `scaleY(${topLineFill})` }}
          />
        </div>
      )}

      {/* Node */}
      <div className="rail-segment__node">
        <div className="rail-segment__node-indicator">
          {displayContent}
        </div>
      </div>

      {/* Bottom line (only for start and middle, OR connected variant for all except end) */}
      {(type === 'start' || type === 'middle' || (variant === 'connected' && type !== 'end')) && (
        <div className="rail-segment__line-container rail-segment__line-container--bottom">
          <div className="rail-segment__line rail-segment__line--base" />
          <div
            className="rail-segment__line rail-segment__line--fill"
            style={{ transform: `scaleY(${bottomLineFill})` }}
          />
        </div>
      )}
    </div>
  );
};
