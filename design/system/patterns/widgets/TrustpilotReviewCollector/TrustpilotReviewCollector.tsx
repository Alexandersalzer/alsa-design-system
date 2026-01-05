'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps } from '../../../core/utils/props';
import { Box, Button } from '@blimpify-im/ui';

// ===== TRUSTPILOT REVIEW LINK PATTERN =====
// Simple button that links to Trustpilot review page
// Works with Free Trustpilot plan

export interface TrustpilotReviewCollectorProps {
  reviewUrl?: string; // Direct Trustpilot review URL
  buttonText?: string; // Button text
  buttonVariant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
}

export const TrustpilotReviewCollector: React.FC<PatternNode> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);

  const {
    reviewUrl = 'https://www.trustpilot.com/evaluate/kjmarketingsweden.com',
    buttonText = 'Lämna ett omdöme på Trustpilot',
    buttonVariant = 'primary'
  } = getPatternProps() as TrustpilotReviewCollectorProps;

  if (!reviewUrl) {
    return null;
  }

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
};

TrustpilotReviewCollector.displayName = 'TrustpilotReviewCollector';
