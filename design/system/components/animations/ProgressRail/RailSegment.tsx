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
  /** Scroll offset to trigger deactivation when leaving screen (0-1, default 0.1 = near top) */
  deactivationOffset?: number;
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
  scrollOffset = 0.75,
  deactivationOffset = 0.1,
  activationThreshold = 150,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [isActive, setIsActive] = useState(propActive);
  const [topLineFill, setTopLineFill] = useState(0); // 0-1
  const [bottomLineFill, setBottomLineFill] = useState(0); // 0-1
  const [fillDirection, setFillDirection] = useState<'down' | 'up'>('down'); // Track scroll direction for fill animation

  useEffect(() => {
    // If active is explicitly set to true, use that
    if (propActive) {
      setIsActive(true);
      return;
    }

    const handleScroll = () => {
      if (!nodeRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const rect = nodeRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * scrollOffset;
      const deactivatePoint = window.innerHeight * deactivationOffset;
      const nodeCenter = rect.top + rect.height / 2;
      
      // Activate node when it's between deactivation point and trigger point
      // Active when: passed trigger point AND not yet passed deactivation point
      setIsActive(nodeCenter <= triggerPoint && nodeCenter >= deactivatePoint);

      // Top line (middle/end): Fills when crossing trigger, empties when crossing deactivate
      if (type === 'middle' || type === 'end') {
        const topOfLine = rect.top;
        const bottomOfLine = nodeCenter;
        
        // Check if we're in the deactivation zone (emptying from scrolling down)
        if (bottomOfLine < deactivatePoint) {
          setFillDirection('down'); // Emptying while scrolling down
          const unfillProgress = topOfLine < deactivatePoint && bottomOfLine < deactivatePoint
            ? 0
            : (deactivatePoint - topOfLine) / (bottomOfLine - topOfLine);
          setTopLineFill(Math.max(0, unfillProgress));
        } else if (topOfLine < triggerPoint && bottomOfLine > triggerPoint) {
          // Crossing trigger point
          if (scrollingDown) {
            setFillDirection('down'); // Filling from top
          } else {
            setFillDirection('up'); // Re-filling from bottom
          }
          const fillProgress = (triggerPoint - topOfLine) / (bottomOfLine - topOfLine);
          setTopLineFill(fillProgress);
        } else if (topOfLine >= triggerPoint) {
          // Below trigger - check direction for re-activation
          if (!scrollingDown && topLineFill > 0) {
            setFillDirection('up');
          }
          setTopLineFill(0);
        } else {
          setTopLineFill(1);
        }
      }
      
      // Bottom line (start/middle): Same logic
      if (type === 'start' || type === 'middle') {
        const topOfLine = nodeCenter;
        const bottomOfLine = rect.bottom;
        
        // Check if we're in the deactivation zone (emptying from scrolling down)
        if (bottomOfLine < deactivatePoint) {
          setFillDirection('down'); // Emptying while scrolling down
          const unfillProgress = topOfLine < deactivatePoint && bottomOfLine < deactivatePoint
            ? 0
            : (deactivatePoint - topOfLine) / (bottomOfLine - topOfLine);
          setBottomLineFill(Math.max(0, unfillProgress));
        } else if (topOfLine < triggerPoint && bottomOfLine > triggerPoint) {
          // Crossing trigger point
          if (scrollingDown) {
            setFillDirection('down'); // Filling from top
          } else {
            setFillDirection('up'); // Re-filling from bottom
          }
          const fillProgress = (triggerPoint - topOfLine) / (bottomOfLine - topOfLine);
          setBottomLineFill(fillProgress);
        } else if (topOfLine >= triggerPoint) {
          // Below trigger - check direction for re-activation
          if (!scrollingDown && bottomLineFill > 0) {
            setFillDirection('up');
          }
          setBottomLineFill(0);
        } else {
          setBottomLineFill(1);
        }
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
  }, [propActive, scrollOffset, deactivationOffset, activationThreshold, type]);

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
            style={{ 
              transform: `scaleY(${topLineFill})`,
              transformOrigin: fillDirection === 'down' ? 'top' : 'bottom'
            }}
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
            style={{ 
              transform: `scaleY(${bottomLineFill})`,
              transformOrigin: fillDirection === 'down' ? 'top' : 'bottom'
            }}
          />
        </div>
      )}
    </div>
  );
};
