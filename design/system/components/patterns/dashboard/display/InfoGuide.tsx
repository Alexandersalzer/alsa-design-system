// ===============================================
// src/design-system/components/patterns/dashboard/display/InfoGuide.tsx
// INFO GUIDE PATTERN - Following Design System Structure
// ===============================================

import React, { ReactNode, useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';

// Import primitives from design system
import { Icon } from '../../../primitives/Icon';
import { Button } from '../../../primitives/Button';
import { Label, Body } from '../../../primitives/Typography';
import { 
  InformationCircleIcon,
  LightBulbIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// ===== TYPE DEFINITIONS =====
export interface InfoGuideProps {
  children?: ReactNode;
  className?: string;
  
  // Content
  title: string;
  description?: string;
  tips?: string[];
  action?: {
    text: string;
    onClick?: () => void;
  };
  
  // Behavior
  showOnce?: boolean;
  storageKey?: string;
  autoShow?: boolean;
  autoShowDelay?: number;
  
  // Callbacks
  onDismiss?: () => void;
  onAction?: () => void;
}

export interface InfoGuideTip {
  id: string;
  title: string;
  description: string;
  tips: string[];
  action?: {
    text: string;
    onClick: () => void;
  };
}

// ===== INFO GUIDE COMPONENT =====
export const InfoGuide = React.forwardRef<HTMLDivElement, InfoGuideProps>(({
  children,
  className,
  title,
  description,
  tips = [],
  action,
  showOnce = false,
  storageKey,
  autoShow = false,
  autoShowDelay = 1000,
  onDismiss,
  onAction,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if already shown (for showOnce)
  useEffect(() => {
    if (showOnce && storageKey) {
      const hasSeen = localStorage.getItem(`info-guide-seen-${storageKey}`);
      if (hasSeen) {
        setIsVisible(false);
        return;
      }
    }

    // Auto show
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, autoShowDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, autoShowDelay, showOnce, storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Mark as seen
    if (showOnce && storageKey) {
      localStorage.setItem(`info-guide-seen-${storageKey}`, 'true');
    }
    
    onDismiss?.();
  };

  const handleAction = () => {
    onAction?.();
    action?.onClick?.();
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'info-guide',
        className
      )}
      {...props}
    >
      <div className="info-guide__container">
        {/* Header */}
        <div className="info-guide__header">
          <div className="info-guide__icon-container">
            <Icon 
              size="md" 
              color="primary"
              className="info-guide__icon"
            >
              <InformationCircleIcon />
            </Icon>
          </div>
          
          <div className="info-guide__content">
            <Label size="sm" weight="semibold" color="heading">
              {title}
            </Label>
            {description && (
              <Body size="xs" color="secondary">
                {description}
              </Body>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="info-guide__close"
            aria-label="Stäng hjälp"
          >
            <Icon size="sm" color="secondary">
              <XMarkIcon />
            </Icon>
          </Button>
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="info-guide__tips">
            <Label size="sm" weight="semibold" color="heading">
              💡 Tips för denna sida
            </Label>
            <div className="info-guide__tips-list">
              {tips.slice(0, isExpanded ? undefined : 2).map((tip, index) => (
                <div key={index} className="info-guide__tip">
                  <Icon size="xs" color="primary" className="info-guide__tip-icon">
                    <LightBulbIcon />
                  </Icon>
                  <Body size="xs" color="secondary">
                    {tip}
                  </Body>
                </div>
              ))}
            </div>

            {tips.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="info-guide__expand"
              >
                {isExpanded ? 'Visa mindre' : `Visa ${tips.length - 2} fler tips`}
              </Button>
            )}
          </div>
        )}

        {/* Action */}
        {action && (
          <div className="info-guide__actions">
            <Button
              variant="accent"
              size="sm"
              onClick={handleAction}
              rightIcon={
                <Icon size="sm" color="primary">
                  <ArrowRightIcon />
                </Icon>
              }
              className="info-guide__action"
            >
              {action.text}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="info-guide__dismiss"
            >
              Inte nu
            </Button>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="info-guide__progress" />
    </div>
  );
});

InfoGuide.displayName = 'InfoGuide';
