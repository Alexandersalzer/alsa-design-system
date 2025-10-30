// ===============================================
// ProgressButton.tsx
// Kompakt knapp i topbaren för setup-status
// ===============================================

'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Popover,
  VStack, 
  HStack, 
  Body, 
  Tag,
  Box
} from '../../../components';
import { 
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// ===== TYPES =====
interface ProgressStep {
  key: string;
  title: string;
  completed: boolean;
}

export interface ProgressButtonProps {
  progress: number;
  steps: ProgressStep[];
  completedSteps?: number;
  totalSteps?: number;
  className?: string;
}

// ===== COMPONENT =====
export const ProgressButton: React.FC<ProgressButtonProps> = ({
  progress,
  steps,
  completedSteps,
  totalSteps,
  className
}) => {
  const [open, setOpen] = useState(false);
  const isComplete = progress >= 100;
  const completed = completedSteps ?? steps.filter(s => s.completed).length;
  const total = totalSteps ?? steps.length;

  return (
    <>
      <style>{`
        .progress-button-popover {
          min-width: 280px;
          max-width: 320px;
        }
      `}</style>
      
      <Popover
      open={open}
      onOpenChange={setOpen}
      closeOnEscape
      closeOnInteractOutside
      size="sm"
    >
      <Popover.Trigger asChild>
        <Button
          variant={isComplete ? 'secondary' : 'accent'}
          size="sm"
          onClick={() => setOpen(!open)}
          className={className}
        >
          {isComplete ? 'Setup klar 🎉' : `${progress}% klart`}
        </Button>
      </Popover.Trigger>

      <Popover.Content
        positioning={{ placement: 'bottom-end', offset: 8 }}
        className="progress-button-popover"
      >
        <Popover.Header>
          <VStack spacing="xs" align="start">
            <Box as="h3" style={{ 
              margin: 0,
              fontSize: 'var(--font-body-lg-size)',
              fontWeight: 'var(--foundation-weight-semibold)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--font-body-lg-leading)'
            }}>
              Setup-status
            </Box>
            <Body size="sm" color="secondary">
              {isComplete
                ? 'Alla steg är slutförda! 🎉'
                : `${completed} av ${total} steg slutförda`
              }
            </Body>
          </VStack>
        </Popover.Header>

        <Popover.Body>
          <VStack spacing="sm">
            {steps.map((step) => (
              <Box key={step.key} style={{ padding: 'var(--foundation-space-1) 0' }}>
                <HStack
                  align="center"
                  justify="between"
                  spacing="sm"
                >
                  <Box style={{ flex: 1 }}>
                    <Body size="sm">{step.title}</Body>
                  </Box>
                  <Tag
                    size="small"
                    variant={step.completed ? 'success' : 'default'}
                  >
                    {step.completed ? '✓ Klart' : 'Ej klart'}
                  </Tag>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover>
    </>
  );
};
