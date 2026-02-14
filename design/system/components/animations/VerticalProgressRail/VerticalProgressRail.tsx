// ===============================================
// VerticalProgressRail.tsx
// Single continuous vertical rail with evenly distributed nodes
// Fills progressively based on scroll position
// ===============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './VerticalProgressRail.css';

export interface VerticalProgressRailProps {
  /** Number of nodes to display */
  steps?: number;
  /** Size of node indicators in pixels */
  nodeSize?: number;
  /** Width of the rail line in pixels */
  lineWidth?: number;
  /** Color of the active (filled) portion */
  activeColor?: string;
  /** Color of the inactive (unfilled) portion */
  inactiveColor?: string;
  /** Scroll offset for activation (0-1, default 0.9 = 90% down viewport) */
  scrollOffset?: number;
  /** Custom className */
  className?: string;
}

export const VerticalProgressRail: React.FC<VerticalProgressRailProps> = ({
  steps = 4,
  nodeSize = 24,
  lineWidth = 2,
  activeColor = 'var(--color-primary, #000)',
  inactiveColor = 'var(--color-border, #e0e0e0)',
  scrollOffset = 0.90,
  className = '',
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    if (!railRef.current) return;

    let rafId: number;
    let isScheduled = false;

    const handleScroll = () => {
      if (!railRef.current) return;

      const rect = railRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * scrollOffset;

      // Calculate how much of the rail has passed the trigger point
      const railTop = rect.top;
      const railHeight = rect.height;
      const railBottom = railTop + railHeight;

      let percentage = 0;

      if (railBottom <= triggerPoint) {
        // Entire rail has passed trigger point
        percentage = 100;
      } else if (railTop <= triggerPoint) {
        // Rail is partially past trigger point
        const passedDistance = triggerPoint - railTop;
        percentage = (passedDistance / railHeight) * 100;
      }

      setFillPercentage(Math.max(0, Math.min(100, percentage)));
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

    // Listen to scroll
    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollOffset]);

  // Calculate node positions (evenly distributed)
  const nodePositions = Array.from({ length: steps }, (_, i) => {
    if (steps === 1) return 50; // Single node in center
    return (i / (steps - 1)) * 100; // Distribute from 0% to 100%
  });

  return (
    <div
      ref={railRef}
      className={`vertical-progress-rail ${className}`}
      style={{
        ['--node-size' as any]: `${nodeSize}px`,
        ['--line-width' as any]: `${lineWidth}px`,
        ['--active-color' as any]: activeColor,
        ['--inactive-color' as any]: inactiveColor,
      }}
    >
      {/* Background line (inactive) */}
      <div className="vertical-progress-rail__line vertical-progress-rail__line--inactive" />

      {/* Foreground line (active/filled) */}
      <div
        className="vertical-progress-rail__line vertical-progress-rail__line--active"
        style={{ height: `${fillPercentage}%` }}
      />

      {/* Nodes */}
      {nodePositions.map((position, index) => {
        const isActive = fillPercentage >= position;
        return (
          <div
            key={index}
            className={`vertical-progress-rail__node ${
              isActive ? 'vertical-progress-rail__node--active' : ''
            }`}
            style={{ top: `${position}%` }}
          >
            <span className="vertical-progress-rail__node-number">
              {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};
