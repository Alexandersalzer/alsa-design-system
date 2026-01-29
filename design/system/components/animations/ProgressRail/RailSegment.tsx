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
  /** Scroll offset to trigger activation (0-1, default 0.75 = 3/4 from top) */
  scrollOffset?: number;
  /** Distance threshold in pixels for activation (default 150px) */
  activationThreshold?: number;
  /** Scroll offset for exit/deactivation (0-1, default 0.15 = near top) */
  exitOffset?: number;
}

export const RailSegment: React.FC<RailSegmentProps> = ({
  type,
  number,
  active: propActive = false,
  nodeSize = 16,
  lineWidth = 1,
  className = '',
  scrollOffset = 0.75,
  activationThreshold = 150,
  exitOffset = 0.15,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(propActive);
  const [topLineFill, setTopLineFill] = useState(0); // 0-1
  const [bottomLineFill, setBottomLineFill] = useState(0); // 0-1

  useEffect(() => {
    // If active is explicitly set to true, use that
    if (propActive) {
      setIsActive(true);
      return;
    }

    const handleScroll = () => {
      if (!nodeRef.current) return;

      const rect = nodeRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * scrollOffset;
      const exitPoint = window.innerHeight * exitOffset;
      const nodeCenter = rect.top + rect.height / 2;
      
      // Activate node when it crosses the trigger point
      // Deactivate when it goes above exit point (near top of screen)
      const isAboveExit = nodeCenter < exitPoint;
      const isBelowTrigger = nodeCenter > triggerPoint;
      
      setIsActive(!isAboveExit && !isBelowTrigger);

      // Top line (middle/end): Fills as the TOP of the line crosses trigger point
      if (type === 'middle' || type === 'end') {
        const topOfLine = rect.top;
        const bottomOfLine = nodeCenter;
        
        let topProgress = 0;
        
        // If above exit point, start emptying
        if (nodeCenter < exitPoint) {
          const exitLineTop = topOfLine;
          const exitLineBottom = bottomOfLine;
          topProgress = exitLineBottom > exitPoint && exitLineTop < exitPoint
            ? 1 - ((exitPoint - exitLineTop) / (exitLineBottom - exitLineTop))
            : exitLineBottom <= exitPoint
              ? 0
              : 1;
        }
        // Normal filling when crossing trigger point
        else {
          topProgress = topOfLine < triggerPoint && bottomOfLine > triggerPoint
            ? (triggerPoint - topOfLine) / (bottomOfLine - topOfLine)
            : topOfLine >= triggerPoint
              ? 0
              : 1;
        }
        
        setTopLineFill(topProgress);
      }
      
      // Bottom line (start/middle): Fills as the BOTTOM of the line crosses trigger point
      if (type === 'start' || type === 'middle') {
        const topOfLine = nodeCenter;
        const bottomOfLine = rect.bottom;
        
        let bottomProgress = 0;
        
        // If above exit point, start emptying
        if (nodeCenter < exitPoint) {
          const exitLineTop = topOfLine;
          const exitLineBottom = bottomOfLine;
          bottomProgress = exitLineBottom > exitPoint && exitLineTop < exitPoint
            ? 1 - ((exitPoint - exitLineTop) / (exitLineBottom - exitLineTop))
            : exitLineBottom <= exitPoint
              ? 0
              : 1;
        }
        // Normal filling when crossing trigger point
        else {
          bottomProgress = topOfLine < triggerPoint && bottomOfLine > triggerPoint
            ? (triggerPoint - topOfLine) / (bottomOfLine - topOfLine)
            : topOfLine >= triggerPoint
              ? 0
              : 1;
        }
        
        setBottomLineFill(bottomProgress);
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
  }, [propActive, scrollOffset, activationThreshold, exitOffset, type]);

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
