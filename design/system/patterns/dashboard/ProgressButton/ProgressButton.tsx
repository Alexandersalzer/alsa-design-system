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
  Label,
  Listbox,
  ListboxItem
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
        <Popover.Content width={340}>
          <Popover.Header>
            <HStack spacing="md" justify="between" align="center">
              <Label size="lg" weight="bold" color="heading">
                Setup-status
              </Label>
              <Label size="sm" weight="medium" color="accent">
                {completed}/{total}
              </Label>
            </HStack>
          </Popover.Header>

          <Popover.Body>
            {isComplete ? (
              <VStack spacing="md" align="center" style={{ padding: 'var(--foundation-space-4) 0' }}>
                <Body size="lg" weight="medium" color="success">
                  🎉 Alla steg är slutförda!
                </Body>
                <Body size="sm" color="secondary">
                  Din webbplats är redo
                </Body>
              </VStack>
            ) : (
              <Listbox size="md" spacing="xs">
                {steps.map((step) => (
                  <ListboxItem
                    key={step.key}
                    size="md"
                    leading={
                      <span style={{ fontSize: '20px' }}>
                        {step.completed ? '✅' : '⚪️'}
                      </span>
                    }
                    trailing={
                      step.completed ? (
                        <Label size="xs" weight="medium" color="success">
                          Klart
                        </Label>
                      ) : (
                        <Label size="xs" weight="medium" color="tertiary">
                          Ej klart
                        </Label>
                      )
                    }
                  >
                    <Label 
                      size="sm" 
                      weight={step.completed ? 'regular' : 'semibold'}
                      color={step.completed ? 'secondary' : 'primary'}
                    >
                      {step.title}
                    </Label>
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover>
  );
};
