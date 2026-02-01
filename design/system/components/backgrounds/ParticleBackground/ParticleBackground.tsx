'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';

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

// Color presets for light and dark modes
const COLOR_SCHEMES_LIGHT: Record<ParticleColorScheme, string[]> = {
  light: [
    'rgb(40, 40, 40)',
    'rgb(60, 60, 60)',
    'rgb(30, 30, 30)',
    'rgb(50, 50, 50)',
  ],
  warm: [
    'rgb(120, 80, 20)',
    'rgb(100, 60, 10)',
    'rgb(140, 100, 40)',
    'rgb(110, 70, 15)',
  ],
  cool: [
    'rgb(40, 80, 140)',
    'rgb(30, 60, 120)',
    'rgb(50, 100, 160)',
    'rgb(35, 70, 130)',
  ],
  accent: [
    'rgb(100, 50, 150)',
    'rgb(120, 70, 170)',
    'rgb(80, 30, 130)',
    'rgb(110, 60, 160)',
  ],
  custom: [],
};

const COLOR_SCHEMES_DARK: Record<ParticleColorScheme, string[]> = {
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
  count = 50,
  colorScheme = 'warm',
  customColors = [],
  speed = 1,
  minSize = 1,
  maxSize = 1.8,
  minOpacity = 0.5,
  maxOpacity = 0.95,
  blur = 0.25,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleStates = useRef<ParticleState[]>([]);
  const animationRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode and listen for changes
  useEffect(() => {
    setMounted(true);
    
    // Check for dark mode via CSS variable or media query
    const checkDarkMode = () => {
      // First try to read from CSS variable (design system)
      const root = document.documentElement;
      const isDarkVar = getComputedStyle(root).getPropertyValue('--is-dark').trim();
      if (isDarkVar === '1' || isDarkVar === 'true') {
        setIsDark(true);
        return;
      }
      // Fallback to data attribute
      if (root.getAttribute('data-theme') === 'dark' || root.classList.contains('dark')) {
        setIsDark(true);
        return;
      }
      // Fallback to media query
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);
    
    // Also observe for class/attribute changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'style'] 
    });
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  // Get colors based on scheme and theme
  const colors = useMemo(() => {
    if (colorScheme === 'custom' && customColors.length > 0) {
      return customColors;
    }
    const schemes = isDark ? COLOR_SCHEMES_DARK : COLOR_SCHEMES_LIGHT;
    return schemes[colorScheme] || schemes.warm;
  }, [colorScheme, customColors, isDark]);

  // Generate particle data (static properties) - round to 2 decimals for SSR consistency
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 1337;
      const size = minSize + seededRandom(seed + 2) * (maxSize - minSize);
      const colorIndex = Math.floor(seededRandom(seed + 3) * colors.length);
      data.push({
        id: i,
        size: Math.round(size * 100) / 100, // Round to 2 decimals for hydration
        color: colors[colorIndex],
        colorIndex, // Store index to update color when theme changes
      });
    }
    return data;
  }, [count, colors, minSize, maxSize]);

  // Update particle colors when theme changes
  useEffect(() => {
    if (!mounted) return;
    particleData.forEach((p, index) => {
      const el = particleRefs.current[index];
      if (el) {
        el.style.backgroundColor = p.color;
      }
    });
  }, [particleData, mounted]);

  // Initialize particle states
  useEffect(() => {
    const states: ParticleState[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 1337;
      const startX = seededRandom(seed) * 100;
      const startY = seededRandom(seed + 1) * 100;
      const startScale = 0.9 + seededRandom(seed + 5) * 0.2;
      const startOpacity = minOpacity + seededRandom(seed + 4) * (maxOpacity - minOpacity);
      
      // Start targets close to initial position (within 5% range)
      states.push({
        x: startX,
        y: startY,
        scale: startScale,
        opacity: startOpacity,
        targetX: startX + (seededRandom(seed + 6) - 0.5) * 10, // ±5% from start
        targetY: startY + (seededRandom(seed + 7) - 0.5) * 10, // ±5% from start
        targetScale: startScale + (seededRandom(seed + 8) - 0.5) * 0.2,
        targetOpacity: startOpacity + (seededRandom(seed + 9) - 0.5) * 0.2,
        speedX: 0.00015 + seededRandom(seed + 10) * 0.00025,
        speedY: 0.00015 + seededRandom(seed + 11) * 0.00025,
        speedScale: 0.0004 + seededRandom(seed + 12) * 0.0008,
        speedOpacity: 0.0002 + seededRandom(seed + 13) * 0.0004,
      });
    }
    particleStates.current = states;

    // Set initial positions then show
    requestAnimationFrame(() => {
      states.forEach((state, i) => {
        const el = particleRefs.current[i];
        if (el) {
          el.style.left = `${state.x}%`;
          el.style.top = `${state.y}%`;
          el.style.opacity = String(state.opacity);
          el.style.transform = `scale(${state.scale})`;
        }
      });
      // Show particles after positions are set
      requestAnimationFrame(() => {
        setReady(true);
      });
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

        // Clamp values to prevent drift
        p.scale = Math.max(0.8, Math.min(1.2, p.scale));
        p.opacity = Math.max(minOpacity, Math.min(maxOpacity, p.opacity));

        // When close to target, pick new target (always within ±15% of current position)
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          const drift = 15; // Max drift in percentage
          p.targetX = Math.max(0, Math.min(100, p.x + (Math.random() - 0.5) * drift * 2));
          p.targetY = Math.max(0, Math.min(100, p.y + (Math.random() - 0.5) * drift * 2));
        }
        if (Math.abs(dScale) < 0.02) {
          p.targetScale = Math.max(0.8, Math.min(1.2, p.scale + (Math.random() - 0.5) * 0.2));
        }
        if (Math.abs(dOpacity) < 0.03) {
          p.targetOpacity = Math.max(minOpacity, Math.min(maxOpacity, p.opacity + (Math.random() - 0.5) * 0.3));
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
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {mounted && particleData.map((p, index) => (
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
