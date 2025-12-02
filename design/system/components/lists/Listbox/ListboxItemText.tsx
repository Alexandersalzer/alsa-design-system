// ===============================================
// src/design-system/components/primitives/Listbox/ListboxItemText.tsx
// HELPER COMPONENT - For title/description pattern
// ===============================================

import React, { type ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface ListboxItemTextProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const ListboxItemText = ({ title, description, className }: ListboxItemTextProps) => {
  return (
    <div className={cn('listbox-item-text', className)}>
      {title && (
        <div className="listbox-item-text-title">
          {title}
        </div>
      )}
      {description && (
        <div className="listbox-item-text-description">
          {description}
        </div>
      )}
    </div>
  );
};

ListboxItemText.displayName = 'ListboxItemText';