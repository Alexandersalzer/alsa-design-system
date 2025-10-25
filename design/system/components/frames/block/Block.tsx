import React, { ReactNode } from 'react';
import styles from './Block.module.css';

interface BlockProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

export const Block = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'div'
}: BlockProps) => {
  const combinedClassName = `${styles.block} ${className}`.trim();
  
  return (
    <Component 
      id={id}
      className={combinedClassName}
    >
      {children}
    </Component>
  );
}; 