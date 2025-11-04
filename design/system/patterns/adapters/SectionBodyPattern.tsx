'use client';

import { SectionBody } from '../shared/sectionBody/SectionBody';

interface SectionBodyPatternProps {
  type: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  [key: string]: any;
}

export function SectionBodyPattern({ components, ...props }: SectionBodyPatternProps) {
  if (!components) return null;

  // Extract components
  const headingComponent = Object.values(components).find((c: any) => c.type === 'heading') as any;
  const bodyComponent = Object.values(components).find((c: any) => c.type === 'body') as any;
  const tagComponent = Object.values(components).find((c: any) => c.type === 'tag') as any;
  const buttonComponent = Object.values(components).find((c: any) => c.type === 'button') as any;
  
  return (
    <SectionBody
      tag={tagComponent?.content ? {
        text: tagComponent.content,
        variant: 'accent',
        size: 'medium'
      } : undefined}
      heading={headingComponent?.content || ''}
      headingAs="h1"
      headingVariant="display-xl"
      headingColor="heading"
      headingWeight="bold"
      body={bodyComponent?.content || undefined}
      bodyAs="p"
      bodyVariant="body-xl"
      bodyColor="body"
      bodyWeight="regular"
      actionType={buttonComponent?.content ? 'button' : undefined}
      button={buttonComponent?.content ? {
        text: typeof buttonComponent.content === 'object' ? buttonComponent.content.content : buttonComponent.content,
        variant: 'primary',
        size: 'xl'
      } : undefined}
      textAlign="center"
      maxWidth="800px"
      tagSpacing="sm"
      headingBodySpacing="md"
      bodyActionSpacing="xl"
    />
  );
}