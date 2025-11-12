import React, { ReactNode } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  [key: string]: any; // Allow all other props
}

export const Component = ({ 
  children, 
  className = '', 
  id,
  as: Element = 'div',
  ...rest
}: ComponentProps) => {
  const combinedClassName = `${styles.component} ${className}`.trim();
  
  return (
    <Element 
      id={id}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </Element>
  );
};

Component.displayName = 'Component'; 