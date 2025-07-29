import React from 'react';
import { cn } from '../../../../lib/utils';

export interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MainContent = React.forwardRef<HTMLElement, MainContentProps>(
  ({ children, className, padding = 'md', ...props }, ref) => {
    const baseClasses = ['main-content'];
    
    if (padding === 'none') baseClasses.push('main-content--no-padding');
    if (padding === 'sm') baseClasses.push('main-content--padding-sm');
    if (padding === 'md') baseClasses.push('main-content--padding-md');
    if (padding === 'lg') baseClasses.push('main-content--padding-lg');
    
    if (className) baseClasses.push(className);

    return (
      <main ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </main>
    );
  }
);

MainContent.displayName = 'MainContent';

export interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  spacing?: 'tight' | 'normal' | 'relaxed';
}

export const ContentSection = React.forwardRef<HTMLElement, ContentSectionProps>(
  ({ children, className, title, description, spacing = 'normal', ...props }, ref) => {
    const baseClasses = ['content-section'];
    
    if (spacing === 'tight') baseClasses.push('content-section--tight');
    if (spacing === 'normal') baseClasses.push('content-section--normal');
    if (spacing === 'relaxed') baseClasses.push('content-section--relaxed');
    
    if (className) baseClasses.push(className);

    return (
      <section ref={ref} className={cn(...baseClasses)} {...props}>
        {(title || description) && (
          <div className="content-section__header">
            {title && <h2 className="content-section__title">{title}</h2>}
            {description && <p className="content-section__description">{description}</p>}
          </div>
        )}
        <div className="content-section__content">
          {children}
        </div>
      </section>
    );
  }
);

ContentSection.displayName = 'ContentSection';