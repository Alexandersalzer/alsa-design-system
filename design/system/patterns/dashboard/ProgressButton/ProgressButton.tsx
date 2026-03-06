// ===============================================
// ProgressButton.tsx
// Kompakt knapp i topbaren för setup-status
// ===============================================

'use client';

import React, { useState } from 'react';
import './ProgressButton.css';
import { 
  Button, 
  Popover,
  VStack, 
  HStack, 
  Body, 
  Tag,
  Label,
  Listbox,
  ListboxItem,
  Icon
} from '../../../components';
import { 
  CheckCircleIcon,
  ClockIcon
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
  phase?: 'building' | 'launch' | 'done';
  className?: string;
}

// ===== COMPONENT =====
export const ProgressButton: React.FC<ProgressButtonProps> = ({
  progress,
  steps,
  completedSteps,
  totalSteps,
  phase,
  className
}) => {
  const [open, setOpen] = useState(false);
  const isComplete = progress >= 100;
  const completed = completedSteps ?? steps.filter(s => s.completed).length;
  const total = totalSteps ?? steps.length;

  // Fas-indikator text
  const getPhaseText = (phase?: string) => {
    switch (phase) {
      case 'building': return 'Fas 1: Bygger';
      case 'launch': return 'Fas 2: Lansering';
      case 'done': return 'Klart';
      default: return 'Setup';
    }
  };

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
          {isComplete ? 'Setup klart' : `${progress}% klart`}
        </Button>
      </Popover.Trigger>

      <Popover.Positioner>
        <Popover.Content width={340}>
          <Popover.Header>
            <VStack spacing="xs">
              <HStack spacing="md" justify="between" align="center">
                <Label size="lg" weight="bold" color="heading">
                  Setup-status
                </Label>
                <Label size="sm" weight="medium" color="accent">
                  {progress}% totalt klart
                </Label>
              </HStack>
              <HStack spacing="md" justify="between" align="center">
                <Label size="sm" color="secondary">
                  {getPhaseText(phase)}
                </Label>
                <Label size="sm" weight="medium" color="secondary">
                  {completed}/{total} steg i denna fas
                </Label>
              </HStack>
            </VStack>
          </Popover.Header>

          <Popover.Body>
            {isComplete ? (
              <VStack spacing="md" align="center" className="progress-button__completion">
                <Body size="lg" weight="medium" color="success">
                  Alla steg är slutförda!
                </Body>
                <Body size="sm" color="secondary">
                  Din webbplats är redo
                </Body>
              </VStack>
            ) : (
              <Listbox size="md" spacing="xs" surface="raised">
                {steps.map((step) => (
                  <ListboxItem
                    key={step.key}
                    size="md"
                    leading={
                      <Icon size="md" color={step.completed ? 'success' : 'tertiary'}>
                        {step.completed ? <CheckCircleIcon /> : <ClockIcon />}
                      </Icon>
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
