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
    <Popover 
      open={open} 
      onOpenChange={setOpen}
      size="sm"
    >
      <Popover.Trigger asChild>
        <Button
          variant={isComplete ? 'secondary' : 'accent'}
          size="sm"
          className={className}
        >
          {isComplete ? 'Setup klar 🎉' : `${progress}% klart`}
        </Button>
      </Popover.Trigger>

      <Popover.Positioner>
        <Popover.Content width={300}>
          <Popover.Header>
            <HStack spacing="md" justify="between" align="center">
              <H3>Setup-status</H3>
            </HStack>
          </Popover.Header>

          <Popover.Body>
            <VStack spacing="md">
              <Body size="sm" color="secondary">
                {isComplete
                  ? 'Alla steg är slutförda! 🎉'
                  : `${completed} av ${total} steg slutförda`
                }
              </Body>

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
      </Popover.Positioner>
    </Popover>
  );
};
