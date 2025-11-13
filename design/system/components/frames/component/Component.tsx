import React, { ReactNode, forwardRef } from 'react';

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
  const combinedClassName = `${className}`.trim();
  
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