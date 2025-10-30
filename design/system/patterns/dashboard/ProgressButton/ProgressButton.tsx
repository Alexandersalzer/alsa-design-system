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
  H3,
  Divider
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
        <Popover.Body>
          <VStack spacing="md">
            {/* Header */}
            <VStack spacing="xs">
              <H3>Setup-status</H3>
              <Body size="sm" color="secondary">
                {isComplete
                  ? 'Alla steg är slutförda! 🎉'
                  : `${completed} av ${total} steg slutförda`
                }
              </Body>
            </VStack>

            <Divider />

            {/* Steps list */}
            <VStack spacing="sm">
              {steps.map((step) => (
                <HStack
                  key={step.key}
                  align="center"
                  justify="between"
                  spacing="sm"
                >
                  <Body size="sm">{step.title}</Body>
                  <Tag
                    size="small"
                    variant={step.completed ? 'success' : 'default'}
                  >
                    {step.completed ? '✓' : 'Ej klart'}
                  </Tag>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover>
    </>
  );
};
