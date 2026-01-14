'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '../../layout/box/Box';
import { Body } from '../../Typography/Typography';

export interface GlobeDataPoint {
  lat: number;
  lon: number;
  count: number;
  country?: string;
  city?: string;
  region?: string;
}

export interface GlobeProps {
  data: GlobeDataPoint[];
  color?: string;
  pointSize?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onPointClick?: (point: GlobeDataPoint) => void;
  onPointHover?: (point: GlobeDataPoint | null) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Globe Component
 * An interactive 3D globe for displaying geographic data points
 * Uses react-globe.gl for rendering
 */
export const Globe: React.FC<GlobeProps> = ({
  data,
  color = '#6366f1', // accent-500 default
  pointSize = 2,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  onPointClick,
  onPointHover,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<GlobeDataPoint | null>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) {
      setIsLoaded(false);
      return;
    }

    const initGlobe = async () => {
      try {
        // Placeholder - actual implementation will use three.js/react-globe.gl when added as dependencies
        // For now, just mark as loaded to show placeholder UI
        setIsLoaded(true);
      } catch (error) {
        console.error('[Globe] Error initializing globe:', error);
        setIsLoaded(false);
      }
    };

    initGlobe();
  }, [data]);

  // Placeholder until three.js/react-globe.gl is added as dependency
  if (data.length === 0) {
    return (
      <Box
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          position: 'relative',
          background: 'var(--surface-default)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
      >
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Body size="sm">Ingen geografisk data tillgänglig</Body>
        </div>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        background: 'var(--surface-default)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {!isLoaded ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Body size="sm">Laddar jordglob...</Body>
          <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
            {data.length} datapunkter
          </Body>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Body size="sm">Jordglob kommer snart</Body>
          <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
            {data.length} datapunkter
          </Body>
        </div>
      )}
      {hoveredPoint && (
        <Box
          style={{
            position: 'absolute',
            top: 'var(--foundation-space-2)',
            left: 'var(--foundation-space-2)',
            padding: 'var(--foundation-space-2)',
            background: 'var(--surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600 }}>
            {hoveredPoint.country || 'Okänt land'}
          </div>
          {hoveredPoint.city && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {hoveredPoint.city}
            </div>
          )}
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hoveredPoint.count} besök
          </div>
        </Box>
      )}
    </Box>
  );
};

