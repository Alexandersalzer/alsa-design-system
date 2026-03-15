// ===============================================
// SetupGuide.tsx
// Guidar nya kunder genom setup-processen
// ===============================================

'use client';

import React, { useMemo } from 'react';
import './SetupGuide.css';
import {
  VStack,
  HStack,
  Card,
  CardContent,
  H2,
  Body,
  Button,
  Icon,
  Box,
  Divider,
  Tag,
  Progress,
  Label
} from '../../../components';
import { Accordion } from '../../../components/layout/Accordion/Accordion';
import { AccordionItem } from '../../../components/layout/Accordion/AccordionItem';
import {
  CheckCircleIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// ===== TYPES =====
export interface SetupStep {
  key: string;
  title: string;
  description: string;
  href: string;
  completed: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  optional?: boolean;
  buttonLabel?: string; // e.g. "Öppna editorn", "Redigera SEO", "Publicera"
}

type SetupPhase = 'building' | 'launch' | 'done';

export interface SetupGuideProps {
  phase?: SetupPhase;
  className?: string;
  onNavigate?: (href: string) => void;
  customSteps?: SetupStep[];
  customProgress?: number;
  showCongratulations?: boolean;
  onDismissCongratulations?: () => void;
  /** Anpassat innehåll när ett steg är expanderat (t.ex. domänsök för connect-domain). När satt används detta istället för standard beskrivning + knapp. */
  renderStepContent?: (step: SetupStep) => React.ReactNode;
}

// ===== MOCKAD DATA =====
const getSteps = (phase: SetupPhase): SetupStep[] => {
  if (phase === 'building') {
    return [
      {
        key: 'overview',
        title: 'Utforska dashboarden',
        description: 'Bekanta dig med översikten och funktionerna.',
        href: '/overview',
        completed: true,
        icon: EyeIcon
      },
      {
        key: 'preview',
        title: 'Förhandsgranska din webbplats',
        description: 'Se din tillfälliga webbplats under utveckling.',
        href: '/website',
        completed: false,
        icon: GlobeAltIcon
      },
      {
        key: 'support',
        title: 'Skicka in önskemål',
        description: 'Berätta vad du vill ändra i din design.',
        href: '/support',
        completed: false,
        icon: ChatBubbleLeftRightIcon
      }
    ];
  }

  if (phase === 'launch') {
    return [
      {
        key: 'preview',
        title: 'Granska din färdiga webbplats',
        description: 'Kontrollera att allt ser bra ut innan lansering.',
        href: '/website',
        completed: false,
        icon: EyeIcon
      },
      {
        key: 'domain',
        title: 'Lägg till domän',
        description: 'Koppla din egen domän för att gå live.',
        href: '/domainsTab',
        completed: false,
        icon: CircleStackIcon
      },
      {
        key: 'support',
        title: 'Godkänn lansering',
        description: 'Kontakta oss när du är redo att publicera.',
        href: '/support',
        completed: false,
        icon: ChatBubbleLeftRightIcon
      }
    ];
  }

  return [];
};

// ===== HELPER FUNCTIONS =====
const getPhaseText = (phase?: string) => {
  switch (phase) {
    case 'building': return 'Fas 1: Bygger';
    case 'launch': return 'Fas 2: Lansering';
    case 'done': return 'Klart';
    default: return 'Setup';
  }
};

// ===== MAIN COMPONENT =====
export const SetupGuide: React.FC<SetupGuideProps> = ({
  phase = 'building',
  className,
  onNavigate,
  customSteps,
  customProgress,
  showCongratulations = true,
  onDismissCongratulations,
  renderStepContent
}) => {
  const steps = customSteps || getSteps(phase);

  // Sort steps: incomplete first, completed last
  const sortedSteps = useMemo(() => {
    if (!steps) return [];

    const incomplete = steps.filter(s => !s.completed);
    const complete = steps.filter(s => s.completed);

    return [...incomplete, ...complete];
  }, [steps]);

  // Beräkna progress (använd custom om tillgängligt)
  const completedSteps = sortedSteps.filter(s => s.completed).length;
  const progress = customProgress !== undefined
    ? customProgress
    : (sortedSteps.length > 0
        ? Math.round((completedSteps / sortedSteps.length) * 100)
        : 0);

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  // Om done - visa gratulationskort (om inte redan sett)
  if (phase === 'done' && showCongratulations) {
    return (
      <Card variant="elevated">
        <CardContent>
          <VStack spacing="lg" align="center" className="setup-guide__celebration">
            <Box className="setup-guide__celebration-emoji">
              🎉
            </Box>
            <VStack spacing="sm" align="center">
              <H2>Grattis, din webbplats är nu live!</H2>
              <Body size="lg" color="secondary" align="center">
                Din webbplats är publicerad och tillgänglig för alla besökare
              </Body>
            </VStack>
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                if (onDismissCongratulations) {
                  onDismissCongratulations();
                }
                handleNavigate('/website');
              }}
            >
              Visa min webbplats
            </Button>
          </VStack>
        </CardContent>
      </Card>
    );
  }
  
  // Om done men congratulations redan sett - visa ingenting
  if (phase === 'done') {
    return null;
  }

  // Accordion: första oklara steget öppet som standard, användaren kan öppna andra
  const firstIncomplete = sortedSteps.find(s => !s.completed);
  const defaultOpenKey = firstIncomplete?.key ?? sortedSteps[0]?.key ?? '';

  return (
    <div className={`setup-guide setup-guide--accordion ${className ?? ''}`}>
      <Divider className="setup-guide__divider" />

      <VStack spacing="md">
        <HStack spacing="sm" justify="between" align="center" wrap>
          <Label size="sm" weight="semibold" color="secondary">
            Kom igång
          </Label>
          {progress < 100 && (
            <HStack spacing="sm" align="center">
              <Label size="xs" color="tertiary">
                {completedSteps}/{steps.length} steg
              </Label>
              <Box className="setup-guide__progress-inline">
                <Progress value={progress} size="xs" rounded animated />
              </Box>
            </HStack>
          )}
        </HStack>

        <Accordion
          selectionMode="single"
          defaultExpandedKeys={defaultOpenKey ? [defaultOpenKey] : []}
          variant="bordered"
          size="sm"
          gap="xs"
          showIndicator={true}
          className="setup-guide__accordion"
        >
          {sortedSteps.map((step) => {
            const IconComponent = step.icon;
            const customContent = renderStepContent?.(step);
            const content = customContent ?? (
              <VStack spacing="sm" align="stretch">
                <Body size="sm" color="secondary">
                  {step.description}
                </Body>
                {!step.completed && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleNavigate(step.href)}
                  >
                    {step.buttonLabel ?? 'Gå till'}
                  </Button>
                )}
              </VStack>
            );

            return (
              <AccordionItem
                key={step.key}
                itemKey={step.key}
                title={step.title}
                startContent={
                  <HStack spacing="xs" align="center">
                    <Icon
                      size="sm"
                      color={step.completed ? 'success' : 'tertiary'}
                    >
                      {step.completed ? <CheckCircleIcon /> : <IconComponent />}
                    </Icon>
                    {step.completed && (
                      <Tag variant="success" size="small">
                        Klar
                      </Tag>
                    )}
                  </HStack>
                }
              >
                {content}
              </AccordionItem>
            );
          })}
        </Accordion>
      </VStack>
    </div>
  );
}/*, (prevProps, nextProps) => {
  // ⚡ PERFORMANCE: Custom comparison för att undvika onödiga re-renders
  return (
    prevProps.phase === nextProps.phase &&
    prevProps.customProgress === nextProps.customProgress &&
    prevProps.showCongratulations === nextProps.showCongratulations &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.customSteps) === JSON.stringify(nextProps.customSteps)
  );
});*/

SetupGuide.displayName = 'SetupGuide';

