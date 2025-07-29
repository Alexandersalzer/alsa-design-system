// ===============================================
// src/design-system/components/patterns/editor/index.ts
// EDITOR PATTERN EXPORTS - UPDATED FOR WEEK 2
// ===============================================

// ===== LEGACY COMPONENTS (DEPRECATED - Use new core components) =====
// These will be removed in Week 3
export { EditorShell } from './EditorShell';

export { EditorTabs } from './EditorTabs';
export { EditorPanel } from './EditorPanel';
export { EditorSection } from './EditorSection';

// Legacy Types (DEPRECATED)
export type { EditorShellProps } from './EditorShell';
export type { 
  EditorTabsProps, 
  EditorTabItem 
} from './EditorTabs';
export type { EditorPanelProps } from './EditorPanel';
export type { EditorSectionProps } from './EditorSection';


// Note: These are deprecated, use the new core components instead
// export { EditorShell } from './EditorShell'; // → Use EditorLayout
// export { EditorPanel } from './EditorPanel'; // → Use DesignPanel
// export { EditorSection } from './EditorSection'; // → Use PropertySection

export * from './content-editing';