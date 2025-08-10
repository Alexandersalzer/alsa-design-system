'use client';

import { useEffect, useRef } from 'react';
import './SpinningBanner.css';

interface SpinningBannerProps {
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  speed?: number; // Animation speed in seconds
  direction?: 'left' | 'right';
  className?: string;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  logos = [
    { src: '/images/sections/kjlogo.jpg', alt: 'KJ Marketing Logo', width: 60, height: 60 }
  ],
  speed = 15,
  direction = 'left',
  className = ''
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  // Create multiple copies of logos for seamless scrolling
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Set CSS custom properties for animation
    banner.style.setProperty('--animation-duration', `${speed}s`);
    banner.style.setProperty('--animation-direction', direction === 'left' ? 'normal' : 'reverse');
  }, [speed, direction]);

  return (
    <div className={`spinning-banner-container ${className}`}>
      <div ref={bannerRef} className="spinning-banner-track">
        {duplicatedLogos.map((logo, index) => (
          <div key={`${logo.src}-${index}`} className="logo-item">
            <img
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 60}
              height={logo.height || 60}
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 