import React, { ReactNode, forwardRef } from 'react';
import styles from './Component.module.css';

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  componentKey?: string; // För live editing identification
}

export const Component = forwardRef<HTMLElement, ComponentProps>(({ 
  children, 
  className = '', 
  id,
  as: Element = 'div',
  componentKey,
  ...rest
}, ref) => {
  const combinedClassName = [
    className
  ].filter(Boolean).join(' ').trim();
  
  return (
    <Element 
      ref={ref}
      id={id}
      className={combinedClassName}
      data-component-key={componentKey}
      {...rest}
    >
      {children}
    </Element>
  );
});

Component.displayName = 'Component'; 