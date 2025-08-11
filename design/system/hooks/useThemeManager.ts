// ===============================================
// blimpify-ui/design/system/hooks/useThemeManager.ts
// ===============================================

import { useState } from 'react';
import { ThemeManager } from '../utils/themeManager';

export function useThemeManager() {
  const [themeManager] = useState(() => ThemeManager.getInstance());
  return themeManager;
}