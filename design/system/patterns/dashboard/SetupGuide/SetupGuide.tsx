// ===============================================
// SetupGuide.tsx
// Guidar nya kunder genom setup-processen
// ===============================================

'use client';

import React from 'react';
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
  Divider
} from '../../../components';
import { PageSection } from '../page';
import {
  CheckCircleIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// ===== TYPES =====
interface SetupStep {
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
export const SetupGuide: React.FC<SetupGuideProps> = React.memo(({ 
  phase = 'building', 
  className,
  onNavigate,
  customSteps,
  customProgress,
  showCongratulations = true,
  onDismissCongratulations
}) => {
  // ⚡ PERFORMANCE: Memoize steps för att undvika onödiga re-beräkningar
  const steps = React.useMemo(() => customSteps || getSteps(phase), [customSteps, phase]);
  
  // ⚡ PERFORMANCE: Memoize progress-beräkning
  const completedSteps = React.useMemo(() => steps.filter(s => s.completed).length, [steps]);
  const progress = React.useMemo(() => {
    if (customProgress !== undefined) return customProgress;
    return steps.length > 0 
      ? Math.round((completedSteps / steps.length) * 100) 
      : 0;
  }, [customProgress, steps.length, completedSteps]);

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  // Om done - visa gratulationskort (om inte redan sett)
  if (phase === 'done' && showCongratulations) {
    return (
      <PageSection>
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
      </PageSection>
    );
  }
  
  // Om done men congratulations redan sett - visa ingenting
  if (phase === 'done') {
    return null;
  }

  // Visa setup-guide
  return (
    <PageSection className={className}>
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

        {/* Steps - Vertikal Stack */}
        <VStack spacing="lg">
          {steps.map((step) => {
            const IconComponent = step.icon;
            
            return (
              <Card 
                key={step.key} 
                variant="outlined"
                interactive={!step.completed}
                onCardClick={!step.completed ? () => handleNavigate(step.href) : undefined}
                className={step.completed ? 'setup-guide__step-card setup-guide__step-card--completed' : 'setup-guide__step-card'}
                style={{ minHeight: '120px', width: '100%' }}
              >
                <CardContent>
                  <HStack spacing="md" align="center" justify="between">
                    {/* Vänster: Ikon + Text */}
                    <Box className="setup-guide__step-content">
                      <HStack spacing="md" align="center">
                        {/* Icon */}
                        <Icon 
                          size="xl" 
                          color={step.completed ? 'success' : 'accent'}
                        >
                          {step.completed ? <CheckCircleIcon /> : <IconComponent />}
                        </Icon>

                        {/* Content */}
                        <VStack spacing="xs" align="start">
                          <HStack spacing="xs" align="center">
                            <H3>{step.title}</H3>
                            {step.optional && (
                              <Body size="xs" color="secondary" weight="medium">
                                (Valfritt)
                              </Body>
                            )}
                          </HStack>
                          <Body size="sm" color="secondary">
                            {step.description}
                          </Body>
                          {step.completed && (
                            <Body size="xs" color="success" weight="medium">
                              ✓ Klart
                            </Body>
                          )}
                        </VStack>
                      </HStack>
                    </Box>

                    {/* Höger: Knapp */}
                    {!step.completed && (
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
                    )}
                  </HStack>
                </CardContent>
              </Card>
            );
          })}
        </VStack>

        {/* Progress Card */}
        {progress < 100 && (
          <Card 
            variant="outlined"
            className="setup-guide__progress-card"
          >
            <CardContent>
              <VStack spacing="md">
                {/* Progress Bar */}
                <div className="setup-guide__progress-track">
                  <div
                    className="setup-guide__progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>

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
    </PageSection>
  );
}, (prevProps, nextProps) => {
  // ⚡ PERFORMANCE: Custom comparison för att undvika onödiga re-renders
  return (
    prevProps.phase === nextProps.phase &&
    prevProps.customProgress === nextProps.customProgress &&
    prevProps.showCongratulations === nextProps.showCongratulations &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.customSteps) === JSON.stringify(nextProps.customSteps)
  );
});

SetupGuide.displayName = 'SetupGuide';

