/**
 * Step 2: Resource Selection
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  HStack,
  Card,
  CardContent,
  Body,
  Button,
  Icon,
  Spinner,
  WarningAlert,
  Tag
} from '@blimpify-im/ui';
import { UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import apiClient from '../../../../../../lib/api/client';
import type { Resource, AvailabilityResponse } from '../../types';

interface Step2ResourceSelectionProps {
  externalId: string;
  serviceId: number;
  selectedResource: number | null;
  onResourceSelect: (resourceId: number | null) => void;
  onResourceDataChange?: (resource: Resource | null) => void; // För att skicka resource data
  onAvailabilityChange: (availability: AvailabilityResponse | null) => void;
  isRental?: boolean; // För att filtrera bara rental-resurser
  servicePrice?: number; // För att visa pris per dag/vecka
  servicePriceUnit?: string; // 'day', 'week', 'month'
  startDate?: string | null; // För rentals: startdatum för att filtrera tillgängliga resurser
  endDate?: string | null; // För rentals: slutdatum för att filtrera tillgängliga resurser
  pickupTime?: string; // För rentals: upphämtningstid
  dropoffTime?: string; // För rentals: lämningstid
}

export default function Step2ResourceSelection({
  externalId,
  serviceId,
  selectedResource,
  onResourceSelect,
  onResourceDataChange,
  onAvailabilityChange,
  isRental = false,
  servicePrice,
  servicePriceUnit,
  startDate,
  endDate,
  pickupTime = '09:00',
  dropoffTime = '17:00'
}: Step2ResourceSelectionProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [availableResourceIds, setAvailableResourceIds] = useState<number[]>([]);
  const [loadingAvailableResources, setLoadingAvailableResources] = useState<boolean>(false);

  // För rentals: Hämta tillgängliga resurser baserat på valda datum/tider
  // OBS: För rentals visas alla resurser först (datum väljs senare), så vi behöver inte filtrera här
  useEffect(() => {
      // För rentals: visa alla resurser för kategorin (datum väljs senare)
      if (!isRental) {
        setAvailableResourceIds([]);
        return;
      }
      // För rentals: om datum är valda, kan vi filtrera, annars visa alla
      if (!startDate || !endDate) {
        setAvailableResourceIds([]); // Visa alla resurser (tom array = inga begränsningar)
        return;
      }

    // Debounce: vänta 500ms efter senaste ändringen innan vi gör API-anrop
    const timeoutId = setTimeout(async () => {
      try {
        setLoadingAvailableResources(true);
        // För rentals: använd standardtider (00:00:00 till 23:59:59) om inga specifika tider är satta
        // Detta eftersom rentals kan spänna över flera dagar och tiderna är valfria
        const startDateTime = `${startDate}T00:00:00`;
        const endDateTime = `${endDate}T23:59:59`;

        const response = await apiClient.get(
          `/labs/bookings/public/rental/availability?external_id=${externalId}&service_id=${serviceId}&start_datetime=${startDateTime}&end_datetime=${endDateTime}`
        );

        if (response.data?.success) {
          // Backend returnerar 'resources', inte 'available_resources'
          const availableResources = response.data.resources || response.data.available_resources || [];
          const availableIds = availableResources.map((r: Resource) => r.id);
          setAvailableResourceIds(availableIds);
          console.log('[Step2ResourceSelection] Available resource IDs:', availableIds, 'from', availableResources.length, 'resources');
        } else {
          console.log('[Step2ResourceSelection] No available resources in response:', response.data);
          setAvailableResourceIds([]);
        }
      } catch (error: any) {
        // Ignorera 429-fel (rate limiting) - användaren får se att det laddar
        if (error.response?.status === 429) {
          console.warn('[Step2ResourceSelection] Rate limited, will retry on next change');
          return;
        }
        console.error('[Step2ResourceSelection] Error fetching available resources:', error);
        setAvailableResourceIds([]);
      } finally {
        setLoadingAvailableResources(false);
      }
    }, 500); // 500ms debounce

    // Cleanup: avbryt timeout om dependencies ändras innan timeout är klar
    return () => clearTimeout(timeoutId);
  }, [isRental, startDate, endDate, externalId, serviceId]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoadingResources(true);
        const response = await apiClient.get(
          `/labs/bookings/public/resources?external_id=${externalId}&service_id=${serviceId}`
        );
        
        if (response.data.success) {
          let fetchedResources = response.data.resources || [];
          
          // För rentals: filtrera bara resurser där is_rental_item = true OCH har pris satt
          if (isRental) {
            fetchedResources = fetchedResources.filter((r: Resource) => {
              const hasPrice = (r as any).price !== undefined && (r as any).price !== null && (r as any).price > 0;
              const hasPriceUnit = (r as any).price_unit !== undefined && (r as any).price_unit !== null && (r as any).price_unit !== '';
              return r.is_rental_item === true && hasPrice && hasPriceUnit;
            });
          }
          
          setResources(fetchedResources);
        }
      } catch (err: any) {
        console.error('Error fetching resources:', err);
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, [externalId, serviceId, isRental]);

  // För rentals: Visa alla resurser för kategorin (datum väljs senare)
  // MÅSTE vara före alla early returns för att följa React's Rules of Hooks
  const displayResources = useMemo(() => {
    // För rentals: visa alla resurser för kategorin (datum väljs senare i nästa steg)
    // Tillgänglighet kontrolleras i datum/tid-steget istället
    return resources;
  }, [resources]);

  const handleResourceSelect = (resourceId: number) => {
    const newResourceId = selectedResource === resourceId ? null : resourceId;
    onResourceSelect(newResourceId);
    // Clear availability when resource changes
    onAvailabilityChange(null);
  };
  
  // Expose selected resource data via callback
  useEffect(() => {
    if (selectedResource && displayResources.length > 0) {
      const resource = displayResources.find((r: Resource) => r.id === selectedResource);
      onResourceDataChange?.(resource || null);
    } else {
      onResourceDataChange?.(null);
    }
  }, [selectedResource, displayResources, onResourceDataChange]);


  // Beräkna totalpris för rentals baserat på 24-timmarsperioder från upphämtningstidpunkten
  // MÅSTE vara före alla early returns för att följa React's Rules of Hooks
  const calculateTotalPrice = (resource: Resource) => {
    if (!isRental || !startDate || !endDate || !resource.price || resource.price <= 0) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Kontrollera att datum är giltiga
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    // Kombinera datum med tid för att få exakt start- och sluttidpunkt
    // Använd pickupTime/dropoffTime för att matcha Step4ContactInformation
    const [startHour, startMin] = (pickupTime || '09:00').split(':').map(Number);
    const [endHour, endMin] = (dropoffTime || '17:00').split(':').map(Number);
    
    const startDateTime = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      startHour || 0,
      startMin || 0
    );
    
    const endDateTime = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      endHour || 0,
      endMin || 0
    );
    
    // Räkna skillnaden i millisekunder
    const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
    
      // Räkna antal timmar
      const diffHours = diffTime / (1000 * 60 * 60);
      
      // Räkna antal påbörjade 24-timmarsperioder
      // Om diffHours är exakt 0, returnera 0 (ingen skillnad)
      // Annars: om diffHours <= 24, returnera 1 dygn
      // Om diffHours > 24, avrunda uppåt till antal dygn
      let rentalDays: number;
      if (diffHours === 0) {
        rentalDays = 0;
      } else if (diffHours <= 24) {
        rentalDays = 1; // Mindre än eller exakt 24 timmar = 1 dygn
      } else {
        rentalDays = Math.ceil(diffHours / 24); // Mer än 24 timmar, avrunda uppåt
      }
    
    if (rentalDays <= 0) return null;
    
    // Kontrollera att price_unit faktiskt finns
    const priceUnit = resource.price_unit && String(resource.price_unit).trim() !== '' ? String(resource.price_unit).trim() : null;
    if (!priceUnit) return null;
    
    if (priceUnit === 'day') {
      return rentalDays * resource.price;
    } else if (priceUnit === 'week') {
      const weeks = Math.ceil(rentalDays / 7);
      return weeks * resource.price;
    } else if (priceUnit === 'month') {
      const months = Math.ceil(rentalDays / 30);
      return months * resource.price;
    } else if (priceUnit === 'hour') {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return diffHours * resource.price;
    }
    // Om price_unit är något annat, returnera null (inte fast pris)
    return null;
  };

  if (loadingResources) {
    return (
      <VStack spacing="sm" align="center">
        <Spinner size="md" />
        <Body size="sm" color="secondary">Laddar resurser...</Body>
      </VStack>
    );
  }

  if (displayResources.length === 0) {
    return (
      <WarningAlert
        title="Inga tillgängliga resurser för denna kategori"
      >
        Det finns för närvarande inga tillgängliga resurser för denna kategori. Kontakta oss direkt för att boka.
      </WarningAlert>
    );
  }

  return (
    <VStack spacing="md">
      {!isRental && (
        <Body size="sm" color="secondary">
          Välj resurs. Klicka på en resurs för att markera den.
        </Body>
      )}
      <HStack spacing="md" wrap align="stretch">
        {displayResources.map((resource) => {
          const isSelected = selectedResource === resource.id;
          return (
            <Card
              key={resource.id}
              variant={isSelected ? 'elevated' : 'outlined'}
              radius="md"
              interactive
              selected={isSelected}
              onClick={() => handleResourceSelect(resource.id)}
              style={{
                flex: '1 1 200px',
                minWidth: '180px',
                maxWidth: '280px'
              }}
            >
              {resource.image_url ? (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    borderTopLeftRadius: 'var(--radius-md)',
                    borderTopRightRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={resource.image_url}
                    alt={resource.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ) : null}
              <CardContent>
                <VStack spacing="xs" align="start">
                  <HStack spacing="sm" align="center">
                    {!resource.image_url && (
                      <Icon size="md" color={isSelected ? 'accent' : 'primary'}>
                        <UserIcon />
                      </Icon>
                    )}
                    <Body weight="semibold" color={isSelected ? 'accent' : 'primary'}>
                      {resource.name}
                    </Body>
                  </HStack>
                  {resource.description && (
                    <Body size="sm" color="secondary" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {resource.description}
                    </Body>
                  )}
                  {isRental && (
                    <VStack spacing="sm" align="start" style={{ width: '100%', marginTop: 'var(--foundation-space-xs)' }}>
                      {/* Pris per enhet - från resursen */}
                      {resource.price !== undefined && resource.price !== null && resource.price > 0 && resource.price_unit && String(resource.price_unit).trim() !== '' && (
                        <Body size="sm" color="secondary">
                          {resource.price} kr/{resource.price_unit === 'day' ? 'dag' : resource.price_unit === 'week' ? 'vecka' : resource.price_unit === 'month' ? 'månad' : resource.price_unit === 'hour' ? 'timme' : resource.price_unit}
                        </Body>
                      )}
                      
                      {/* Totalpris baserat på datum */}
                      {startDate && endDate && resource.price && resource.price > 0 && (() => {
                        const totalPrice = calculateTotalPrice(resource);
                        if (totalPrice !== null && totalPrice > 0) {
                          // Använd samma logik som calculateTotalPrice för att beräkna antal dagar
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          
                          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                            return null;
                          }
                          
                          // Kombinera datum med tid för att få exakt start- och sluttidpunkt
                          // Använd pickupTime/dropoffTime för att matcha Step4ContactInformation
                          const [startHour, startMin] = (pickupTime || '09:00').split(':').map(Number);
                          const [endHour, endMin] = (dropoffTime || '17:00').split(':').map(Number);
                          
                          const startDateTime = new Date(
                            start.getFullYear(),
                            start.getMonth(),
                            start.getDate(),
                            startHour || 0,
                            startMin || 0
                          );
                          
                          const endDateTime = new Date(
                            end.getFullYear(),
                            end.getMonth(),
                            end.getDate(),
                            endHour || 0,
                            endMin || 0
                          );
                          
                          // Räkna skillnaden i millisekunder
                          const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
                          
                          // Räkna antal timmar
                          const diffHours = diffTime / (1000 * 60 * 60);
                          
                          // Räkna antal påbörjade 24-timmarsperioder
                          // Om diffHours är exakt 0, returnera 0 (ingen skillnad)
                          // Annars: om diffHours <= 24, returnera 1 dygn
                          // Om diffHours > 24, avrunda uppåt till antal dygn
                          let rentalDays: number;
                          if (diffHours === 0) {
                            rentalDays = 0;
                          } else if (diffHours <= 24) {
                            rentalDays = 1; // Mindre än eller exakt 24 timmar = 1 dygn
                          } else {
                            rentalDays = Math.ceil(diffHours / 24); // Mer än 24 timmar, avrunda uppåt
                          }
                          
                          // Bara visa durationText om price_unit faktiskt finns
                          const priceUnit = resource.price_unit && String(resource.price_unit).trim() !== '' ? String(resource.price_unit).trim() : null;
                          let durationText = '';
                          if (priceUnit) {
                            if (priceUnit === 'day') {
                              durationText = `${rentalDays} ${rentalDays === 1 ? 'dag' : 'dagar'}`;
                            } else if (priceUnit === 'week') {
                              const weeks = Math.ceil(rentalDays / 7);
                              durationText = `${weeks} ${weeks === 1 ? 'vecka' : 'veckor'}`;
                            } else if (priceUnit === 'month') {
                              const months = Math.ceil(rentalDays / 30);
                              durationText = `${months} ${months === 1 ? 'månad' : 'månader'}`;
                            } else if (priceUnit === 'hour') {
                              const diffHoursRounded = Math.ceil(diffHours);
                              durationText = `${diffHoursRounded} ${diffHoursRounded === 1 ? 'timme' : 'timmar'}`;
                            }
                          }
                          return (
                            <Body weight="bold" size="md" color="primary">
                              Totalt: {totalPrice} kr{durationText ? ` (${durationText})` : ''}
                            </Body>
                          );
                        }
                        return null;
                      })()}
                      
                      {/* Kapacitet */}
                      {resource.capacity !== undefined && resource.capacity !== null && resource.capacity > 0 && (
                        <Body size="xs" color="secondary">
                          {resource.capacity} {resource.capacity === 1 ? 'enhet tillgänglig' : 'enheter tillgängliga'}
                        </Body>
                      )}
                    </VStack>
                  )}
                </VStack>
              </CardContent>
            </Card>
          );
        })}
      </HStack>
    </VStack>
  );
}
