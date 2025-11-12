import React, { ReactNode, forwardRef } from 'react';
import styles from './Component.module.css';

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  // Allow any additional props for different element types
  [key: string]: any;
}

export const Component = forwardRef<any, ComponentProps>(({ 
  children, 
  className = '', 
  id,
  as: Element = 'div',
  ...rest
}, ref) => {
  const combinedClassName = `${styles.component} ${className}`.trim();
  
  return (
    <Element 
      ref={ref}
      id={id}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </Element>
  );
});

Component.displayName = 'Component'; 