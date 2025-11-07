import React, { ReactNode } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

export const Component = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'div'
}: ComponentProps) => {
  const combinedClassName = `${styles.component} ${className}`.trim();
  
  return (
    <Component 
      id={id}
      className={combinedClassName}
    >
      {children}
    </Component>
  );
}; 