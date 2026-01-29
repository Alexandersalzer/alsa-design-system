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
  /** Scroll offset to trigger activation (0-1, default 0.5 = center of viewport) */
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
  scrollOffset = 0.5,
  activationThreshold = 150,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(propActive);

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
      const nodeCenter = rect.top + rect.height / 2;
      
      // Calculate distance from trigger point
      const distance = Math.abs(nodeCenter - triggerPoint);
      
      // Activate if node center is within threshold distance of trigger point
      setIsActive(distance < activationThreshold);
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
  }, [propActive, scrollOffset, activationThreshold]);

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
        <div className="rail-segment__line rail-segment__line--top" />
      )}
      
      {/* Node */}
      <div className="rail-segment__node">
        <div className="rail-segment__node-dot" />
        <div className="rail-segment__node-label">{number}</div>
      </div>
      
      {/* Bottom line (only for start and middle) */}
      {(type === 'start' || type === 'middle') && (
        <div className="rail-segment__line rail-segment__line--bottom" />
      )}
    </div>
  );
};
