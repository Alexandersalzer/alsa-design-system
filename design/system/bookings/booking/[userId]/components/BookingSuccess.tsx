/**
 * BookingSuccess - Success screen after booking is created
 */
'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  VStack,
  HStack,
  H2,
  H3,
  Body,
  Label,
  Button,
  Icon
} from '@blimpify-im/ui';
import { CheckIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import type { Service } from '../types';

interface BookingSuccessProps {
  appointment: any;
  service: Service | null;
  userId: number;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  let date: Date;
  if (typeof dateString === 'string' && dateString.includes('T')) {
    date = new Date(dateString);
  } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    date = new Date(dateString + 'T00:00:00');
  } else {
    date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) {
    return dateString || '';
  }
  
  return date.toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BookingSuccess({
  appointment,
  service,
  userId
}: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);

  // Debug: Logga appointment-objektet
  React.useEffect(() => {
    console.log('[BookingSuccess] Appointment object:', appointment);
    console.log('[BookingSuccess] Service object:', service);
    console.log('[BookingSuccess] Appointment resource_price:', (appointment as any)?.resource_price);
    console.log('[BookingSuccess] Appointment resource_price_unit:', (appointment as any)?.resource_price_unit);
    console.log('[BookingSuccess] Appointment service_price:', (appointment as any)?.service_price);
    console.log('[BookingSuccess] Appointment service_price_unit:', (appointment as any)?.service_price_unit);
  }, [appointment, service]);

  const copyBookingNumber = async () => {
    if (!appointment?.booking_number) return;
    
    try {
      await navigator.clipboard.writeText(appointment.booking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Beräkna antal dagar för rentals
  // Räknar antal dygn baserat på 24-timmarsperioder från upphämtningstidpunkten
  const calculateRentalDays = (): number | null => {
    if (!appointment?.start_datetime || !appointment?.end_datetime) {
      console.log('[BookingSuccess] No start_datetime or end_datetime');
      return null;
    }
    try {
      const start = new Date(appointment.start_datetime);
      const end = new Date(appointment.end_datetime);
      
      // Kontrollera att datum är giltiga
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.log('[BookingSuccess] Invalid dates');
        return null;
      }
      
      // start_datetime och end_datetime innehåller redan både datum och tid
      // Räkna skillnaden i millisekunder
      const diffTime = Math.abs(end.getTime() - start.getTime());
      
      // Räkna antal timmar
      const diffHours = diffTime / (1000 * 60 * 60);
      
      // Räkna antal påbörjade 24-timmarsperioder
      // Om diffHours är exakt 0, returnera 0 (ingen skillnad)
      // Annars: om diffHours <= 24, returnera 1 dygn
      // Om diffHours > 24, avrunda uppåt till antal dygn
      let result: number;
      if (diffHours === 0) {
        result = 0;
      } else if (diffHours <= 24) {
        result = 1; // Mindre än eller exakt 24 timmar = 1 dygn
      } else {
        result = Math.ceil(diffHours / 24); // Mer än 24 timmar, avrunda uppåt
      }
      console.log('[BookingSuccess] Calculated rentalDays:', result, 'from', appointment.start_datetime, 'to', appointment.end_datetime, 'diffHours:', diffHours);
      return result;
    } catch (error) {
      console.error('[BookingSuccess] Error calculating rentalDays:', error);
      return null;
    }
  };

  const rentalDays = calculateRentalDays();
  const isRental = appointment?.booking_type === 'rental' || (service?.price_unit && ['day', 'week', 'month'].includes(service.price_unit));
  
  // Debug: Logga rentalDays och all data
  React.useEffect(() => {
    console.log('[BookingSuccess] ========== DEBUG INFO ==========');
    console.log('[BookingSuccess] rentalDays:', rentalDays, 'type:', typeof rentalDays);
    console.log('[BookingSuccess] isRental:', isRental);
    console.log('[BookingSuccess] appointment:', JSON.stringify(appointment, null, 2));
    console.log('[BookingSuccess] service:', JSON.stringify(service, null, 2));
    console.log('[BookingSuccess] appointment.resource_price:', (appointment as any)?.resource_price);
    console.log('[BookingSuccess] appointment.resource_price_unit:', (appointment as any)?.resource_price_unit);
    console.log('[BookingSuccess] appointment.service_price:', (appointment as any)?.service_price);
    console.log('[BookingSuccess] appointment.service_price_unit:', (appointment as any)?.service_price_unit);
    console.log('[BookingSuccess] =================================');
  }, [rentalDays, isRental, appointment, service]);
  
  // Beräkna pris för rentals
  const totalPrice = useMemo(() => {
    // För rentals, rentalDays ska alltid vara minst 1
    if (!isRental || rentalDays === null || rentalDays === undefined) {
      console.log('[BookingSuccess] No price calculation - isRental:', isRental, 'rentalDays:', rentalDays);
      return null;
    }
    
    // Om rentalDays är 0 eller negativt, använd 1 (minst 1 dag för rentals)
    const daysToUse = rentalDays > 0 ? rentalDays : 1;
    
    // Prioritera resource_price om det finns (för rentals används resource pris)
    const resourcePrice = (appointment as any)?.resource_price;
    const resourcePriceUnit = (appointment as any)?.resource_price_unit;
    const servicePrice = (appointment as any)?.service_price || service?.price;
    const servicePriceUnit = (appointment as any)?.service_price_unit || service?.price_unit;
    
    console.log('[BookingSuccess] Price data:', {
      resourcePrice,
      resourcePriceUnit,
      servicePrice,
      servicePriceUnit,
      rentalDays
    });
    
    // Använd resource price om det finns, annars service price
    const price = resourcePrice !== undefined && resourcePrice !== null && resourcePrice > 0 
      ? resourcePrice 
      : (servicePrice !== undefined && servicePrice !== null && servicePrice > 0 ? servicePrice : null);
    
    const priceUnit = resourcePriceUnit || servicePriceUnit;
    
    if (!price || price <= 0 || !priceUnit) {
      console.log('[BookingSuccess] No valid price or priceUnit:', { price, priceUnit });
      return null;
    }
    
    // Beräkna totalt pris baserat på price_unit
    let calculatedPrice: number;
    if (priceUnit === 'day') {
      calculatedPrice = price * daysToUse;
    } else if (priceUnit === 'week') {
      const weeks = Math.ceil(daysToUse / 7);
      calculatedPrice = price * weeks;
    } else if (priceUnit === 'month') {
      const months = Math.ceil(daysToUse / 30);
      calculatedPrice = price * months;
    } else if (priceUnit === 'hour') {
      calculatedPrice = price * daysToUse * 24;
    } else {
      // Fixed price
      calculatedPrice = price;
    }
    
    console.log('[BookingSuccess] Calculated total price:', calculatedPrice, 'using daysToUse:', daysToUse);
    return calculatedPrice > 0 ? calculatedPrice : null;
  }, [isRental, rentalDays, appointment, service]);

  return (
    <Card variant="elevated" radius="md">
      <CardContent>
        <VStack spacing="lg">
          <HStack spacing="sm" align="center" justify="center">
            <Icon size="lg" color="success">
              <CheckIcon />
            </Icon>
            <VStack spacing="xs" align="center">
              <H2>Bokning skapad!</H2>
              <Body size="sm" color="secondary">
                Du kommer att få en bekräftelse via e-post.
              </Body>
            </VStack>
          </HStack>

          {appointment.booking_number && (
            <Card variant="outlined" radius="sm">
              <CardContent>
                <VStack spacing="xs">
                  <HStack spacing="sm" justify="between" align="center">
                    <Label size="sm" color="secondary">Bokningsnummer</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyBookingNumber}
                      style={{ minWidth: 'auto', padding: 'var(--foundation-space-xs)' }}
                    >
                      <Icon size="sm" color={copied ? 'success' : 'primary'}>
                        {copied ? <ClipboardDocumentCheckIcon /> : <ClipboardDocumentIcon />}
                      </Icon>
                      {copied ? 'Kopierat!' : 'Kopiera'}
                    </Button>
                  </HStack>
                  <Body weight="bold" size="lg" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                    {appointment.booking_number}
                  </Body>
                  <Body size="xs" color="secondary">
                    Spara detta nummer för att hantera din bokning senare
                  </Body>
                </VStack>
              </CardContent>
            </Card>
          )}

          <Card variant="outlined" radius="sm">
            <CardHeader>
              <H3>Bokningsdetaljer</H3>
            </CardHeader>
            <CardContent>
              <VStack spacing="md">
                <HStack spacing="sm" align="start">
                  <Label size="sm" style={{ minWidth: '120px' }}>Tjänst:</Label>
                  <VStack spacing="xs" align="start">
                    <Body style={{ textAlign: 'left' }}>
                      {appointment.service_name || service?.name}
                      {!isRental && service?.duration_minutes && service.duration_minutes > 0 ? ` (${service.duration_minutes} min)` : ''}
                      {!isRental && service?.price && service.price > 0 ? ` - ${service.price} kr` : ''}
                    </Body>
                    {service?.description && service.description.trim() && (
                      <Body size="sm" color="secondary" style={{ textAlign: 'left' }}>
                        {service.description}
                      </Body>
                    )}
                  </VStack>
                </HStack>

                {appointment.date && !isRental && (
                  <HStack spacing="sm" align="start">
                    <Label size="sm" style={{ minWidth: '120px' }}>Datum:</Label>
                    <Body style={{ textAlign: 'left' }}>{formatDate(appointment.date)}</Body>
                  </HStack>
                )}

                {appointment.start_time && appointment.end_time && !isRental && (
                  <HStack spacing="sm" align="start">
                    <Label size="sm" style={{ minWidth: '120px' }}>Tid:</Label>
                    <Body style={{ textAlign: 'left' }}>
                      {appointment.start_time?.substring(0, 5) || appointment.start_time} - {appointment.end_time?.substring(0, 5) || appointment.end_time}
                    </Body>
                  </HStack>
                )}

                {appointment.start_datetime && appointment.end_datetime && (
                  <>
                    <HStack spacing="sm" align="start">
                      <Label size="sm" style={{ minWidth: '120px' }}>{isRental ? 'Hämtning:' : 'Start:'}</Label>
                      <Body style={{ textAlign: 'left' }}>{formatDate(appointment.start_datetime)}</Body>
                    </HStack>
                    <HStack spacing="sm" align="start">
                      <Label size="sm" style={{ minWidth: '120px' }}>{isRental ? 'Lämning:' : 'Slut:'}</Label>
                      <Body style={{ textAlign: 'left' }}>{formatDate(appointment.end_datetime)}</Body>
                    </HStack>
                    {isRental && typeof rentalDays === 'number' && !isNaN(rentalDays) && (
                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>Antal dagar:</Label>
                        <Body style={{ textAlign: 'left' }}>{rentalDays > 0 ? rentalDays : 1} {(rentalDays > 0 ? rentalDays : 1) === 1 ? 'dag' : 'dagar'}</Body>
                      </HStack>
                    )}
                  </>
                )}

                {appointment.resource_name && (
                  <>
                    <HStack spacing="sm" align="start">
                      <Label size="sm" style={{ minWidth: '120px' }}>{isRental ? 'Objekt:' : 'Resurs:'}</Label>
                      <Body style={{ textAlign: 'left' }}>{appointment.resource_name}</Body>
                    </HStack>
                    {appointment.resource_description && (
                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>Beskrivning:</Label>
                        <Body style={{ textAlign: 'left', whiteSpace: 'pre-wrap', width: '100%' }}>{appointment.resource_description}</Body>
                      </HStack>
                    )}
                  </>
                )}

                {/* Visa pris för rentals */}
                {(() => {
                  // Kontrollera alla villkor först - använd booleaner istället för numeriska värden
                  if (!isRental) return null;
                  if (typeof rentalDays !== 'number' || isNaN(rentalDays)) return null;
                  if (typeof totalPrice !== 'number' || isNaN(totalPrice) || totalPrice <= 0) return null;
                  
                  const daysToUse = rentalDays > 0 ? rentalDays : 1;
                  const resourcePrice = (appointment as any)?.resource_price;
                  const resourcePriceUnit = (appointment as any)?.resource_price_unit;
                  const servicePrice = (appointment as any)?.service_price || service?.price;
                  const servicePriceUnit = (appointment as any)?.service_price_unit || service?.price_unit;
                  
                  const price = resourcePrice !== undefined && resourcePrice !== null && resourcePrice > 0 
                    ? resourcePrice 
                    : (servicePrice !== undefined && servicePrice !== null && servicePrice > 0 ? servicePrice : null);
                  const priceUnit = resourcePriceUnit || servicePriceUnit;
                  
                  // Om price eller priceUnit saknas, returnera null
                  if (!price || price <= 0 || !priceUnit) return null;
                  
                  const priceUnitText = priceUnit === 'day' ? 'dag' : priceUnit === 'week' ? 'vecka' : priceUnit === 'month' ? 'månad' : priceUnit === 'hour' ? 'timme' : priceUnit;
                  
                  return (
                  <HStack spacing="sm" align="start">
                    <Label size="sm" style={{ minWidth: '120px' }}>Totalt pris:</Label>
                    <Body weight="bold" style={{ textAlign: 'left' }}>
                      {totalPrice} kr
                        {priceUnit === 'day' && daysToUse > 0 ? (
                          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)', display: 'inline', marginLeft: '8px' }}>
                            ({price} kr/{priceUnitText} × {daysToUse} {daysToUse === 1 ? 'dag' : 'dagar'})
                          </span>
                        ) : null}
                    </Body>
                  </HStack>
                  );
                })()}

                <HStack spacing="sm" align="start">
                  <Label size="sm" style={{ minWidth: '120px' }}>Namn:</Label>
                  <Body style={{ textAlign: 'left' }}>{appointment.customer_name}</Body>
                </HStack>
                
                <HStack spacing="sm" align="start">
                  <Label size="sm" style={{ minWidth: '120px' }}>E-post:</Label>
                  <Body style={{ textAlign: 'left' }}>{appointment.customer_email}</Body>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          <Body size="sm" color="secondary" style={{ textAlign: 'center' }}>
            <a
              href={`/bookings/customer/${userId}`}
              style={{ color: 'var(--accent-500)', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Eller gå till kundportalen för att se och avboka dina bokningar
            </a>
          </Body>
        </VStack>
      </CardContent>
    </Card>
  );
}

