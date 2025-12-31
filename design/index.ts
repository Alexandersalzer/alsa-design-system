// Export all design system components, utilities, and types
export * from './system';

// Export host provider explicitly
export { HostProvider, useHost } from './system/patterns/host';
export type { HostContextType } from './system/patterns/host';

// Export Applications server functionality  
export * from './system/core/applications';

// Export Applications client components
export * from './system/core/ApplicationComponent';

