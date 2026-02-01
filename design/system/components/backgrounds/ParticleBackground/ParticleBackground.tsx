'use client';

import React, { useEffect, useRef, useMemo } from 'react';

export type ParticleColorScheme = 'light' | 'warm' | 'cool' | 'accent' | 'custom';

export interface ParticleBackgroundProps {
  /** Number of particles (default: 80) */
  count?: number;
  /** Color scheme for particles */
  colorScheme?: ParticleColorScheme;
  /** Custom colors array (used when colorScheme is 'custom') */
  customColors?: string[];
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Minimum particle size in px (default: 1) */
  minSize?: number;
  /** Maximum particle size in px (default: 2) */
  maxSize?: number;
  /** Minimum opacity (default: 0.4) */
  minOpacity?: number;
  /** Maximum opacity (default: 1) */
  maxOpacity?: number;
  /** Blur amount in px (default: 0.25) */
  blur?: number;
}

// Color presets
const COLOR_SCHEMES: Record<ParticleColorScheme, string[]> = {
  light: [
    'rgb(255, 255, 255)',
    'rgb(255, 250, 250)',
    'rgb(250, 250, 255)',
    'rgb(255, 255, 250)',
  ],
  warm: [
    'rgb(255, 242, 166)',
    'rgb(255, 235, 128)',
    'rgb(255, 250, 205)',
    'rgb(255, 245, 180)',
  ],
  cool: [
    'rgb(200, 220, 255)',
    'rgb(180, 200, 240)',
    'rgb(220, 230, 255)',
    'rgb(190, 210, 250)',
  ],
  accent: [
    'rgb(200, 180, 255)',
    'rgb(220, 200, 255)',
    'rgb(180, 160, 240)',
    'rgb(210, 190, 255)',
  ],
  custom: [],
};

interface ParticleState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  targetX: number;
  targetY: number;
  targetScale: number;
  targetOpacity: number;
  speedX: number;
  speedY: number;
  speedScale: number;
  speedOpacity: number;
}

// Seeded random for consistent initial state
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 80,
  colorScheme = 'warm',
  customColors = [],
  speed = 1,
  minSize = 1,
  maxSize = 2,
  minOpacity = 0.4,
  maxOpacity = 1,
  blur = 0.25,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleStates = useRef<ParticleState[]>([]);
  const animationRef = useRef<number>();

  // Get colors based on scheme
  const colors = useMemo(() => {
    if (colorScheme === 'custom' && customColors.length > 0) {
      return customColors;
    }
    return COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.warm;
  }, [colorScheme, customColors]);

  // Generate particle data (static properties)
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 1337;
      data.push({
        id: i,
        size: minSize + seededRandom(seed + 2) * (maxSize - minSize),
        color: colors[Math.floor(seededRandom(seed + 3) * colors.length)],
      });
    }
    return data;
  }, [count, colors, minSize, maxSize]);

  // Initialize particle states
  useEffect(() => {
    const states: ParticleState[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 1337;
      states.push({
        x: seededRandom(seed) * 100,
        y: seededRandom(seed + 1) * 100,
        scale: 0.8 + seededRandom(seed + 5) * 0.4,
        opacity: minOpacity + seededRandom(seed + 4) * (maxOpacity - minOpacity),
        targetX: seededRandom(seed + 6) * 100,
        targetY: seededRandom(seed + 7) * 100,
        targetScale: 0.9 + seededRandom(seed + 8) * 0.3,
        targetOpacity: minOpacity + seededRandom(seed + 9) * (maxOpacity - minOpacity),
        speedX: 0.00015 + seededRandom(seed + 10) * 0.00025,
        speedY: 0.00015 + seededRandom(seed + 11) * 0.00025,
        speedScale: 0.0004 + seededRandom(seed + 12) * 0.0008,
        speedOpacity: 0.0002 + seededRandom(seed + 13) * 0.0004,
      });
    }
    particleStates.current = states;

    // Set initial positions
    states.forEach((state, i) => {
      const el = particleRefs.current[i];
      if (el) {
        el.style.left = `${state.x}%`;
        el.style.top = `${state.y}%`;
        el.style.opacity = String(state.opacity);
        el.style.transform = `scale(${state.scale})`;
      }
    });
  }, [count, minOpacity, maxOpacity]);

  // Animation loop - directly manipulates DOM via refs (no React re-render)
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) * speed;
      lastTime = currentTime;

      const states = particleStates.current;

      for (let i = 0; i < states.length; i++) {
        const p = states[i];
        const el = particleRefs.current[i];
        if (!el) continue;

        // Smoothly interpolate towards targets
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dScale = p.targetScale - p.scale;
        const dOpacity = p.targetOpacity - p.opacity;

        p.x += dx * p.speedX * deltaTime;
        p.y += dy * p.speedY * deltaTime;
        p.scale += dScale * p.speedScale * deltaTime;
        p.opacity += dOpacity * p.speedOpacity * deltaTime;

        // When close to target, pick new target
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          p.targetX = Math.random() * 100;
          p.targetY = Math.random() * 100;
        }
        if (Math.abs(dScale) < 0.02) {
          p.targetScale = 0.9 + Math.random() * 0.3;
        }
        if (Math.abs(dOpacity) < 0.03) {
          p.targetOpacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
        }

        // Direct DOM update (no React re-render)
        el.style.left = `${p.x}%`;
        el.style.top = `${p.y}%`;
        el.style.opacity = String(p.opacity);
        el.style.transform = `scale(${p.scale})`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, minOpacity, maxOpacity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
      }}
    >
      {particleData.map((p, index) => (
        <div
          key={p.id}
          ref={(el) => { particleRefs.current[index] = el; }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '50%',
            filter: `blur(${blur}px)`,
            willChange: 'transform, opacity, left, top',
          }}
        />
      ))}
    </div>
  );
};
