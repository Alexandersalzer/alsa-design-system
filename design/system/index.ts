// src/design-system/index.ts
export * from './components';
export * from './shells';
export * from './patterns/index';
export * from './components/layout';
export * from './hooks';

// Export core but explicitly use AnimationType from components to resolve conflict
export * from './core';
export type { AnimationType } from './components/animations/types';

export * from './bookings';
export * from './patterns';