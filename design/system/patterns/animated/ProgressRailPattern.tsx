// ===============================================
// patterns/animated/ProgressRailPattern.tsx
// Progress Rail Pattern Wrapper
// ===============================================

import React from 'react';
import { ProgressRail } from '../../components/animations/ProgressRail/ProgressRail';

interface ProgressRailPatternProps {
  components?: Record<string, any>;
  props?: any;
  order?: string[];
  sectionKey?: string;
  patternKey?: string;
}

/**
 * Pattern wrapper for ProgressRail component
 * Allows ProgressRail to be used as a pattern in sections
 */
export const ProgressRailPattern: React.FC<ProgressRailPatternProps> = ({
  props = {},
}) => {
  return <ProgressRail {...props} />;
};
