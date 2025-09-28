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
  const [isAnimating, setIsAnimating] = useState(false);

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
        setIsAnimating(true);
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
      style={{
        position: 'fixed',
        bottom: 'var(--foundation-space-6)',
        right: 'var(--foundation-space-6)',
        zIndex: 1000,
        width: '400px',
        maxWidth: '90vw',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--foundation-shadow-xl)',
        overflow: 'hidden',
        transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
        opacity: isAnimating ? 1 : 0,
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}
      {...props}
    >
      <div style={{ padding: 'var(--foundation-space-3)' }}>
                {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--foundation-space-3)',
          marginBottom: 'var(--foundation-space-3)',
          background: 'var(--surface-tag-info-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--foundation-space-3)',
          margin: 'calc(-1 * var(--foundation-space-3)) calc(-1 * var(--foundation-space-3)) var(--foundation-space-3) calc(-1 * var(--foundation-space-3))'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            background: 'var(--surface-tag-info)',
            borderRadius: 'var(--radius-sm)',
            flexShrink: 0
          }}>
            <Icon
              size="md"
              color="primary"
            >
              <InformationCircleIcon />
            </Icon>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
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
            style={{ flexShrink: 0, marginTop: '-4px', marginRight: '-4px' }}
            aria-label="Stäng hjälp"
          >
            <Icon size="sm" color="secondary">
              <XMarkIcon />
            </Icon>
          </Button>
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div style={{ marginBottom: 'var(--foundation-space-3)' }}>
            <Label size="sm" weight="semibold" color="heading">
              💡 Tips för denna sida
            </Label>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--foundation-space-2)',
              marginTop: 'var(--foundation-space-2)'
            }}>
              {tips.slice(0, isExpanded ? undefined : 2).map((tip, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--foundation-space-2)',
                  padding: 'var(--foundation-space-2)',
                  background: 'var(--surface-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <Icon size="xs" color="primary" style={{ marginTop: '2px', flexShrink: 0 }}>
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
                style={{
                  marginTop: 'var(--foundation-space-2)',
                  fontSize: '11px',
                  padding: '4px 8px'
                }}
              >
                {isExpanded ? 'Visa mindre' : `Visa ${tips.length - 2} fler tips`}
              </Button>
            )}
          </div>
        )}

                {/* Action */}
        {action && (
          <div style={{
            display: 'flex',
            gap: 'var(--foundation-space-2)',
            alignItems: 'center'
          }}>
            <Button
              variant="accent"
              size="sm"
              onClick={handleAction}
              rightIcon={
                <Icon size="sm" color="primary">
                  <ArrowRightIcon />
                </Icon>
              }
              style={{ flex: 1 }}
            >
              {action.text}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              style={{
                fontSize: '11px',
                padding: '4px 8px'
              }}
            >
              Inte nu
            </Button>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div style={{
        height: '3px',
        background: 'var(--surface-tag-info)',
        width: '100%'
      }} />
    </div>
  );
});

InfoGuide.displayName = 'InfoGuide';
