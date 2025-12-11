/**
 * Public Booking Page - Refactored with Wizard
 * 
 * Route: /bookings/booking/[userId]
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  H2,
  Body,
  Button
} from '@blimpify-im/ui';
import { apiClient } from '../../../../lib/api/client';
import BookingWizard from './components/BookingWizard';
import type { Service, BookingFormData } from './types';

interface PublicBookingPageProps {
  externalId?: string;
  userId?: number; // Deprecated: for backward compatibility
  params?: Promise<{ userId: string }>; // Optional for backward compatibility
}

export default function PublicBookingPage({ externalId, userId: propUserId, params }: PublicBookingPageProps) {
  // ✅ ALL HOOKS MUST BE DECLARED FIRST (before any conditional returns)
  const [userId, setUserId] = useState<number | null>(null);
  const [fetchingUserId, setFetchingUserId] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [resourceTypes, setResourceTypes] = useState<Service[]>([]); // Categories för rentals
  const [businessType, setBusinessType] = useState<'services' | 'rentals' | 'both'>('services');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);
  
  // Fetch userId from external_id if needed
  useEffect(() => {
    if (externalId && !userId) {
      setFetchingUserId(true);
      // Extract userId from API - we need to add this endpoint or use existing user lookup
      // For now, we'll use the booking endpoint which includes user_id in response
      apiClient.get(`/labs/bookings/public/services?external_id=${externalId}`)
        .then(response => {
          if (response.data.success && response.data.user_id) {
            setUserId(response.data.user_id);
          }
        })
        .catch(err => console.error('Error fetching user_id:', err))
        .finally(() => setFetchingUserId(false));
    } else if (propUserId) {
      setUserId(propUserId);
    } else if (params) {
      const { use } = React;
      const resolvedParams = use(params);
      setUserId(parseInt(resolvedParams.userId));
    }
  }, [externalId, propUserId, params, userId]);

  // Helper function för användarvänliga felmeddelanden
  const getErrorMessage = (error: any, defaultMessage: string): string => {
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
      return 'Ingen internetanslutning. Kontrollera din anslutning och försök igen.';
    }
    
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return 'Förfrågan tog för lång tid. Försök igen om en stund.';
    }
    
    if (error?.response?.status === 429) {
      return 'För många förfrågningar. Vänta en stund och försök igen.';
    }
    
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const errors = error.response.data.errors;
      if (errors.length === 1) {
        return errors[0];
      }
      return `Följande fel hittades: ${errors.join(', ')}`;
    }
    
    if (error?.response?.data?.message) {
      const message = error.response.data.message;
      
      if (message.includes('Det finns redan en bokning')) {
        return 'Denna tid är redan bokad. Välj en annan tid.';
      }
      if (message.includes('inte ledig') || message.includes('inte tillgänglig')) {
        return 'Den valda tiden är inte längre tillgänglig. Välj en annan tid.';
      }
      if (message.includes('förflutna')) {
        return 'Du kan inte boka en tid som redan har passerat. Välj en framtida tid.';
      }
      if (message.includes('resurs')) {
        return 'Resursen är inte tillgänglig. Välj en annan resurs eller tid.';
      }
      if (message.includes('Max antal bokningar')) {
        return 'Max antal bokningar för denna dag är uppnått. Välj ett annat datum.';
      }
      
      return message;
    }
    
    return defaultMessage;
  };

  // Hämta services och resource_types (kategorier) - MÅSTE VARA PÅ TOP LEVEL
  useEffect(() => {
    const fetchServices = async () => {
      // Skip if no userId yet
      if (!userId || isNaN(userId)) {
        if (userId === null && !externalId && !propUserId && !params) {
          setError('Vi kunde inte hitta bokningssystemet. Kontrollera länken eller kontakta oss så hjälper vi dig.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/labs/bookings/public/services?user_id=${userId}`);
        if (response.data.success) {
          const servicesData = response.data.services || [];
          const resourceTypesData = response.data.resource_types || [];
          const businessTypeData = response.data.business_type || 'services';
          
          console.log('[BOOKINGS] All services data:', servicesData.map((s: Service) => ({
            id: s.id,
            name: s.name,
            booking_type: s.booking_type,
            image_url: s.image_url,
            hasImage: !!s.image_url
          })));
          console.log('[BOOKINGS] All resource_types data:', resourceTypesData.map((rt: any) => ({
            id: rt.id,
            name: rt.name,
            booking_type: rt.booking_type,
            image_url: rt.image_url,
            hasImage: !!rt.image_url
          })));
          console.log('[BOOKINGS] Business type:', businessTypeData);
          
          // Markera booking_type för services (om inte redan satt)
          const servicesWithType = servicesData.map((s: Service) => ({
            ...s,
            booking_type: s.booking_type || 'appointment'
          }));
          
          // Konvertera resource_types till Service-format med booking_type
          const resourceTypesAsServices: Service[] = resourceTypesData.map((rt: any) => ({
            id: rt.id,
            name: rt.name,
            description: rt.description,
            duration_minutes: 0, // Kategorier har ingen duration
            price: undefined, // Pris sätts på resursnivå
            price_unit: rt.price_unit || 'day', // Standard för kategorier
            currency: 'sek',
            active: rt.active !== false,
            requires_resource: true, // Kategorier kräver alltid resurs
            can_book: rt.can_book,
            image_url: rt.image_url,
            cancellation_rules: rt.cancellation_rules,
            service_rules: rt.service_rules,
            min_advance_booking_hours: rt.min_advance_booking_hours,
            booking_type: 'rental' as const
          }));
          
          console.log('[BOOKINGS] ===== AFTER PROCESSING =====');
          console.log('[BOOKINGS] Services (with type):', servicesWithType.map((s: Service) => ({
            id: s.id,
            name: s.name,
            booking_type: s.booking_type
          })));
          console.log('[BOOKINGS] ResourceTypes (categories):', resourceTypesAsServices.map(rt => ({
            id: rt.id,
            name: rt.name,
            booking_type: rt.booking_type
          })));
          
          setServices(servicesWithType);
          setResourceTypes(resourceTypesAsServices);
          setBusinessType(businessTypeData);
          setError(null);
        } else {
          setServices([]);
          setResourceTypes([]);
          setError('Vi kunde inte hitta några tjänster just nu. Försök igen om en stund.');
        }
      } catch (err: any) {
        console.error('Error fetching services:', err);
        const status = err?.response?.status;
        if (status === 404) {
          setError('Vi kunde tyvärr inte hitta detta bokningssystem just nu. Kontakta företaget direkt så hjälper de dig.');
        } else {
          setError('Det gick inte att ladda tjänsterna just nu. Försök igen om en stund.');
        }
        setServices([]);
        setResourceTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [userId]); // Run whenever userId changes

  const handleImageError = (serviceId: number) => {
    setImageErrors(prev => new Set(prev).add(serviceId));
  };

  const handleSubmit = async (bookingData: BookingFormData) => {
    setError(null);
    setSuccess(false);

    try {
      setSubmitting(true);
      
      const payload: any = {
        user_id: userId,
        booking_type: bookingData.booking_type,
        service_id: bookingData.service_id,
        customer_name: bookingData.customer_name.trim(),
        customer_email: bookingData.customer_email.trim(),
        customer_phone: bookingData.customer_phone.trim() || undefined,
        notes: bookingData.notes.trim() || undefined
      };

      if (bookingData.booking_type === 'rental') {
        payload.start_datetime = bookingData.start_datetime;
        payload.end_datetime = bookingData.end_datetime;
        if (bookingData.resource_id) {
          payload.resource_id = bookingData.resource_id;
        }
      } else {
        payload.date = bookingData.date;
        payload.start_time = bookingData.start_time;
        payload.end_time = bookingData.end_time;
        if (bookingData.resource_id) {
          payload.resource_id = bookingData.resource_id;
        }
      }

      const response = await apiClient.post('/labs/bookings/public/appointments', payload);

      if (response.data.success) {
        setCreatedAppointment(response.data.appointment);
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Error creating booking:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMsg = getErrorMessage(err, 'Kunde inte skapa bokning. Kontrollera att alla fält är korrekt ifyllda och försök igen.');
      
      if (err?.response?.data?.message?.includes('timmar i förväg') || 
          err?.response?.data?.error?.includes('timmar i förväg') ||
          err?.message?.includes('timmar i förväg')) {
        errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || errorMsg;
      }
      
      setError(errorMsg);
      throw err; // Re-throw så att wizard kan hantera det
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Show loading while fetching userId (AFTER all hooks)
  if (externalId && fetchingUserId) {
    return (
      <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
        <Body>Laddar bokningssystem...</Body>
      </div>
    );
  }
  
  // ✅ Show error if no userId could be resolved (AFTER all hooks)
  if (!userId) {
    return (
      <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
        <Body>Kunde inte ladda bokningssystem.</Body>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: 'var(--foundation-space-xl) var(--foundation-space-md)' 
    }}>
      <VStack spacing="lg" align="stretch">
        <VStack spacing="sm" align="center">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.location.href = `/bookings/customer/${userId}`;
                }}
              >
                Mina bokningar
              </Button>
            </div>
          </div>
        </VStack>

        <BookingWizard
          userId={userId}
          services={services}
          resourceTypes={resourceTypes}
          businessType={businessType}
          loadingServices={loading}
          servicesError={error}
          imageErrors={imageErrors}
          onImageError={handleImageError}
          onSubmit={handleSubmit}
          createdAppointment={createdAppointment}
          success={success}
          submitting={submitting}
          error={error}
        />
      </VStack>
    </div>
  );
}

