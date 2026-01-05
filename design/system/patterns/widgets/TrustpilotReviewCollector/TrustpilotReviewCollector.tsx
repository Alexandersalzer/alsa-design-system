'use client';

import React, { useEffect, useRef } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps } from '../../../core/utils/props';
import { Box, Button } from '@blimpify-im/ui';

// ===== TRUSTPILOT REVIEW COLLECTOR PATTERN =====
// Two modes: 'button' (simple link) or 'widget' (embedded TrustBox)

export interface TrustpilotReviewCollectorProps {
  mode?: 'button' | 'widget'; // Choose between button link or embedded widget

  // Button mode props
  reviewUrl?: string; // Direct Trustpilot review URL
  buttonText?: string; // Button text
  buttonVariant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';

  // Widget mode props
  businessUnitId?: string; // Your Trustpilot Business Unit ID
  locale?: string; // Language (sv-SE, en-US, da-DK, etc.)
  templateId?: string; // TrustBox template ID
  height?: string; // Widget height
  stars?: string; // Pre-selected stars (1-5)
}

export const TrustpilotReviewCollector: React.FC<PatternNode> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const {
    mode = 'button',
    reviewUrl,
    buttonText = 'Lämna ett omdöme på Trustpilot',
    buttonVariant = 'primary',
    businessUnitId,
    locale = 'sv-SE',
    templateId = '53aa8912dec7e10d38f59f36',
    height = '500px',
    stars = '5'
  } = getPatternProps() as TrustpilotReviewCollectorProps;

  // Load Trustpilot widget script (only for widget mode)
  useEffect(() => {
    if (mode !== 'widget' || typeof window === 'undefined' || !businessUnitId) return;

    const existingScript = document.querySelector('script[src*="tp.widget.bootstrap.min.js"]');

    if (existingScript) {
      if ((window as any).Trustpilot && widgetRef.current) {
        (window as any).Trustpilot.loadFromElement(widgetRef.current, true);
      }
      return;
    }

    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        if ((window as any).Trustpilot && widgetRef.current) {
          (window as any).Trustpilot.loadFromElement(widgetRef.current, true);
        }
      };

      document.head.appendChild(script);
    }
  }, [mode, businessUnitId]);

  // BUTTON MODE: Simple link button
  if (mode === 'button') {
    if (!reviewUrl) return null;

    return (
      <Box display="flex" justify="center" align="center" padding="lg">
        <Button
          href={reviewUrl}
          target="_blank"
          variant={buttonVariant}
          size="lg"
        >
          {buttonText}
        </Button>
      </Box>
    );
  }

  // WIDGET MODE: Embedded TrustBox
  if (mode === 'widget') {
    if (!businessUnitId) return null;

    return (
      <Box display="flex" justify="center" padding="lg">
        <div
          ref={widgetRef}
          className="trustpilot-widget"
          data-locale={locale}
          data-template-id={templateId}
          data-businessunit-id={businessUnitId}
          data-style-height={height}
          data-style-width="100%"
          data-stars={stars}
          style={{ maxWidth: '750px', width: '100%' }}
        >
          <a
            href={`https://www.trustpilot.com/evaluate/${businessUnitId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Trustpilot
          </a>
        </div>
      </Box>
    );
  }

  return null;
};

TrustpilotReviewCollector.displayName = 'TrustpilotReviewCollector';
