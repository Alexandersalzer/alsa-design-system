// ===============================================
// src/design-system/components/patterns/editor/EditorSection/EditorSection.tsx
// STYLE EDITOR SECTION - COLLAPSIBLE PROPERTY GROUPS
// ===============================================

import React, { useState } from 'react';
import { Label, Body } from '../../../../primitives/Typography';
import './EditorSection.css';
import { ChevronRightIcon } from 'lucide-react';
import Icon from '../../../../primitives/Icon';

export interface EditorSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  title,
  description,
  icon,
  defaultOpen = false,
  collapsible = true,
  children,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`editor-section ${className}`}>
      {/* Section Header */}
      <div 
        className={`editor-section__header ${collapsible ? 'editor-section__header--clickable' : ''}`}
        onClick={handleToggle}
      >
        <div className="editor-section__header-content">
          {icon && (
            <div className="editor-section__icon">
              {icon}
            </div>
          )}
          <div className="editor-section__title-section">
            <Label size="sm" weight="medium" color="primary">
              {title}
            </Label>
            {description && (
              <Body size="xs" color="secondary">
                {description}
              </Body>
            )}
          </div>
        </div>
        
        {collapsible && (
          <div className={`editor-section__chevron ${isOpen ? 'editor-section__chevron--open' : ''}`}>
            <Icon><ChevronRightIcon/></Icon>
          </div>
        )}
      </div>

      {/* Section Content */}
      {(isOpen || !collapsible) && (
        <div className="editor-section__content">
          <div className="editor-section__content-inner">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};