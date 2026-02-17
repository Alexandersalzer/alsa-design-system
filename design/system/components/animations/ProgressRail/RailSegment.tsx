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
  const segmentRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(propActive);
  const [lineFill, setLineFill] = useState(0); // 0-1 for the single line below the node

  // Use content if provided, otherwise fall back to deprecated number prop
  const displayContent = content !== undefined ? content : number;

  useEffect(() => {
    // If active is explicitly set to true, use that
    if (propActive) {
      setIsActive(true);
      setLineFill(1);
      return;
    }

    let rafId: number | null = null;
    let isScheduled = false;

    const handleScroll = () => {
      if (!segmentRef.current) return;

      const rect = segmentRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * scrollOffset;

      // Node is at the top of the segment
      const nodePosition = rect.top;

      // Activate node when it crosses the trigger point
      setIsActive(nodePosition <= triggerPoint);

      // For connected variant: fill the line below the node as we scroll
      // Line starts right after the node and goes to the bottom of the segment
      if (type !== 'end') {
        const lineStart = nodePosition; // Where the node is
        const lineEnd = rect.bottom; // Bottom of segment

        if (triggerPoint >= lineEnd) {
          // Scrolled past the entire segment - fully filled
          setLineFill(1);
        } else if (triggerPoint <= lineStart) {
          // Haven't reached the node yet - empty
          setLineFill(0);
        } else {
          // Between node and bottom - progressive fill
          const progress = (triggerPoint - lineStart) / (lineEnd - lineStart);
          setLineFill(Math.max(0, Math.min(1, progress)));
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
  }, [propActive, scrollOffset, type]);

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
      ref={segmentRef}
      className={`rail-segment rail-segment--${type} rail-segment--${variant} ${isActive ? 'rail-segment--active' : ''} ${className}`}
      style={customStyles}
    >
      {/* Node at the top */}
      <div className="rail-segment__node">
        <div className="rail-segment__node-indicator">
          {displayContent}
        </div>
      </div>

      {/* Single line below the node (all except end type) */}
      {type !== 'end' && (
        <div className="rail-segment__line-container rail-segment__line-container--bottom">
          <div className="rail-segment__line rail-segment__line--base" />
          <div
            className="rail-segment__line rail-segment__line--fill"
            style={{ transform: `scaleY(${lineFill})` }}
          />
        </div>
      )}
    </div>
  );
};
