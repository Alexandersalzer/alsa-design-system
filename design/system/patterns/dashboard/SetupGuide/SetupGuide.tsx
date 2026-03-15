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
  optional?: boolean;
  buttonLabel?: string; // e.g. "Öppna editorn", "Redigera SEO", "Publicera"
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

  // Kompakt setup-guide: en rad header + progress, små stegrader
  const firstIncomplete = sortedSteps.find(s => !s.completed);

  return (
    <div className={`setup-guide setup-guide--compact ${className ?? ''}`}>
      <Divider className="setup-guide__divider" />

      <VStack spacing="md">
        {/* Header: titel + progress på en rad */}
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
                <Progress
                  value={progress}
                  size="xs"
                  rounded
                  animated
                />
              </Box>
            </HStack>
          )}
        </HStack>

        {/* En CTA för nästa steg – kompakt */}
        {firstIncomplete && (
          <Button
            variant="accent"
            size="sm"
            onClick={() => handleNavigate(firstIncomplete.href)}
            className="setup-guide__cta-one"
          >
            <HStack spacing="xs" align="center">
              <Icon size="sm">
                {(() => {
                  const FirstIcon = firstIncomplete.icon;
                  return <FirstIcon />;
                })()}
              </Icon>
              <span>{firstIncomplete.buttonLabel ?? 'Gå till steg'}</span>
            </HStack>
          </Button>
        )}

        {/* Kompakt steglista – bara titel + action */}
        <Listbox
          variant="default"
          size="sm"
          spacing="xs"
          role="list"
          className="setup-guide__list"
        >
          {sortedSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <ListboxItem
                key={step.key}
                size="sm"
                onClick={!step.completed ? () => handleNavigate(step.href) : undefined}
                disabled={step.completed}
                aria-label={`${step.title}: ${step.description}`}
                leading={
                  <Icon
                    size="sm"
                    color={step.completed ? 'success' : 'tertiary'}
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
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(step.href);
                      }}
                    >
                      {step.buttonLabel ?? 'Gå till'}
                    </Button>
                  )
                }
              >
                <Label size="sm" color={step.completed ? 'secondary' : 'primary'}>
                  {step.title}
                </Label>
              </ListboxItem>
            );
          })}
        </Listbox>
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

