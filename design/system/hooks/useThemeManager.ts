// ===============================================
// blimpify-ui/design/system/hooks/useThemeManager.ts
// NEW FILE: Lower-level hook for direct manager access
// ===============================================

import { useState } from 'react';
import { ThemeManager } from '../utils/themeManager';

export function useThemeManager() {
  const [themeManager] = useState(() => ThemeManager.getInstance());
  return themeManager;
}