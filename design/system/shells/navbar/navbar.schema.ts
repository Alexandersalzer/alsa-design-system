/**
 * Navbar Pattern Schema
 *
 * Defines editable props for each navbar pattern type (bar, pill, center-pill).
 * Used by NavbarLayoutEditor in im-dashboard to render schema-driven controls.
 *
 * IMPORTANT: This schema only describes props that are already read by the
 * navbar pattern components via getPatternProps(). It does NOT modify those
 * components in any way.
 *
 * Props live at: navbar.patterns[patternKey].props
 */

import type { PropConfig } from '../../core/schemas/shared';

export interface NavbarPatternSchema {
  $id: string;
  displayName: string;
  layoutProps: Record<string, PropConfig>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared props — common across bar, pill and center-pill
// ─────────────────────────────────────────────────────────────────────────────

const sharedNavbarProps: Record<string, PropConfig> = {
  // ── STYLE ──────────────────────────────────────────────────────────────────
  backgroundVariant: {
    name: 'backgroundVariant',
    type: 'enum',
    displayName: 'Background',
    description: 'Visual background style of the navbar',
    editorType: 'select',
    values: ['solid', 'raised', 'glass', 'glass-clear', 'glass-scroll', 'transparent', 'accent'],
    valueLabels: {
      solid: 'Solid',
      raised: 'Raised',
      glass: 'Glass',
      'glass-clear': 'Glass Faint',
      'glass-scroll': 'Glass on Scroll',
      transparent: 'Transparent',
      accent: 'Accent',
    },
    default: 'solid',
    group: 'style',
    cmsEnabled: true,
  },

  showBorder: {
    name: 'showBorder',
    type: 'boolean',
    displayName: 'Show Border',
    description: 'Show a border around the navbar',
    editorType: 'toggle',
    default: true,
    group: 'style',
    cmsEnabled: true,
  },

  bottomBorderFade: {
    name: 'bottomBorderFade',
    type: 'boolean',
    displayName: 'Mjuk bottenkant (fade)',
    description: 'Bottenkanten blendar mjukt in med innehållet under istället för hård border. Passar särskilt med glass/transparent.',
    editorType: 'toggle',
    default: false,
    group: 'style',
    cmsEnabled: true,
  },

  hideOnScroll: {
    name: 'hideOnScroll',
    type: 'boolean',
    displayName: 'Hide on Scroll',
    description: 'Hide navbar when scrolling down, show on scroll up',
    editorType: 'toggle',
    default: false,
    group: 'behavior',
    cmsEnabled: true,
  },

  // ── LOGO ───────────────────────────────────────────────────────────────────
  logoDisplay: {
    name: 'logoDisplay',
    type: 'enum',
    displayName: 'Logo',
    description: 'Choose what to display in the logo area',
    editorType: 'segmented',
    values: ['both', 'logo', 'text'],
    valueLabels: { both: 'Both', logo: 'Icon', text: 'Text' },
    default: 'both',
    group: 'style',
    cmsEnabled: true,
  },

  // ── MOBILE ─────────────────────────────────────────────────────────────────
  mobileMenuAlign: {
    name: 'mobileMenuAlign',
    type: 'enum',
    displayName: 'Align',
    description: 'Alignment of links inside the mobile drawer',
    editorType: 'segmented',
    values: ['left', 'center', 'right'],
    valueLabels: { left: 'Left', center: 'Mid', right: 'Right' },
    default: 'left',
    group: 'mobile',
    cmsEnabled: true,
  },

  mobileLogoDisplay: {
    name: 'mobileLogoDisplay',
    type: 'enum',
    displayName: 'Logo',
    description: 'What to display in the logo area on mobile',
    editorType: 'segmented',
    values: ['both', 'logo', 'text'],
    valueLabels: { both: 'Both', logo: 'Icon', text: 'Text' },
    default: 'both',
    group: 'mobile',
    cmsEnabled: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Bar schema — full-width bar navbar
// ─────────────────────────────────────────────────────────────────────────────

export const navbarBarSchema: NavbarPatternSchema = {
  $id: 'bar',
  displayName: 'Navbar',

  layoutProps: {
    // ── LAYOUT ───────────────────────────────────────────────────────────────
    menuAlign: {
      name: 'menuAlign',
      type: 'enum',
      displayName: 'Menu Alignment',
      description: 'Horizontal alignment of navigation links on desktop',
      editorType: 'segmented',
      values: ['left', 'center', 'right'],
      valueLabels: { left: 'Left', center: 'Center', right: 'Right' },
      default: 'right',
      group: 'layout',
      cmsEnabled: true,
    },

    ...sharedNavbarProps,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Pill schema — floating pill navbar
// ─────────────────────────────────────────────────────────────────────────────

export const navbarPillSchema: NavbarPatternSchema = {
  $id: 'pill',
  displayName: 'Navbar',

  layoutProps: {
    // ── LAYOUT ───────────────────────────────────────────────────────────────
    menuAlign: {
      name: 'menuAlign',
      type: 'enum',
      displayName: 'Menu Alignment',
      description: 'Horizontal alignment of navigation links on desktop',
      editorType: 'segmented',
      values: ['left', 'center', 'right'],
      valueLabels: { left: 'Left', center: 'Center', right: 'Right' },
      default: 'right',
      group: 'layout',
      cmsEnabled: true,
    },

    mobileMenuVariant: {
      name: 'mobileMenuVariant',
      type: 'enum',
      displayName: 'Drawer',
      description: 'How the mobile menu expands',
      editorType: 'segmented',
      values: ['sheet', 'fullscreen'],
      valueLabels: { sheet: 'Sheet', fullscreen: 'Full' },
      default: 'sheet',
      group: 'mobile',
      cmsEnabled: true,
    },

    ...sharedNavbarProps,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Center-pill schema — logo left + centered pill + actions right
// ─────────────────────────────────────────────────────────────────────────────

export const navbarCenterPillSchema: NavbarPatternSchema = {
  $id: 'center-pill',
  displayName: 'Navbar',

  layoutProps: {
    // ── LAYOUT ───────────────────────────────────────────────────────────────
    mobileMenuVariant: {
      name: 'mobileMenuVariant',
      type: 'enum',
      displayName: 'Drawer',
      description: 'How the mobile menu expands',
      editorType: 'segmented',
      values: ['sheet', 'fullscreen'],
      valueLabels: { sheet: 'Sheet', fullscreen: 'Full' },
      default: 'fullscreen',
      group: 'mobile',
      cmsEnabled: true,
    },

    ...sharedNavbarProps,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — look up schema by pattern type
// ─────────────────────────────────────────────────────────────────────────────

const navbarSchemaRegistry: Record<string, NavbarPatternSchema> = {
  bar: navbarBarSchema,
  pill: navbarPillSchema,
  'center-pill': navbarCenterPillSchema,
};

export function getNavbarPatternSchema(patternType: string): NavbarPatternSchema | null {
  return navbarSchemaRegistry[patternType] ?? null;
}
