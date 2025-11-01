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
  id?: string;  // Stöd för både id och key
  key?: string;
  title: string;
  description: string;
  href?: string;
  completed: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  actionLabel?: string;
}

type SetupPhase = 'building' | 'launch' | 'done';

export interface SetupGuideProps {
  phase?: SetupPhase;
  className?: string;
  onNavigate?: (href: string) => void;
  // Stöd för både nya och gamla prop-namn
  steps?: SetupStep[];
  progress?: number;
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

// Fallback ikoner om step inte har egen
const getDefaultIcon = (stepKey: string) => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    overview: EyeIcon,
    requests: ChatBubbleLeftRightIcon,
    preview: GlobeAltIcon,
    features: CircleStackIcon,
    review: EyeIcon,
    domain: GlobeAltIcon,
    publish: CheckCircleIcon,
    done: CheckCircleIcon
  };
  return iconMap[stepKey] || CircleStackIcon;
};

// ===== MAIN COMPONENT =====
export const SetupGuide: React.FC<SetupGuideProps> = ({ 
  phase = 'building', 
  className,
  onNavigate,
  steps: stepsProp,
  progress: progressProp,
  customSteps,
  customProgress
}) => {
  // Stöd för både nya (steps) och gamla (customSteps) prop-namn
  const steps = stepsProp || customSteps || getSteps(phase);
  
  // Beräkna progress
  const completedSteps = steps.filter(s => s.completed).length;
  const progress = progressProp !== undefined
    ? progressProp
    : (customProgress !== undefined 
        ? customProgress
        : (steps.length > 0 
            ? Math.round((completedSteps / steps.length) * 100) 
            : 0));

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
            const stepKey = step.id || step.key || '';
            const stepHref = step.href || '/overview';
            const IconComponent = step.icon || getDefaultIcon(stepKey);
            
            return (
              <Card 
                key={stepKey} 
                variant="outlined"
                interactive={!step.completed}
                onCardClick={!step.completed && stepHref ? () => handleNavigate(stepHref) : undefined}
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
                    {!step.completed && stepHref && (
                      <Button 
                        variant="accent" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(stepHref);
                        }}
                      >
                        {step.actionLabel || 'Gå till'}
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
            className="setup-guide__completed-card"
          >
            <CardContent>
              <VStack spacing="md" align="center" className="setup-guide__completed-content">
                <Box className="setup-guide__completed-emoji">🎉</Box>
                <VStack spacing="xs" align="center">
                  <H3 className="setup-guide__completed-title">Grattis! Din webbplats är nu live!</H3>
                  <Body size="sm" className="setup-guide__completed-subtitle">
                    Alla setup-steg är slutförda
                  </Body>
                </VStack>
              </VStack>
            </CardContent>
          </Card>
        ) : (
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

