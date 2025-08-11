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
    { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo' },
    { src: '/images/kjlogos/fazerlogo.png', alt: 'Fazer Logo' },
    { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo' },
    { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo' },
    { src: '/images/kjlogos/philips.png', alt: 'Philips Logo' },
    { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo' },
    { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo' },
    { src: '/images/kjlogos/benandjerrylogo.png', alt: 'Ben & Jerry\'s Logo' },
    { src: '/images/kjlogos/mindler.png', alt: 'Mindler Logo' },
    { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo' }
  ],
  speed = 30,
  direction = 'left',
  className = ''
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  // Create exactly 6 copies for seamless infinite loop
  const duplicatedLogos = [
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos
  ];

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
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 