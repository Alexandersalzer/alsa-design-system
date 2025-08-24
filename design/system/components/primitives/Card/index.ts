// ===============================================
// src/design-system/components/primitives/Card/index.ts
// UPDATED EXPORTS - Include InteractiveCard
// ===============================================

export { 
  Card, 
  InteractiveCard,  // ✅ ADD THIS - Now you can import InteractiveCard
  CardHeader, 
  CardContent, 
  CardFooter 
} from './Card';

export type { 
  CardProps,
  InteractiveCardProps,  // ✅ ADD THIS TYPE TOO
  CardHeaderProps, 
  CardContentProps, 
  CardFooterProps 
} from './Card';