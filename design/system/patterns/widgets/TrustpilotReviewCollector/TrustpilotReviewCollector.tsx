'use client';

import React, { useEffect, useRef } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps } from '../../../core/utils/props';

// ===== TRUSTPILOT REVIEW COLLECTOR PATTERN =====
// Embeds Trustpilot's Review Collector widget (Free plan compatible)
// Allows customers to leave reviews directly from your website

export interface TrustpilotReviewCollectorProps {
  businessUnitId?: string; // Trustpilot Business Unit ID
  reviewUrl?: string; // Direct review URL (alternative to businessUnitId)
  templateId?: string; // Trustpilot template ID (default: Review Collector)
  locale?: string; // Language (sv-SE, en-US, da-DK, etc.)
  theme?: 'light' | 'dark';
  height?: string; // Widget height
}

export const TrustpilotReviewCollector: React.FC<PatternNode> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const widgetRef = useRef<HTMLDivElement>(null);

  const {
    businessUnitId,
    reviewUrl,
    templateId = '53aa8912dec7e10d38f59f36', // Default Review Collector
    locale = 'sv-SE',
    theme = 'light',
    height = '400px'
  } = getPatternProps() as TrustpilotReviewCollectorProps;

  // Construct review URL
  const finalReviewUrl = reviewUrl || (businessUnitId
    ? `https://www.trustpilot.com/evaluate/${businessUnitId}`
    : null);

  useEffect(() => {
    if (typeof window !== 'undefined' && finalReviewUrl) {
      // Load Trustpilot bootstrap script
      const script = document.createElement('script');
      script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;

      script.onload = () => {
        if ((window as any).Trustpilot && widgetRef.current) {
          (window as any).Trustpilot.loadFromElement(widgetRef.current, true);
        }
      };

      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [finalReviewUrl]);

  if (!finalReviewUrl) {
    return null;
  }

  return (
    <div
      ref={widgetRef}
      className="trustpilot-widget"
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height={height}
      data-style-width="100%"
      data-theme={theme}
    >
      <a href={finalReviewUrl} target="_blank" rel="noopener noreferrer">
        Lämna ett omdöme på Trustpilot
      </a>
    </div>
  );
};

TrustpilotReviewCollector.displayName = 'TrustpilotReviewCollector';
