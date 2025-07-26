// ===============================================
// src/design-system/components/patterns/editor/EditorTabs/EditorTabs.tsx
// EDITOR TABS COMPONENT
// ===============================================

import React from 'react';
import { Label } from '../../../../primitives/Typography';
import './EditorTabs.css';

export interface EditorTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hasChanges?: boolean;
  disabled?: boolean;
  badge?: string | number;
}

export interface EditorTabsProps {
  items: EditorTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ 
  items = [], 
  activeTab, 
  onTabChange,
  className = '',
  variant = 'default'
}) => {
  const handleTabClick = (item: EditorTabItem) => {
    if (item.disabled) return;
    onTabChange(item.id);
  };

  return (
    <div className={`editor-tabs editor-tabs--${variant} ${className}`}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const tabClasses = [
          'editor-tab',
          isActive && 'editor-tab--active',
          item.disabled && 'editor-tab--disabled'
        ].filter(Boolean).join(' ');

        return (
          <button
            key={item.id}
            className={tabClasses}
            onClick={() => handleTabClick(item)}
            disabled={item.disabled}
            type="button"
          >
            {item.icon && (
              <span className="editor-tab__icon">
                {item.icon}
              </span>
            )}
            
            <Label 
              size="sm" 
              weight="medium"
              className="editor-tab__label"
            >
              {item.label}
            </Label>
            
            {item.badge && (
              <span className="editor-tab__badge">
                <Label size="xs" weight="semibold">
                  {item.badge}
                </Label>
              </span>
            )}
            
            {item.hasChanges && (
              <span className="editor-tab__changes" />
            )}
          </button>
        );
      })}
    </div>
  );
};