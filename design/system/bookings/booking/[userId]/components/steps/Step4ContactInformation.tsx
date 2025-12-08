/**
 * Step 4: Contact Information
 */
'use client';

import React, { useState } from 'react';
import {
  VStack,
  Input,
  Textarea,
  Card,
  CardContent,
  Body,
  HStack,
  Icon
} from '@blimpify-im/ui';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { Service, BookingFormData } from '../../types';

interface Step4ContactInformationProps {
  formData: Pick<BookingFormData, 'customer_name' | 'customer_email' | 'customer_phone' | 'notes'>;
  onFormDataChange: (data: Pick<BookingFormData, 'customer_name' | 'customer_email' | 'customer_phone' | 'notes'>) => void;
  emailError: string | null;
  onEmailErrorChange: (error: string | null) => void;
  service: Service | null;
  isRental?: boolean;
  startDate?: string;
  endDate?: string;
  pickupTime?: string; // För rentals
  dropoffTime?: string; // För rentals
  selectedResource?: { name?: string; price?: number; price_unit?: string } | null;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step4ContactInformation({
  formData,
  onFormDataChange,
  emailError,
  onEmailErrorChange,
  service,
  isRental = false,
  startDate,
  endDate,
  pickupTime = '09:00',
  dropoffTime = '17:00',
  selectedResource
}: Step4ContactInformationProps) {
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof BookingFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });

    // Validera namn i realtid
    if (field === 'customer_name') {
      if (!value.trim()) {
        setNameError('Namn är obligatoriskt');
      } else if (value.trim().length > 255) {
        setNameError('Namn får inte vara längre än 255 tecken');
      } else {
        setNameError(null);
      }
    }

    // Validera e-post i realtid
    if (field === 'customer_email') {
      if (!value.trim()) {
        onEmailErrorChange('E-post är obligatoriskt');
      } else if (!emailRegex.test(value.trim())) {
        onEmailErrorChange('Ange en giltig e-postadress');
      } else {
        onEmailErrorChange(null);
      }
    }

    // Validera telefonnummer i realtid
    if (field === 'customer_phone') {
      if (value.trim() && value.trim().length > 50) {
        setPhoneError('Telefonnummer får inte vara längre än 50 tecken');
      } else {
        setPhoneError(null);
      }
    }
  };

  // Beräkna antal dagar för rentals
  // Räknar antal dygn baserat på 24-timmarsperioder från upphämtningstidpunkten
  const calculateRentalDays = (): number | null => {
    if (!isRental || !startDate || !endDate) return null;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Kontrollera att datum är giltiga
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
      }
      
      // Kombinera datum med tid för att få exakt start- och sluttidpunkt
      const [pickupHour, pickupMin] = (pickupTime || '09:00').split(':').map(Number);
      const [dropoffHour, dropoffMin] = (dropoffTime || '17:00').split(':').map(Number);
      
      const startDateTime = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        pickupHour || 0,
        pickupMin || 0
      );
      
      const endDateTime = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        dropoffHour || 0,
        dropoffMin || 0
      );
      
      // Räkna skillnaden i millisekunder
      const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
      
      // Räkna antal timmar
      const diffHours = diffTime / (1000 * 60 * 60);
      
      // Räkna antal påbörjade 24-timmarsperioder
      // Om diffHours är exakt 0, returnera 0 (ingen skillnad)
      // Annars: om diffHours <= 24, returnera 1 dygn
      // Om diffHours > 24, avrunda uppåt till antal dygn
      if (diffHours === 0) {
        return 0;
      } else if (diffHours <= 24) {
        return 1; // Mindre än eller exakt 24 timmar = 1 dygn
      } else {
        return Math.ceil(diffHours / 24); // Mer än 24 timmar, avrunda uppåt
      }
    } catch {
      return null;
    }
  };

  const rentalDays = calculateRentalDays();
  
  // Beräkna totalt pris för rentals
  const calculateTotalPrice = (): { price: number; priceUnit: string; totalPrice: number } | null => {
    if (!isRental || rentalDays === null || rentalDays === undefined) return null;
    
    // Om rentalDays är 0 eller negativt, använd 1 (minst 1 dag för rentals)
    const daysToUse = rentalDays > 0 ? rentalDays : 1;
    
    // Försök hämta pris från resource först, annars från service
    const resourcePrice = selectedResource?.price !== undefined && selectedResource?.price !== null ? Number(selectedResource.price) : null;
    const servicePrice = service?.price !== undefined && service?.price !== null ? Number(service.price) : null;
    // Använd resource price_unit om det finns och inte är tomt, annars service price_unit
    const resourcePriceUnit = selectedResource?.price_unit ? String(selectedResource.price_unit).trim() : '';
    const servicePriceUnit = service?.price_unit ? String(service.price_unit).trim() : '';
    const priceUnit = (resourcePriceUnit && resourcePriceUnit !== '') 
      ? resourcePriceUnit
      : (servicePriceUnit && servicePriceUnit !== '') 
        ? servicePriceUnit
        : null;
    
    // Använd resource price om det finns, annars service price
    const price = (resourcePrice !== null && resourcePrice > 0) ? resourcePrice : ((servicePrice !== null && servicePrice > 0) ? servicePrice : null);
    
    if (!price || price <= 0 || !priceUnit) {
      console.log('[Step4ContactInformation] No price/priceUnit:', { price, priceUnit, resourcePrice, servicePrice, resourcePriceUnit, servicePriceUnit });
      return null;
    }
    
    // Beräkna baserat på price_unit - använd daysToUse istället för rentalDays
    let totalPrice: number;
    if (priceUnit === 'day') {
      totalPrice = price * daysToUse;
    } else if (priceUnit === 'week') {
      const weeks = Math.ceil(daysToUse / 7);
      totalPrice = price * weeks;
    } else if (priceUnit === 'month') {
      const months = Math.ceil(daysToUse / 30);
      totalPrice = price * months;
    } else if (priceUnit === 'hour') {
      // För timpris, använd antal dagar * 24 timmar
      totalPrice = price * daysToUse * 24;
    } else {
      // Fallback: använd som fast pris
      totalPrice = price;
    }
    
    console.log('[Step4ContactInformation] Calculated price info:', { price, priceUnit, rentalDays, daysToUse, totalPrice });
    
    return totalPrice > 0 ? { price, priceUnit, totalPrice } : null;
  };

  const priceInfo = calculateTotalPrice();
  
  // Beräkna daysToUse för visning (alltid minst 1 dag)
  const daysToUse = rentalDays !== null && rentalDays !== undefined && rentalDays > 0 ? rentalDays : 1;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('sv-SE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <VStack spacing="md">
      {/* Service info card */}
      {service && (
        <Card variant="outlined" radius="sm">
          <CardContent>
            <VStack spacing="md">
              {/* Service name */}
              <Body weight="semibold" size="lg">{service.name}</Body>
              {/* Visa service description om den finns och inte är "0" */}
              {service.description && service.description.trim() && service.description.trim() !== '0' && (
                <Body size="sm" color="secondary">{service.description}</Body>
              )}
              
              {/* Visa datum/tid för rentals */}
              {isRental && startDate && endDate && (
                <VStack spacing="sm" align="start">
                  <HStack spacing="sm" align="start">
                    <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Hämtning:</Body>
                    <Body size="sm" color="secondary">{formatDate(startDate)}</Body>
                  </HStack>
                  <HStack spacing="sm" align="start">
                    <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Lämning:</Body>
                    <Body size="sm" color="secondary">{formatDate(endDate)}</Body>
                  </HStack>
                  {rentalDays !== null && rentalDays !== undefined ? (
                    <HStack spacing="sm" align="start">
                      <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Antal dagar:</Body>
                      <Body size="sm" color="secondary">{(rentalDays > 0 ? rentalDays : 1)} {(rentalDays > 0 ? rentalDays : 1) === 1 ? 'dag' : 'dagar'}</Body>
                    </HStack>
                  ) : null}
                </VStack>
              )}
              
              {/* Visa resurs/objekt för rentals */}
              {isRental && selectedResource?.name && (
                <HStack spacing="sm" align="start">
                  <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Objekt:</Body>
                  <Body size="sm" color="secondary">{String(selectedResource.name).trim()}</Body>
                </HStack>
              )}
              
              {/* Visa pris för rentals */}
              {isRental && priceInfo && priceInfo.totalPrice > 0 ? (
                <HStack spacing="sm" align="start">
                  <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Totalt pris:</Body>
                  <VStack spacing="xs" align="start">
                    <Body size="lg" weight="bold" color="accent">
                      {priceInfo.totalPrice} kr
                    </Body>
                    {priceInfo.priceUnit === 'day' && daysToUse > 0 ? (
                      <Body size="sm" color="secondary">
                        ({priceInfo.price} kr/{priceInfo.priceUnit === 'day' ? 'dag' : priceInfo.priceUnit === 'week' ? 'vecka' : priceInfo.priceUnit === 'month' ? 'månad' : priceInfo.priceUnit === 'hour' ? 'timme' : priceInfo.priceUnit} × {daysToUse} {daysToUse === 1 ? 'dag' : 'dagar'})
                      </Body>
                    ) : null}
                  </VStack>
                </HStack>
              ) : null}
              
              {/* Visa pris för services */}
              {!isRental && service.price && service.price > 0 ? (
              <HStack spacing="sm" align="start">
                  <Body size="sm" weight="medium" color="secondary" style={{ minWidth: '100px' }}>Pris:</Body>
                  <Body size="lg" weight="bold" color="accent">
                    {service.price} {service.currency?.toUpperCase() || 'SEK'}
                  </Body>
              </HStack>
              ) : null}
            </VStack>
          </CardContent>
        </Card>
      )}

      {/* Viktig information - avbokningsregler och övrig info */}
      {service && (service.service_rules || service.cancellation_rules) ? (
        <Card variant="outlined" radius="sm" style={{ backgroundColor: 'var(--surface-info-subtle)', marginTop: 'var(--foundation-space-sm)' }}>
          <CardContent>
            <VStack spacing="md" align="start">
              <HStack spacing="xs" align="center">
                <Icon size="sm" color="accent">
                  <InformationCircleIcon />
                </Icon>
                <Body size="sm" weight="semibold" color="info">
                  Viktig information
                </Body>
              </HStack>
              
              {service.service_rules ? (
                <Body size="sm" color="secondary" style={{ lineHeight: '1.5' }}>
                  {service.service_rules}
                </Body>
              ) : null}
              
              {service.cancellation_rules && service.cancellation_rules.trim() !== '' ? (
                <VStack spacing="xs" align="start">
                  <Body size="sm" weight="medium" color="secondary">
                    Avbokningsregler:
                  </Body>
                  <Body size="sm" color="secondary" style={{ lineHeight: '1.5' }}>
                    {service.cancellation_rules}
                  </Body>
                </VStack>
              ) : null}
            </VStack>
          </CardContent>
        </Card>
      ) : null}

      <Input
        label="Namn"
        value={formData.customer_name || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 255) {
            handleFieldChange('customer_name', value);
          }
        }}
        required
        placeholder="Ditt fullständiga namn"
        maxLength={255}
        error={nameError || undefined}
      />

      <Input
        label="E-post"
        type="email"
        value={formData.customer_email || ''}
        onChange={(e) => handleFieldChange('customer_email', e.target.value)}
        required
        placeholder="din@epost.se"
        error={emailError || undefined}
      />

      <Input
        label="Telefonnummer (valfritt)"
        type="tel"
        value={formData.customer_phone || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 50) {
            handleFieldChange('customer_phone', value);
          }
        }}
        placeholder="070-123 45 67"
        maxLength={50}
        error={phoneError || undefined}
      />

      <Textarea
        label="Meddelande (valfritt)"
        value={formData.notes || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 1000) {
            handleFieldChange('notes', value);
          }
        }}
        placeholder="Eventuella önskemål eller frågor..."
        maxLength={1000}
      />
    </VStack>
  );
}

