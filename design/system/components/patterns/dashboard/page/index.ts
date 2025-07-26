// ===============================================
// src/design-system/components/patterns/page/index.ts
// PAGE PATTERN EXPORTS - COMPLETE LAYOUT SYSTEM
// ===============================================

// Existing page components (commented out - replace with new ones)
// export { default as pageHeader } from './pageHeader'; // Your existing component
// export { PageHeader } from './pageHeader';
// export type { PageHeaderProps } from './pageHeader';

// ===== CORE PAGE CONTENT SYSTEM ===== ✅ EXISTING
export {
  PageContent,
  PageSection,
  ContentContainer,
  type PageContentProps,
  type PageSectionProps,
  type ContentContainerProps
} from './PageContent';

// ===== PAGE HEADER SYSTEM ===== 🆕 NEW (need to create)
export {
  PageHeader,
  DashboardHeader,
  SettingsHeader,
  ArticleHeader,
  StatusBadge,
  type PageHeaderProps,
  type DashboardHeaderProps,
  type SettingsHeaderProps,
  type ArticleHeaderProps,
  type StatusBadgeProps
} from './PageHeader';
