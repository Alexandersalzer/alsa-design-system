// ===============================================
// src/design-system/components/patterns/editor/EditorPanel/EditorPanel.tsx
// FRAMER-STYLE EDITOR PANEL - RIGHT SIDEBAR PROPERTY PANEL
// ===============================================

import React from 'react';
import Icon from '../../../../primitives/Icon';
import { Label, Body } from '../../../../primitives/Typography';
import { Button } from '../../../../primitives/Button';
import './EditorPanel.css';
import { XIcon } from 'lucide-react';

export interface EditorPanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  subtitle,
  icon,
  onClose,
  children,
  className = ''
}) => {
  return (
    <div className={`framer-editor-panel ${className}`}>
      {/* Panel Header */}
      <div className="framer-editor-panel__header">
        <div className="framer-editor-panel__header-content">
          {icon && (
            <div className="framer-editor-panel__icon">
              {icon}
            </div>
          )}
          <div className="framer-editor-panel__title-section">
            <Label size="md" weight="semibold" color="primary">
              {title}
            </Label>
            {subtitle && (
              <Body size="xs" color="secondary">
                {subtitle}
              </Body>
            )}
          </div>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="framer-editor-panel__close"
          >
            <Icon><XIcon/></Icon>
          </Button>
        )}
      </div>

      {/* Panel Content */}
      <div className="framer-editor-panel__content">
        {children}
      </div>
    </div>
  );
};