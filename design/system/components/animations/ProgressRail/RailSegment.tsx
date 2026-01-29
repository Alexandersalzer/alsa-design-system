// ===============================================
// RailSegment.tsx - Modular rail pieces that stack together
// ===============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './RailSegment.css';

export interface RailSegmentProps {
  /** Segment type: start, middle, or end */
  type: 'start' | 'middle' | 'end';
  /** Node number to display */
  number: string;
  /** Whether this segment is active (can be overridden by scroll) */
  active?: boolean;
  /** Size of the node dot */
  nodeSize?: number;
  /** Width of the connecting line */
  lineWidth?: number;
  /** Custom className */
  className?: string;
  /** Scroll offset to trigger activation (0-1, default 0.33 = 1/3 from top) */
  scrollOffset?: number;
  /** Distance threshold in pixels for activation (default 150px) */
  activationThreshold?: number;
}

export const RailSegment: React.FC<RailSegmentProps> = ({
  type,
  number,
  active: propActive = false,
  nodeSize = 16,
  lineWidth = 1,
  className = '',
  scrollOffset = 0.33,
  activationThreshold = 150,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(propActive);
  const [topLineFill, setTopLineFill] = useState(0); // 0-1
  const [bottomLineFill, setBottomLineFill] = useState(0); // 0-1

  useEffect(() => {
    // If active is explicitly set to true, use that
    if (propActive) {
      setIsActive(true);
      setTopLineFill(1);
      setBottomLineFill(1);
      return;
    }

    const handleScroll = () => {
      if (!nodeRef.current) return;

      const rect = nodeRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * scrollOffset;
      const nodeCenter = rect.top + rect.height / 2;
      
      // Distance from node to trigger point (positive = below trigger, negative = above)
      const distanceFromTrigger = triggerPoint - nodeCenter;
      
      // Node activates when it reaches trigger point (within threshold)
      const atTrigger = Math.abs(distanceFromTrigger) < activationThreshold;
      const hasReachedTrigger = distanceFromTrigger <= 0;
      setIsActive(atTrigger || hasReachedTrigger);

      // Calculate fill progress as node approaches trigger from below
      // Lines fill 0 → 100% as node moves from bottom of viewport to trigger point
      const fillRange = window.innerHeight * 0.3; // Fill range: 30% of viewport before trigger
      const distanceBeforeTrigger = Math.max(0, distanceFromTrigger); // Positive when below trigger
      const fillProgress = Math.max(0, Math.min(1, 1 - (distanceBeforeTrigger / fillRange)));

      // Top line fills as node approaches trigger from below
      if (type === 'middle' || type === 'end') {
        setTopLineFill(fillProgress);
      }
      
      // Bottom line fills as node approaches trigger from below
      if (type === 'start' || type === 'middle') {
        setBottomLineFill(fillProgress);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [propActive, scrollOffset, activationThreshold, type]);

  return (
    <div 
      ref={nodeRef}
      className={`rail-segment rail-segment--${type} ${isActive ? 'rail-segment--active' : ''} ${className}`}
      style={{
        '--node-size': `${nodeSize}px`,
        '--line-width': `${lineWidth}px`,
      } as React.CSSProperties}
    >
      {/* Top line (only for middle and end) */}
      {(type === 'middle' || type === 'end') && (
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
        <div className="rail-segment__node-dot" />
        <div className="rail-segment__node-label">{number}</div>
      </div>
      
      {/* Bottom line (only for start and middle) */}
      {(type === 'start' || type === 'middle') && (
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
