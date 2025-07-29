// ===============================================
// src/design-system/components/patterns/layout/index.ts
// LAYOUT PATTERN EXPORTS - UPDATED
// ===============================================

export { Layout, PageContainer } from './Layout';
export type { LayoutProps, PageContainerProps } from './Layout';

export { MainContent, ContentSection } from './MainContent';
export type { MainContentProps, ContentSectionProps } from './MainContent';

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './sidebar';
export type { SidebarProps, SidebarHeaderProps, SidebarContentProps, SidebarFooterProps } from './sidebar';


// NEW: Static page layouts (Phase 1)
export { 
  StaticPageLayout, 
  AuthLayout, 
  PaywallLayout, 
  LandingLayout 
} from './StaticPageLayout';

export type { 
  StaticPageLayoutProps, 
  AuthLayoutProps, 
  PaywallLayoutProps, 
  LandingLayoutProps 
} from './StaticPageLayout';

// NEW: App Layout system
export { 
  AppLayout, 
  AppLayoutHeader, 
  AppLayoutSidebar, 
  AppLayoutMain,
  type AppLayoutProps,
  type AppLayoutHeaderProps,
  type AppLayoutSidebarProps,
  type AppLayoutMainProps
} from './AppLayout';

// ===============================================
// src/design-system/components/patterns/editor/design-panel/index.ts
// DESIGN PANEL COMPONENTS EXPORTS - Week 2
// ===============================================
export { 
  PropertyGroup,
  InlinePropertyGroup,
  GridPropertyGroup,
  HorizontalPropertyGroup,
  VerticalPropertyGroup,
  ColorPickerGroup,
  InputPairGroup,
  ToggleListGroup
} from './PropertyGroup';


export type { 
  PropertyGroupProps,
  InlinePropertyGroupProps,
  GridPropertyGroupProps,
  HorizontalPropertyGroupProps,
  VerticalPropertyGroupProps,
  ColorPickerGroupProps,
  InputPairGroupProps,
  ToggleListGroupProps
} from './PropertyGroup';