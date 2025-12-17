/**
 * Step 1: Service Selection
 */
'use client';

import React from 'react';
import {
  VStack,
  HStack,
  Card,
  CardContent,
  Body,
  Button,
  Icon,
  Spinner
} from '@blimpify-im/ui';
import { ClockIcon, PhotoIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { Service } from '../../types';

interface Step1ServiceSelectionProps {
  services: Service[];
  resourceTypes: Service[]; // Categories för rentals
  businessType: 'services' | 'rentals' | 'both';
  allBookableItems: Service[]; // Kombinerad lista
  selectedService: number | null;
  onServiceSelect: (serviceId: number | null) => void;
  loadingServices: boolean;
  imageErrors: Set<number>;
  onImageError: (serviceId: number) => void;
}

export default function Step1ServiceSelection({
  services,
  resourceTypes,
  businessType,
  allBookableItems,
  selectedService,
  onServiceSelect,
  loadingServices,
  imageErrors,
  onImageError
}: Step1ServiceSelectionProps) {
  if (loadingServices) {
    return (
      <VStack spacing="md" align="center">
        <Spinner size="lg" />
        <Body color="secondary">Laddar tjänster...</Body>
      </VStack>
    );
  }

  // Separera services och categories för visning
  const servicesToShow = services.filter(s => s.can_book !== false);
  const categoriesToShow = resourceTypes.filter(rt => rt.can_book !== false);
  
  // Kolla om det finns något att visa (services eller categories)
  const hasServicesToShow = (businessType === 'services' || businessType === 'both') && servicesToShow.length > 0;
  const hasCategoriesToShow = (businessType === 'rentals' || businessType === 'both') && categoriesToShow.length > 0;
  
  if (!hasServicesToShow && !hasCategoriesToShow) {
    return (
      <Body size="sm" color="secondary" align="center">
        Inga tjänster eller kategorier tillgängliga just nu.
      </Body>
    );
  }

  console.log('[Step1ServiceSelection] ===== RENDERING =====');
  console.log('[Step1ServiceSelection] businessType:', businessType);
  console.log('[Step1ServiceSelection] services count:', services.length, '-> servicesToShow:', servicesToShow.length);
  console.log('[Step1ServiceSelection] resourceTypes count:', resourceTypes.length, '-> categoriesToShow:', categoriesToShow.length);
  console.log('[Step1ServiceSelection] services:', servicesToShow.map(s => ({
    id: s.id,
    name: s.name,
    booking_type: s.booking_type
  })));
  console.log('[Step1ServiceSelection] categories:', categoriesToShow.map(c => ({
    id: c.id,
    name: c.name,
    booking_type: c.booking_type
  })));
  console.log('[Step1ServiceSelection] allBookableItems:', allBookableItems.map(item => ({
    id: item.id,
    name: item.name,
    booking_type: item.booking_type,
    isInServices: servicesToShow.some(s => s.id === item.id),
    isInCategories: categoriesToShow.some(c => c.id === item.id)
  })));

  return (
    <VStack spacing="lg">
      {/* Visa services om det finns services eller hybrid */}
      {(businessType === 'services' || businessType === 'both') && servicesToShow.length > 0 && (
        <VStack spacing="md">
          <Body weight="semibold" size="lg" color="primary">
            Tjänster
          </Body>
          <HStack spacing="sm" wrap align="stretch">
            {servicesToShow.map((service) => {
              return renderServiceCard(service, selectedService, onServiceSelect, imageErrors, onImageError);
            })}
          </HStack>
        </VStack>
      )}

      {/* Visa categories om det finns rentals eller hybrid */}
      {(businessType === 'rentals' || businessType === 'both') && categoriesToShow.length > 0 && (
        <VStack spacing="md">
          <Body weight="semibold" size="lg" color="primary">
            {businessType === 'both' ? 'Kategorier (Uthyrning)' : 'Kategorier'}
          </Body>
          <HStack spacing="sm" wrap align="stretch">
            {categoriesToShow.map((category) => {
              return renderServiceCard(category, selectedService, onServiceSelect, imageErrors, onImageError, true);
            })}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}

function renderServiceCard(
  service: Service,
  selectedService: number | null,
  onServiceSelect: (serviceId: number | null) => void,
  imageErrors: Set<number>,
  onImageError: (serviceId: number) => void,
  isCategory: boolean = false
) {
  const isSelected = selectedService === service.id;
  const isDisabled = !service.can_book;
  const hasImageError = imageErrors.has(service.id);
  const isRental = service.booking_type === 'rental' || isCategory;
  
  return (
    <Card
      key={service.id}
      variant={isSelected ? 'elevated' : 'outlined'}
      radius="md"
      interactive={!isDisabled}
      selected={isSelected}
      onClick={() => {
        if (!isDisabled) {
          onServiceSelect(service.id);
        }
      }}
      style={{
        opacity: isDisabled ? 0.6 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        flex: '1 1 300px',
        minWidth: '280px',
        maxWidth: '400px'
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {service.image_url && !hasImageError ? (
          <img
            src={service.image_url}
            alt={service.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={() => {
              console.error('[BOOKINGS] Image load error:', {
                url: service.image_url,
                serviceId: service.id,
                serviceName: service.name
              });
              onImageError(service.id);
            }}
          />
        ) : (
          <Icon size="xl" color="tertiary">
            <PhotoIcon />
          </Icon>
        )}
      </div>
      <CardContent>
        <VStack spacing="xs" align="start">
          <Body weight="semibold" color={isSelected ? 'accent' : 'primary'}>
            {service.name}
          </Body>
          {/* För kategorier: visa inte duration eller price (priset sätts på resursnivå) */}
          {/* För tjänster: visa duration och price om de finns */}
          {!isRental && (
            <>
              {(service.duration_minutes != null && service.duration_minutes > 0) || 
               (service.price != null && service.price > 0) ? (
                <HStack spacing="sm" wrap>
                  {service.duration_minutes != null && service.duration_minutes > 0 && (
                    <Body size="sm" color="secondary">
                      <ClockIcon
                        style={{
                          width: '14px',
                          height: '14px',
                          display: 'inline',
                          marginRight: '4px',
                          verticalAlign: 'middle'
                        }}
                      />
                      {service.duration_minutes} min
                    </Body>
                  )}
                  {service.price != null && service.price > 0 && (
                    <Body size="sm" color="secondary">
                      {service.price} kr
                    </Body>
                  )}
                </HStack>
              ) : null}
            </>
          )}
          {isRental && (
            <Body size="sm" color="secondary">
              Pris sätts vid val av resurs
            </Body>
          )}
          {service.description && (
            <Body size="sm" color="secondary" style={{ marginTop: 'var(--foundation-space-xs)' }}>
              {service.description}
            </Body>
          )}
          {service.service_rules && (
            <div style={{ marginTop: 'var(--foundation-space-xs)' }}>
              <HStack spacing="xs" align="start">
                <Icon size="sm" color="accent">
                  <InformationCircleIcon />
                </Icon>
                <Body size="sm" color="secondary" style={{ fontStyle: 'italic' }}>
                  {service.service_rules}
                </Body>
              </HStack>
            </div>
          )}
          {isDisabled && (
            <Body size="sm" color="secondary" style={{ fontStyle: 'italic', marginTop: 'var(--foundation-space-xs)' }}>
              Ej tillgänglig
            </Body>
          )}
        </VStack>
      </CardContent>
    </Card>
  );
}

