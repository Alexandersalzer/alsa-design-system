/**
 * SourceTracker - Återanvändbar komponent för att spåra hur användare hittade Blimpify
 * 
 * @author Blimpify
 * @since 2025-01-10
 */

import React, { useState } from 'react';
import { VStack, Grid } from '../../../components/layout';
import { Body } from '../../../components/Typography';
import { Button, SelectionCard, Icon } from '../../../components';
import { AlertRoot, AlertContent, AlertDescription } from '../../../components/feedback';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  ShareIcon, 
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';

export type SourceOption = 'linkedin' | 'referens' | 'sökte' | 'annat';

export interface SourceTrackerProps {
  /** Callback när användaren väljer en källa */
  onSourceSelected?: (source: SourceOption) => void;
  /** Callback när användaren skickar in data */
  onSubmit?: (source: SourceOption) => Promise<void>;
  /** Om komponenten ska visa submit-knapp */
  showSubmitButton?: boolean;
  /** Titel för komponenten */
  title?: string;
  /** Beskrivning för komponenten */
  description?: string;
  /** Om komponenten är disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** CSS klasser */
  className?: string;
}

const sourceOptions = [
  {
    value: 'linkedin' as SourceOption,
    label: 'LinkedIn',
    description: 'Såg Blimpify på LinkedIn',
    icon: UserGroupIcon
  },
  {
    value: 'referens' as SourceOption,
    label: 'Referens',
    description: 'Rekommendation från någon',
    icon: ShareIcon
  },
  {
    value: 'sökte' as SourceOption,
    label: 'Sökte',
    description: 'Hittade via sökmotorer',
    icon: MagnifyingGlassIcon
  },
  {
    value: 'annat' as SourceOption,
    label: 'Annat',
    description: 'Annan källa',
    icon: EllipsisHorizontalIcon
  }
];

export const SourceTracker: React.FC<SourceTrackerProps> = ({
  onSourceSelected,
  onSubmit,
  showSubmitButton = true,
  title = "Hur hittade du Blimpify?",
  description = "Hjälp oss förstå hur du kom i kontakt med oss",
  disabled = false,
  loading = false,
  className
}) => {
  const [selectedSource, setSelectedSource] = useState<SourceOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSourceSelect = (source: SourceOption) => {
    if (disabled || loading) return;
    
    setSelectedSource(source);
    setError(null);
    onSourceSelected?.(source);
  };

  const handleSubmit = async () => {
    if (!selectedSource || !onSubmit) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(selectedSource);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Något gick fel');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <VStack spacing="md" className={className}>
        <VStack spacing="sm" align="center">
          <Body color="success" weight="medium">
            Tack för din feedback!
          </Body>
          <Body size="sm" color="secondary" align="center">
            Din information hjälper oss att förbättra våra tjänster.
          </Body>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack spacing="lg" className={className}>
      <VStack spacing="sm" align="center">
        <Body weight="semibold" size="lg">
          {title}
        </Body>
        <Body color="secondary" align="center">
          {description}
        </Body>
      </VStack>

      <Grid columns={2} gap="md">
        {sourceOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <SelectionCard
              key={option.value}
              selected={selectedSource === option.value}
              onClick={() => handleSourceSelect(option.value)}
              disabled={disabled || loading}
              orientation="vertical"
              size="md"
            >
              <VStack spacing="sm" align="center">
                <Icon size="lg" color={selectedSource === option.value ? "accent" : "secondary"}>
                  <IconComponent />
                </Icon>
                <Body weight="medium" align="center">
                  {option.label}
                </Body>
                <Body size="sm" color="secondary" align="center">
                  {option.description}
                </Body>
              </VStack>
            </SelectionCard>
          );
        })}
      </Grid>

      {error && (
        <AlertRoot variant="error" surface="subtle">
          <AlertContent>
            <AlertDescription>{error}</AlertDescription>
          </AlertContent>
        </AlertRoot>
      )}

      {showSubmitButton && selectedSource && (
        <Button
          variant="accent"
          size="md"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={disabled || isSubmitting}
          style={{ alignSelf: 'center' }}
        >
          Skicka
        </Button>
      )}
    </VStack>
  );
};

SourceTracker.displayName = 'SourceTracker';
