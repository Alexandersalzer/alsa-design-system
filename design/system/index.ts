// src/design-system/index.ts
export * from './components';
export * from './shells';
export * from './patterns/index';
export * from './components/layout';
export * from './hooks';
export * from './bookings';
export * from './patterns';

// Core exports - types and utilities (schemas are exported separately)
export type { BaseNode, ComponentNode, PatternNode, SectionNode, PageNode, PageProps, PageSEO } from './core/types/nodes';
export { FilterProvider, useFilterContext } from './core/context/FilterContext';
export { PageSlugProvider } from './core/context/PageSlugProvider';
export * from './core/utils';
export * from './core/design';
export * from './core/localization';
export type { DesignTokens } from './core/types';
export * from './core/actions';
export * from './core/schemas';
export * from './core/render';