'use client';

import React, { useState } from 'react';
import { useConsent, type ConsentState } from './ConsentProvider';
import { Button } from '../../components/actions/Button';
import { Label, Body } from '../../components/Typography';
import { Card } from '../../components/layout/Card';
import { VStack } from '../../components/layout/vStack';
import { HStack } from '../../components/layout/hStack';
import styles from './CookieConsent.module.css';

// Import content
import svContent from './content/sv.json';
import enContent from './content/en.json';

const contentByLocale: Record<string, typeof svContent> = {
  sv: svContent,
  en: enContent,
};

export interface CookieConsentProps {
  /** Locale for translations */
  locale?: string;
  /** Länk till integritetspolicy */
  privacyPolicyUrl?: string;
  /** Position */
  position?: 'bottom' | 'bottom-left' | 'bottom-right' | 'center';
  /** Visa detaljerade inställningar direkt */
  showDetailsInitially?: boolean;
}

export function CookieConsent({
  locale = 'sv',
  privacyPolicyUrl,
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

  // Get content for locale (fallback to Swedish)
  const t = contentByLocale[locale] || contentByLocale['sv'];

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
            {t.title}
          </Label>

          {/* Description */}
          <Body size="sm" color="secondary">
            {t.description}
          </Body>

          {/* Detaljerade inställningar */}
          {showDetails && (
            <VStack spacing="sm" align="stretch" className={styles.details}>
              {/* Nödvändiga - alltid på */}
              <label className={`${styles.category} ${styles.categoryDisabled}`}>
                <input type="checkbox" checked disabled className={styles.checkbox} />
                <VStack spacing="xs" align="start">
                  <Label size="sm" weight="semibold">{t.categories.essential.title}</Label>
                  <Body size="xs" color="tertiary">
                    {t.categories.essential.description}
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
                  <Label size="sm" weight="semibold">{t.categories.analytics.title}</Label>
                  <Body size="xs" color="tertiary">
                    {t.categories.analytics.description}
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
                  <Label size="sm" weight="semibold">{t.categories.marketing.title}</Label>
                  <Body size="xs" color="tertiary">
                    {t.categories.marketing.description}
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
                  <Label size="sm" weight="semibold">{t.categories.preferences.title}</Label>
                  <Body size="xs" color="tertiary">
                    {t.categories.preferences.description}
                  </Body>
                </VStack>
              </label>

              {/* Integritetspolicy länk */}
              {privacyPolicyUrl && (
                <Body size="sm" color="secondary">
                  <a href={privacyPolicyUrl} className={styles.link}>
                    {t.privacyPolicy.text}
                  </a>
                </Body>
              )}
            </VStack>
          )}

          {/* Knappar */}
          <div className={styles.actions}>
            {!showDetails ? (
              <VStack spacing="sm" align="stretch">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={acceptAll}
                  style={{ width: '100%' }}
                >
                  {t.buttons.acceptAll}
                </Button>
                <HStack spacing="sm" justify="between" wrap>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                  >
                    {t.buttons.customize}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={rejectAll}
                  >
                    {t.buttons.rejectAll}
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <VStack spacing="sm" align="stretch">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleAcceptSelected}
                  style={{ width: '100%' }}
                >
                  {t.buttons.saveSelection}
                </Button>
                <HStack spacing="sm" justify="between" wrap>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    {t.buttons.back}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={rejectAll}
                  >
                    {t.buttons.denyAll}
                  </Button>
                </HStack>
              </VStack>
            )}
          </div>
        </VStack>
      </Card>
    </div>
  );
}
