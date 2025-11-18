import React, { ReactNode, forwardRef } from 'react';
import styles from './Component.module.css';
import { applyEditingMode } from '../../../core/postmessage';

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

export const Component = forwardRef<HTMLElement, ComponentProps>(({ 
  children, 
  className = '', 
  id,
  as: Element = 'div',
  ...rest
}, ref) => {
  const isEditing = applyEditingMode();
  const combinedClassName = [
    isEditing && styles.editingMode,
    className
  ].filter(Boolean).join(' ').trim();
  
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