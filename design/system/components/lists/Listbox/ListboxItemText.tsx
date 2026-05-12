// ===============================================
// src/design-system/components/primitives/Listbox/ListboxItemText.tsx
// HELPER COMPONENT - For title/description pattern
// Uses Typography (Body) so font-family / weight come from design tokens.
// ===============================================

import React, { type ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Body } from '../../Typography';

export interface ListboxItemTextProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const ListboxItemText = ({ title, description, className }: ListboxItemTextProps) => {
  return (
    <div className={cn('listbox-item-text', className)}>
      {title && (
        <Body size="md" color="primary" className="listbox-item-text-title">
          {title}
        </Body>
      )}
      {description && (
        <Body size="sm" color="secondary" className="listbox-item-text-description">
          {description}
        </Body>
      )}
    </div>
  );
};

ListboxItemText.displayName = 'ListboxItemText';
