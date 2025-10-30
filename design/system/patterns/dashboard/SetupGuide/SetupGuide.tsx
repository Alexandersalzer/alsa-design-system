// ===============================================
// SetupGuide.tsx
// Guidar nya kunder genom setup-processen
// ===============================================

'use client';

import React, { useEffect, useState } from 'react';
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
}

type SetupPhase = 'building' | 'launch' | 'done';

export interface SetupGuideProps {
  phase?: SetupPhase;
  className?: string;
  onNavigate?: (href: string) => void;
  // Alternativt: tillåt externa steps och progress
  customSteps?: SetupStep[];
  customProgress?: number;
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

// ===== MAIN COMPONENT =====
export const SetupGuide: React.FC<SetupGuideProps> = ({ 
  phase = 'building', 
  className,
  onNavigate,
  customSteps,
  customProgress
}) => {
  const steps = customSteps || getSteps(phase);
  
  // Beräkna progress (använd custom om tillgängligt)
  const completedSteps = steps.filter(s => s.completed).length;
  const progress = customProgress !== undefined 
    ? customProgress
    : (steps.length > 0 
        ? Math.round((completedSteps / steps.length) * 100) 
        : 0);

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  // Om done - visa gratulationskort
  if (phase === 'done') {
    return (
      <PageSection>
        <Card variant="elevated">
          <CardContent>
            <VStack spacing="lg" align="center" style={{ padding: 'var(--foundation-space-8)' }}>
              <Box
                style={{
                  fontSize: '64px',
                  lineHeight: 1
                }}
              >
                🎉
              </Box>
              <VStack spacing="sm" align="center">
                <H2>Grattis, din webbplats är nu live!</H2>
                <Body size="lg" color="secondary" align="center">
                  Din webbplats är publicerad och tillgänglig för alla besökare
                </Body>
              </VStack>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => handleNavigate('/website')}
              >
                Visa min webbplats
              </Button>
            </VStack>
          </CardContent>
        </Card>
      </PageSection>
    );
  }

  // Spåra nyligen slutförda steg för animation
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = new Set(steps.filter(s => s.completed).map(s => s.key));
    setRecentlyCompleted(completed);
  }, [steps]);

  // Visa setup-guide
  return (
    <PageSection className={className}>
      {/* Visuell separator */}
      <Divider style={{ marginBottom: 'var(--foundation-space-8)' }} />
      
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
                style={{
                  opacity: step.completed ? 0.7 : 1,
                  cursor: step.completed ? 'default' : 'pointer',
                  animation: step.completed ? 'setupStepComplete 0.5s ease-out' : 'none',
                  minHeight: '120px',
                  width: '100%'
                }}
              >
                <CardContent>
                  <HStack spacing="md" align="center" justify="between">
                    {/* Vänster: Ikon + Text */}
                    <Box style={{ flex: 1 }}>
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
                          <H3>{step.title}</H3>
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

        {/* Progress Card eller Gratulation */}
        {progress === 100 ? (
          <Card 
            variant="elevated"
            style={{
              background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)',
              animation: 'setupStepComplete 0.6s ease-out'
            }}
          >
            <CardContent>
              <VStack spacing="md" align="center" style={{ padding: 'var(--foundation-space-4)' }}>
                <Box style={{ fontSize: '48px', lineHeight: 1 }}>🎉</Box>
                <VStack spacing="xs" align="center">
                  <H3 style={{ color: 'white' }}>Grattis! Din webbplats är nu live!</H3>
                  <Body size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Alla setup-steg är slutförda
                  </Body>
                </VStack>
              </VStack>
            </CardContent>
          </Card>
        ) : (
          <Card 
            variant="outlined"
            style={{
              background: 'linear-gradient(135deg, var(--accent-50) 0%, var(--accent-100) 100%)'
            }}
          >
            <CardContent>
              <VStack spacing="md">
                {/* Progress Bar */}
                <Box
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-500)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease',
                      animation: 'setupProgressGrow 0.8s ease-out'
                    }}
                  />
                </Box>

                {/* Progress Text */}
                <HStack justify="between" align="center">
                  <Body size="sm" weight="medium">
                    {completedSteps} av {steps.length} steg slutförda
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
};

