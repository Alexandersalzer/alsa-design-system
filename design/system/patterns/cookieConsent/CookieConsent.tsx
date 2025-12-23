'use client';

import React, { useState } from 'react';
import { useConsent, type ConsentState } from './ConsentProvider';
import { Button } from '../../components/actions/Button';
import { Label, Body } from '../../components/Typography';
import { Card } from '../../components/layout/Card';
import { VStack } from '../../components/layout/vStack';
import { HStack } from '../../components/layout/hStack';
import styles from './CookieConsent.module.css';

export interface CookieConsentProps {
  /** Titel på bannern */
  title?: string;
  /** Beskrivning */
  description?: string;
  /** Länk till integritetspolicy */
  privacyPolicyUrl?: string;
  /** Text för "Läs mer" länk */
  privacyPolicyText?: string;
  /** Position */
  position?: 'bottom' | 'bottom-left' | 'bottom-right' | 'center';
  /** Visa detaljerade inställningar direkt */
  showDetailsInitially?: boolean;
}

export function CookieConsent({
  title = 'Vi använder cookies',
  description = 'Vi använder cookies för att förbättra din upplevelse på vår webbplats. Vissa cookies är nödvändiga för att webbplatsen ska fungera, medan andra hjälper oss att förstå hur du använder sidan och möjliggör marknadsföring.',
  privacyPolicyUrl = '/integritetspolicy',
  privacyPolicyText = 'Läs vår integritetspolicy',
  position = 'bottom-left',
  showDetailsInitially = false,
}: CookieConsentProps) {
  const { hasResponded, isLoading, acceptAll, rejectAll, acceptSelected } = useConsent();
  const [showDetails, setShowDetails] = useState(showDetailsInitially);
  const [selectedCategories, setSelectedCategories] = useState<Partial<ConsentState>>({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Visa inte om redan svarat eller laddar
  if (isLoading || hasResponded) {
    return null;
  }

  const handleToggleCategory = (category: keyof Omit<ConsentState, 'necessary'>) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptSelected = () => {
    acceptSelected(selectedCategories);
  };

  const positionClass = styles[`consent--${position}`] || styles['consent--bottom'];

  return (
    <div 
      className={`${styles.consent} ${positionClass}`} 
      role="dialog" 
      aria-label="Cookie consent"
    >
      <Card variant="elevated" padding="lg" radius="lg">
        <VStack spacing="md" align="start">
          {/* Header */}
          <Label size="lg" weight="bold" color="primary">
            {title}
          </Label>

          {/* Description */}
          <Body size="sm" color="secondary">
            {description}
          </Body>

          {/* Detaljerade inställningar */}
          {showDetails && (
            <VStack spacing="sm" align="stretch" className={styles.details}>
              {/* Nödvändiga - alltid på */}
              <label className={`${styles.category} ${styles.categoryDisabled}`}>
                <input type="checkbox" checked disabled className={styles.checkbox} />
                <VStack spacing="xs" align="start">
                  <Label size="sm" weight="semibold">Essentiella</Label>
                  <Body size="xs" color="tertiary">
                    Essentiella cookies och tjänster används för att aktivera webbplatsens centrala funktioner, såsom att säkerställa webbplatsens säkerhet.
                  </Body>
                </VStack>
              </label>

              {/* Analytics */}
              <label className={styles.category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.analytics}
                  onChange={() => handleToggleCategory('analytics')}
                  className={styles.checkbox}
                />
                <VStack spacing="xs" align="start">
                  <Label size="sm" weight="semibold">Analys</Label>
                  <Body size="xs" color="tertiary">
                    Analyscookies och -tjänster används för att samla in statistisk information om hur besökare interagerar med en webbplats. Dessa tekniker ger insikter i webbplatsanvändning, besökarnas beteende och webbplatsens prestanda för att förstå och förbättra webbplatsen och förbättra användarupplevelsen.
                  </Body>
                </VStack>
              </label>

              {/* Marketing */}
              <label className={styles.category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.marketing}
                  onChange={() => handleToggleCategory('marketing')}
                  className={styles.checkbox}
                />
                <VStack spacing="xs" align="start">
                  <Label size="sm" weight="semibold">Marknadsföring</Label>
                  <Body size="xs" color="tertiary">
                    Marknadsförings cookies och -tjänster används för att leverera personliga annonser, kampanjer och erbjudanden. Dessa tekniker möjliggör riktade annonser och marknadsföringskampanjer genom att samla in information om användarnas intressen, preferenser och onlineaktiviteter.
                  </Body>
                </VStack>
              </label>

              {/* Preferences */}
              <label className={styles.category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.preferences}
                  onChange={() => handleToggleCategory('preferences')}
                  className={styles.checkbox}
                />
                <VStack spacing="xs" align="start">
                  <Label size="sm" weight="semibold">Preferenser</Label>
                  <Body size="xs" color="tertiary">
                    Funktionella cookies och tjänster används för att erbjuda förbättrade och personliga funktioner. Dessa tekniker ger ytterligare funktioner och förbättrade användarupplevelser, till exempel att komma ihåg dina språkinställningar, teckenstorlekar, regionsval och anpassade layouter. Om du väljer bort dessa cookies kan vissa tjänster eller funktioner på webbplatsen bli otillgängliga.
                  </Body>
                </VStack>
              </label>

              {/* Integritetspolicy länk */}
              {privacyPolicyUrl && (
                <Body size="sm" color="secondary">
                  <a href={privacyPolicyUrl} className={styles.link}>
                    {privacyPolicyText}
                  </a>
                </Body>
              )}
            </VStack>
          )}

          {/* Knappar */}
          <HStack spacing="sm" justify="between" wrap className={styles.actions}>
            {!showDetails ? (
              <>
                <HStack spacing="sm" wrap>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                  >
                    Anpassa
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={rejectAll}
                  >
                    Endast nödvändiga
                  </Button>
                </HStack>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={acceptAll}
                >
                  Acceptera alla
                </Button>
              </>
            ) : (
              <>
                <HStack spacing="sm" wrap>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    Tillbaka
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={rejectAll}
                  >
                    Neka alla
                  </Button>
                </HStack>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleAcceptSelected}
                >
                  Spara val
                </Button>
              </>
            )}
          </HStack>
        </VStack>
      </Card>
    </div>
  );
}
