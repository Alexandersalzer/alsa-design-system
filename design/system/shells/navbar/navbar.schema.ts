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
    values: ['default', 'raised', 'glass', 'glass-clear', 'transparent'],
    valueLabels: {
      default: 'Solid',
      raised: 'Raised',
      glass: 'Glass',
      'glass-clear': 'Glass Faint',
      transparent: 'Transparent',
    },
    default: 'default',
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
  showLogo: {
    name: 'showLogo',
    type: 'boolean',
    displayName: 'Show Logo',
    description: 'Show or hide the logo image',
    editorType: 'toggle',
    default: true,
    group: 'logo',
    cmsEnabled: true,
  },

  showLogoText: {
    name: 'showLogoText',
    type: 'boolean',
    displayName: 'Show Logo Text',
    description: 'Show or hide the business name text next to logo',
    editorType: 'toggle',
    default: true,
    group: 'logo',
    cmsEnabled: true,
  },

  // ── MOBILE ─────────────────────────────────────────────────────────────────
  mobileMenuAlign: {
    name: 'mobileMenuAlign',
    type: 'enum',
    displayName: 'Mobile Menu Align',
    description: 'Alignment of links inside the mobile drawer',
    editorType: 'segmented',
    values: ['left', 'center', 'right'],
    valueLabels: { left: 'Left', center: 'Center', right: 'Right' },
    default: 'left',
    group: 'mobile',
    cmsEnabled: true,
  },

  hideLogoOnMobile: {
    name: 'hideLogoOnMobile',
    type: 'boolean',
    displayName: 'Hide Logo on Mobile',
    description: 'Hide the logo image on mobile screens',
    editorType: 'toggle',
    default: false,
    group: 'mobile',
    cmsEnabled: true,
  },

  hideLogoTextOnMobile: {
    name: 'hideLogoTextOnMobile',
    type: 'boolean',
    displayName: 'Hide Logo Text on Mobile',
    description: 'Hide the text next to the logo on mobile screens',
    editorType: 'toggle',
    default: false,
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

    pillWidth: {
      name: 'pillWidth',
      type: 'enum',
      displayName: 'Width',
      description: 'Full stretches to max content width; Compact shrinks to fit content',
      editorType: 'segmented',
      values: ['full', 'compact'],
      valueLabels: { full: 'Full', compact: 'Compact' },
      default: 'full',
      group: 'layout',
      cmsEnabled: true,
    },

    mobileMenuVariant: {
      name: 'mobileMenuVariant',
      type: 'enum',
      displayName: 'Drawer Style',
      description: 'How the mobile menu expands',
      editorType: 'segmented',
      values: ['sheet', 'fullscreen'],
      valueLabels: { sheet: 'Sheet', fullscreen: 'Full Screen' },
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
      displayName: 'Drawer Style',
      description: 'How the mobile menu expands',
      editorType: 'segmented',
      values: ['sheet', 'fullscreen'],
      valueLabels: { sheet: 'Sheet', fullscreen: 'Full Screen' },
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
