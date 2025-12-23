'use client';

import React, { useState } from 'react';
import { useConsent, type ConsentState } from './ConsentProvider';
import { Button } from '../../components/actions/Button';
import { Label, Body } from '../../components/Typography';
import { Card } from '../../components/layout/Card';
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
        {/* Header */}
        <div className={styles.header}>
          <Label size="lg" weight="bold" color="primary">
            {title}
          </Label>
        </div>

        {/* Description */}
        <div className={styles.description}>
          <Body size="sm" color="secondary">
            {description}{' '}
            <a href={privacyPolicyUrl} className={styles.link}>
              {privacyPolicyText}
            </a>
          </Body>
        </div>

        {/* Detaljerade inställningar */}
        {showDetails && (
          <div className={styles.details}>
            {/* Nödvändiga - alltid på */}
            <label className={`${styles.category} ${styles.categoryDisabled}`}>
              <input type="checkbox" checked disabled className={styles.checkbox} />
              <div className={styles.categoryInfo}>
                <Label size="sm" weight="semibold">Nödvändiga</Label>
                <Body size="xs" color="tertiary">
                  Krävs för att webbplatsen ska fungera. Kan inte stängas av.
                </Body>
              </div>
            </label>

            {/* Analytics */}
            <label className={styles.category}>
              <input
                type="checkbox"
                checked={selectedCategories.analytics}
                onChange={() => handleToggleCategory('analytics')}
                className={styles.checkbox}
              />
              <div className={styles.categoryInfo}>
                <Label size="sm" weight="semibold">Analys</Label>
                <Body size="xs" color="tertiary">
                  Hjälper oss förstå hur besökare använder webbplatsen.
                </Body>
              </div>
            </label>

            {/* Marketing */}
            <label className={styles.category}>
              <input
                type="checkbox"
                checked={selectedCategories.marketing}
                onChange={() => handleToggleCategory('marketing')}
                className={styles.checkbox}
              />
              <div className={styles.categoryInfo}>
                <Label size="sm" weight="semibold">Marknadsföring</Label>
                <Body size="xs" color="tertiary">
                  Används för att visa relevanta annonser.
                </Body>
              </div>
            </label>

            {/* Preferences */}
            <label className={styles.category}>
              <input
                type="checkbox"
                checked={selectedCategories.preferences}
                onChange={() => handleToggleCategory('preferences')}
                className={styles.checkbox}
              />
              <div className={styles.categoryInfo}>
                <Label size="sm" weight="semibold">Preferenser</Label>
                <Body size="xs" color="tertiary">
                  Sparar dina inställningar som språkval.
                </Body>
              </div>
            </label>
          </div>
        )}

        {/* Knappar */}
        <div className={styles.actions}>
          {!showDetails ? (
            // Enkel vy
            <div className={styles.buttonGroup}>
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
              <Button
                variant="primary"
                size="sm"
                onClick={acceptAll}
              >
                Acceptera alla
              </Button>
            </div>
          ) : (
            // Detaljerad vy
            <div className={styles.buttonGroup}>
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
              <Button
                variant="primary"
                size="sm"
                onClick={handleAcceptSelected}
              >
                Spara val
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
