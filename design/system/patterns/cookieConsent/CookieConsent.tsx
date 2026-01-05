'use client';

import React, { useState } from 'react';
import { useConsent, type ConsentState } from './ConsentProvider';
import { Button } from '../../components/actions/Button';
import { Label, Body } from '../../components/Typography';
import { Card } from '../../components/layout/Card';
import { VStack } from '../../components/layout/vStack';
import { HStack } from '../../components/layout/hStack';
import { Checkbox } from '../../components/forms/Checkbox';
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
      <Card variant="elevated" padding="lg" radius="lg" className={styles.card}>
        <VStack spacing="sm" align="start">
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
              <Checkbox
                checked
                disabled
                label={t.categories.essential.title}
                description={t.categories.essential.description}
                size="sm"
                wrapperClassName={styles.categoryCheckbox}
              />

              {/* Analytics */}
              <Checkbox
                checked={selectedCategories.analytics || false}
                onChange={(e) => {
                  if (e.target.checked !== selectedCategories.analytics) {
                    handleToggleCategory('analytics');
                  }
                }}
                label={t.categories.analytics.title}
                description={t.categories.analytics.description}
                size="sm"
                wrapperClassName={styles.categoryCheckbox}
              />

              {/* Marketing */}
              <Checkbox
                checked={selectedCategories.marketing || false}
                onChange={(e) => {
                  if (e.target.checked !== selectedCategories.marketing) {
                    handleToggleCategory('marketing');
                  }
                }}
                label={t.categories.marketing.title}
                description={t.categories.marketing.description}
                size="sm"
                wrapperClassName={styles.categoryCheckbox}
              />

              {/* Preferences */}
              <Checkbox
                checked={selectedCategories.preferences || false}
                onChange={(e) => {
                  if (e.target.checked !== selectedCategories.preferences) {
                    handleToggleCategory('preferences');
                  }
                }}
                label={t.categories.preferences.title}
                description={t.categories.preferences.description}
                size="sm"
                wrapperClassName={styles.categoryCheckbox}
              />
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
