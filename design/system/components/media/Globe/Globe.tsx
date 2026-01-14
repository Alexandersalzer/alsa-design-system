'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  const globeRef = useRef<any>(null);

  // Dynamically import react-globe.gl
  useEffect(() => {
    const loadGlobe = async () => {
      try {
        const Globe = (await import('react-globe.gl')).default;
        setGlobeComponent(() => Globe);
        setIsLoaded(true);
      } catch (error) {
        console.error('[Globe] Error loading react-globe.gl:', error);
        setIsLoaded(false);
      }
    };

    loadGlobe();
  }, []);

  // Prepare points data for react-globe.gl
  const points = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(point => ({
      lat: point.lat,
      lng: point.lon,
      size: Math.max(pointSize * 0.5, Math.min(pointSize * 2, point.count / 10)),
      color: color,
      count: point.count,
      country: point.country,
      city: point.city,
      region: point.region
    }));
  }, [data, pointSize, color]);

  // Handle point hover
  const handlePointHover = (point: any) => {
    if (point) {
      const dataPoint: GlobeDataPoint = {
        lat: point.lat,
        lon: point.lng,
        count: point.count,
        country: point.country,
        city: point.city,
        region: point.region
      };
      setHoveredPoint(dataPoint);
      if (onPointHover) onPointHover(dataPoint);
    } else {
      setHoveredPoint(null);
      if (onPointHover) onPointHover(null);
    }
  };

  // Handle point click
  const handlePointClick = (point: any) => {
    if (onPointClick && point) {
      const dataPoint: GlobeDataPoint = {
        lat: point.lat,
        lon: point.lng,
        count: point.count,
        country: point.country,
        city: point.city,
        region: point.region
      };
      onPointClick(dataPoint);
    }
  };

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

  if (!isLoaded || !GlobeComponent) {
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
          <Body size="sm">Laddar jordglob...</Body>
          <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
            {data.length} datapunkter
          </Body>
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
        overflow: 'hidden',
        ...style
      }}
    >
      <GlobeComponent
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointColor="color"
        pointRadius="size"
        pointLabel={(d: any) => `
          <div style="padding: 8px; background: var(--surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-default);">
            <div style="font-weight: 600; font-size: 12px;">${d.country || 'Okänt land'}</div>
            ${d.city ? `<div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${d.city}</div>` : ''}
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${d.count} besök</div>
          </div>
        `}
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        enablePointerInteraction={true}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        showGlobe={true}
        showGraticules={false}
        pointResolution={2}
        pointMerge={false}
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 400}
      />
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

