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
  H3,
  Body,
  Button,
  Icon,
  Box,
  Divider,
  Tag,
  Progress
} from '../../../components';
import { Listbox, ListboxItem } from '../../../components/lists/Listbox';
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
  optional?: boolean; // Om steget är valfritt
}

type SetupPhase = 'building' | 'launch' | 'done';

export interface SetupGuideProps {
  phase?: SetupPhase;
  className?: string;
  onNavigate?: (href: string) => void;
  // Alternativt: tillåt externa steps och progress
  customSteps?: SetupStep[];
  customProgress?: number;
  // Congratulations modal control
  showCongratulations?: boolean;
  onDismissCongratulations?: () => void;
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
  onDismissCongratulations
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

  // Visa setup-guide
  return (
    <div className={className}>
      {/* Visuell separator */}
      <Divider className="setup-guide__divider" />

      <VStack spacing="xl">
        {/* Header */}
        <VStack spacing="sm">
          <H2>Kom igång med Blimpify</H2>
          <Body size="md" color="secondary">
            {phase === 'building' 
              ? 'Din webbplats byggs just nu. Följ stegen nedan för att förbereda lanseringen.'
              : 'Din webbplats är nästan klar! Slutför dessa steg för att gå live.'
            }
          </Body>
        </VStack>

        {/* Steps - Using Listbox for better accessibility */}
        <Listbox
          variant="separated"
          size="md"
          spacing="md"
          role="list"
        >
          {sortedSteps.map((step) => {
            const IconComponent = step.icon;

            return (
              <ListboxItem
                key={step.key}
                size="lg"
                onClick={!step.completed ? () => handleNavigate(step.href) : undefined}
                disabled={step.completed}
                aria-label={`${step.title}: ${step.description}`}
                leading={
                  <Icon
                    size="lg"
                    color={step.completed ? 'success' : 'accent'}
                  >
                    {step.completed ? <CheckCircleIcon /> : <IconComponent />}
                  </Icon>
                }
                trailing={
                  step.completed ? (
                    <Tag variant="success" size="small">
                      Klar
                    </Tag>
                  ) : (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(step.href);
                      }}
                    >
                      Gå till
                    </Button>
                  )
                }
              >
                <VStack spacing="xs" align="start">
                  <H3>{step.title}</H3>
                  <Body size="sm" color="secondary">
                    {step.description}
                  </Body>
                </VStack>
              </ListboxItem>
            );
          })}
        </Listbox>

        {/* Progress Card */}
        {progress < 100 && (
          <Card variant="outlined">
            <CardContent>
              <VStack spacing="md">
                {/* Progress Bar */}
                <Progress
                  value={progress}
                  size="md"
                  color="accent"
                  rounded
                  animated
                />

                {/* Progress Text */}
                <HStack justify="between" align="center">
                  <Body size="sm" weight="medium" color="secondary">
                    {getPhaseText(phase)} • {completedSteps}/{steps.length} steg klara
                  </Body>
                  <Body size="sm" weight="bold" color="accent">
                    {progress}% klart
                  </Body>
                </HStack>
              </VStack>
            </CardContent>
          </Card>
        )}
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

