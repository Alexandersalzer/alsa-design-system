/**
 * Public Booking Page - Temporär lösning för testning
 * 
 * Route: /bookings/booking/[userId]
 * 
 * TODO: Ersätt med slug/identifierare när CRM är klart
 */
'use client';

import React, { useState, useEffect, use } from 'react';
import {
  Container,
  VStack,
  HStack,
  Card,
  CardContent,
  CardHeader,
  H2,
  H3,
  Body,
  Button,
  Input,
  Textarea,
  Spinner,
  Skeleton,
  WarningAlert,
  ErrorAlert,
  SuccessAlert,
  Icon,
  Label,
  Calendar
} from '@blimpify-im/ui';
import { CalendarIcon, ClockIcon, UserIcon, EnvelopeIcon, PhoneIcon, CheckIcon, XMarkIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon, PhotoIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import apiClient from '@/lib/api/client';

interface Service {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  currency?: string;
  active: boolean;
  requires_resource: boolean;
  can_book?: boolean;
  image_url?: string;
  cancellation_rules?: string;
  service_rules?: string;
  min_advance_booking_hours?: number; // Minsta tid i timmar innan bokning (t.ex. 6 timmar)
}

interface AvailabilityInterval {
  slot_id: number | null;
  start_time: string;
  end_time: string;
  available?: boolean;
  booked?: boolean;
  past?: boolean;
  bookedCount?: number;
  availableSpots?: number | null;
  capacityPerSlot?: number | null;
}

interface AvailabilityResponse {
  date: string;
  timezone: string;
  increment_minutes: number;
  remaining_capacity: number;
  slot_source: string;
  service: Service;
  intervals: AvailabilityInterval[];
}

interface Resource {
  id: number;
  name: string;
  description?: string;
  color?: string;
  image_url?: string;
}

export default function PublicBookingPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const userId = parseInt(resolvedParams.userId);
  const [services, setServices] = useState<Service[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Helper function för användarvänliga felmeddelanden
  const getErrorMessage = (error: any, defaultMessage: string): string => {
    // Om det är ett nätverksfel
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
      return 'Ingen internetanslutning. Kontrollera din anslutning och försök igen.';
    }
    
    // Om det är en timeout
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return 'Förfrågan tog för lång tid. Försök igen om en stund.';
    }
    
    // Om det är rate limiting
    if (error?.response?.status === 429) {
      return 'För många förfrågningar. Vänta en stund och försök igen.';
    }
    
    // Om det är valideringsfel från backend
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const errors = error.response.data.errors;
      if (errors.length === 1) {
        return errors[0];
      }
      return `Följande fel hittades: ${errors.join(', ')}`;
    }
    
    // Om backend skickar ett användarvänligt meddelande
    if (error?.response?.data?.message) {
      const message = error.response.data.message;
      
      // Förbättra vanliga felmeddelanden
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
    
    // Fallback till default-meddelande
    return defaultMessage;
  };

  // Helper function för säker datumformatering
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    
    // Om det är en ISO-sträng eller YYYY-MM-DD, parsar vi den
    let date: Date;
    if (typeof dateString === 'string' && dateString.includes('T')) {
      // ISO format: 2025-11-27T14:30:00
      date = new Date(dateString);
    } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // YYYY-MM-DD format
      date = new Date(dateString + 'T00:00:00');
    } else {
      // Försök parsar som vanligt
      date = new Date(dateString);
    }
    
    // Kontrollera om datumet är giltigt
    if (isNaN(date.getTime())) {
      console.warn('[BOOKING] Invalid date format:', dateString);
      return dateString; // Returnera originalsträngen om parsing misslyckas
    }
    
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ start_time: string; end_time: string } | null>(null);
  // För uthyrningar (datum-intervall)
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [rentalAvailability, setRentalAvailability] = useState<{
    available: boolean;
    message: string;
    available_count?: number;
  } | null>(null);
  const [checkingRentalAvailability, setCheckingRentalAvailability] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: ''
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const copyBookingNumber = async () => {
    if (!createdAppointment?.booking_number) return;
    
    try {
      await navigator.clipboard.writeText(createdAppointment.booking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const handleResourceSelect = (resourceId: number) => {
    setSelectedResource((prev) => (prev === resourceId ? null : resourceId));
  };

  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Hämta services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/labs/bookings/public/services?user_id=${userId}`);
        if (response.data.success) {
          const servicesData = response.data.services;
          // Debug: logga alla services för att se om image_url finns
          console.log('[BOOKINGS] All services data:', servicesData.map((s: Service) => ({
            id: s.id,
            name: s.name,
            image_url: s.image_url,
            hasImage: !!s.image_url
          })));
          setServices(servicesData);
          setError(null);
        } else {
          setServices([]);
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
      } finally {
        setLoading(false);
      }
    };

    if (userId && !isNaN(userId)) {
      fetchServices();
    } else {
      setError('Vi kunde inte hitta bokningssystemet. Kontrollera länken eller kontakta oss så hjälper vi dig.');
      setLoading(false);
    }
  }, [userId]);

  // Hämta resurser när en service som kräver resurs väljs
  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedService) {
        setResources([]);
        setSelectedResource(null);
        return;
      }

      const service = services.find(s => s.id === selectedService);
      if (!service || !service.requires_resource) {
        setResources([]);
        setSelectedResource(null);
        return;
      }

      try {
        setLoadingResources(true);
        const response = await apiClient.get(
          `/labs/bookings/public/resources?user_id=${userId}&service_id=${selectedService}`
        );
        
        if (response.data.success) {
          setResources(response.data.resources || []);
          setSelectedResource(null); // Reset selected resource
        }
      } catch (err: any) {
        console.error('Error fetching resources:', err);
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, [selectedService, userId, services]);

  // Hämta tillgängliga tider när service och datum är valt (endast för appointments, inte rentals)
  useEffect(() => {
    // Hoppa över om bokning redan är klar
    if (success && createdAppointment) {
      return;
    }

    const fetchAvailability = async () => {
      // För uthyrningar, hoppa över availability check (använder datum-intervall istället)
      const serviceData = services.find(s => s.id === selectedService);
      const isRentalService = serviceData ? serviceData.duration_minutes >= 1440 : false;
      if (isRentalService) {
        setAvailability(null);
        return;
      }
      
      if (!selectedService || !selectedDate) {
        setAvailability(null);
        return;
      }

      try {
        setLoadingAvailability(true);
        setError(null);
        // Om tjänsten kräver resurs, skicka resource_id
        const serviceData = services.find(s => s.id === selectedService);
        const resourceParam = serviceData?.requires_resource && selectedResource 
          ? `&resource_id=${selectedResource}` 
          : '';
        
        const response = await apiClient.get(
          `/labs/bookings/public/availability/v2?user_id=${userId}&service_id=${selectedService}&date=${selectedDate}${resourceParam}`
        );
        
        if (response.data.success) {
          const intervals = response.data.intervals || [];
          const matchingSlot =
            selectedTime &&
            intervals.find(
              (interval: AvailabilityInterval) =>
                interval.start_time === selectedTime.start_time &&
                interval.end_time === selectedTime.end_time
            );

          setAvailability({
            ...response.data,
            intervals
          });

          setSelectedTime(matchingSlot || null);
        }
      } catch (err: any) {
        const errorMsg = getErrorMessage(err, 'Kunde inte ladda tillgängliga tider. Försök välja ett annat datum eller kontakta oss direkt.');
        setError(errorMsg);
        console.error('Error fetching availability:', err);
        setAvailability(null);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedService, selectedDate, selectedResource, userId, services, success, createdAppointment]);

  // För uthyrningar: kolla resurstillgänglighet när datum-intervall ändras
  useEffect(() => {
    const checkRentalAvailability = async () => {
      const serviceData = services.find(s => s.id === selectedService);
      const isRental = serviceData ? serviceData.duration_minutes >= 1440 : false;
      
      if (!isRental || !selectedService || !startDate || !endDate) {
        setRentalAvailability(null);
        return;
      }

      // Om service kräver resurs men ingen är vald, vänta
      if (serviceData?.requires_resource && !selectedResource) {
        setRentalAvailability(null);
        return;
      }

      try {
        setCheckingRentalAvailability(true);
        setError(null);
        
        const startDateTime = `${startDate}T${startTime}:00`;
        const endDateTime = `${endDate}T${endTime}:00`;
        
        const resourceParam = selectedResource ? `&resource_id=${selectedResource}` : '';
        const response = await apiClient.get(
          `/labs/bookings/public/rental/availability?user_id=${userId}&service_id=${selectedService}&start_datetime=${startDateTime}&end_datetime=${endDateTime}${resourceParam}`
        );

        if (response.data.success) {
          setRentalAvailability({
            available: response.data.available,
            message: response.data.message,
            available_count: response.data.available_count
          });
        }
      } catch (err: any) {
        const errorMsg = getErrorMessage(err, 'Kunde inte kontrollera resurstillgänglighet. Försök igen eller kontakta oss direkt.');
        setError(errorMsg);
        console.error('Error checking rental availability:', err);
        setRentalAvailability(null);
      } finally {
        setCheckingRentalAvailability(false);
      }
    };

    checkRentalAvailability();
  }, [selectedService, startDate, endDate, startTime, endTime, selectedResource, userId, services]);

  // Sätt dagens datum som default
  useEffect(() => {
    const service = services.find(s => s.id === selectedService);
    const isRentalService = service ? service.duration_minutes >= 1440 : false;
    
    if (!selectedDate && !isRentalService && selectedService) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    }
    if (!startDate && isRentalService && selectedService) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
      setEndDate(`${year}-${month}-${day}`);
    }
  }, [selectedDate, startDate, selectedService, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedService) {
      setError('Välj en tjänst');
      return;
    }

    // Validera email format
    if (!formData.customer_email.trim() || !emailRegex.test(formData.customer_email.trim())) {
      setEmailError('Ange en giltig e-postadress');
      setError('Kontrollera att e-postadressen är korrekt');
      return;
    }
    
    if (!formData.customer_name.trim()) {
      setError('Fyll i namn');
      return;
    }
    
    setEmailError(null);

    // Kontrollera om resurs krävs
    const service = services.find(s => s.id === selectedService);
    if (service?.requires_resource && !selectedResource) {
      setError('Välj en resurs');
      return;
    }

    // För uthyrningar: använd datum-intervall
    const rentalService = services.find(s => s.id === selectedService);
    const isRentalService = rentalService ? rentalService.duration_minutes >= 1440 : false;
    if (isRentalService) {
      if (!startDate || !endDate) {
        setError('Välj start- och slutdatum');
        return;
      }

      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;

      if (new Date(endDateTime) <= new Date(startDateTime)) {
        setError('Slutdatum måste vara efter startdatum');
        return;
      }

      try {
        setSubmitting(true);
        const response = await apiClient.post('/labs/bookings/public/appointments', {
          user_id: userId,
          booking_type: 'rental',
          service_id: selectedService,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          resource_id: selectedResource || undefined,
          customer_name: formData.customer_name.trim(),
          customer_email: formData.customer_email.trim(),
          customer_phone: formData.customer_phone.trim() || undefined,
          notes: formData.notes.trim() || undefined
        });

        if (response.data.success) {
          setSuccess(true);
          // Reset form
          setFormData({
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            notes: ''
          });
          setStartDate('');
          setEndDate('');
        }
      } catch (err: any) {
        console.error('Error creating rental:', err);
        const errorMsg = getErrorMessage(err, 'Kunde inte skapa bokning. Kontrollera att alla fält är korrekt ifyllda och försök igen.');
        setError(errorMsg);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // För appointments: använd tidsluckor
    if (!selectedDate || !selectedTime) {
      setError('Välj datum och tid');
      return;
    }

    // Kontrollera att tiden är tillgänglig
    const selectedInterval = availability?.intervals.find(
      interval => interval.start_time === selectedTime.start_time && interval.end_time === selectedTime.end_time
    );

    if (!selectedInterval) {
      setError('Välj en giltig tid');
      return;
    }

    if (!selectedInterval.available || selectedInterval.booked || selectedInterval.past) {
      setError('Den valda tiden är inte tillgänglig');
      return;
    }
    
    // Validera email format
    if (!formData.customer_email.trim() || !emailRegex.test(formData.customer_email.trim())) {
      setEmailError('Ange en giltig e-postadress');
      setError('Kontrollera att e-postadressen är korrekt');
      return;
    }
    
    if (!formData.customer_name.trim()) {
      setError('Fyll i namn');
      return;
    }
    
    setEmailError(null);

    try {
      setSubmitting(true);
      const response = await apiClient.post('/labs/bookings/public/appointments', {
        user_id: userId,
        booking_type: 'appointment',
        service_id: selectedService,
        date: selectedDate,
        start_time: selectedTime.start_time,
        end_time: selectedTime.end_time,
        resource_id: selectedResource || undefined,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim() || undefined,
        notes: formData.notes.trim() || undefined
      });

      if (response.data.success) {
        setCreatedAppointment(response.data.appointment);
        setSuccess(true);
        // Reset form
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          notes: ''
        });
        setSelectedTime(null);
        // Refresh availability
        try {
          const refreshResponse = await apiClient.get(
            `/labs/bookings/public/availability/v2?user_id=${userId}&service_id=${selectedService}&date=${selectedDate}`
          );
          if (refreshResponse.data.success) {
            setAvailability(refreshResponse.data);
          }
        } catch (refreshErr: any) {
          // Ignorera refresh-fel, bokningen är redan skapad
          console.error('Error refreshing availability after booking:', refreshErr);
        }
      }
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      console.error('Error response:', err.response?.data);
      
      // Särskilt hantera min_advance_booking_hours fel
      let errorMsg = getErrorMessage(err, 'Kunde inte skapa bokning. Kontrollera att alla fält är korrekt ifyllda och försök igen.');
      
      if (err?.response?.data?.message?.includes('timmar i förväg') || 
          err?.response?.data?.error?.includes('timmar i förväg') ||
          err?.message?.includes('timmar i förväg')) {
        errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || errorMsg;
      }
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  
  // Detektera om detta är en uthyrning (baserat på varaktighet >= 1 dag eller business logic)
  // För nu, anta att om duration >= 1440 minuter (1 dag) så är det en uthyrning
  const isRental = selectedServiceData ? selectedServiceData.duration_minutes >= 1440 : false;
  
  // Memoize isRental för att undvika re-renders
  const memoizedIsRental = React.useMemo(() => {
    return selectedServiceData ? selectedServiceData.duration_minutes >= 1440 : false;
  }, [selectedServiceData]);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: 'var(--foundation-space-xl) var(--foundation-space-md)' 
    }}>
      <VStack spacing="xl" align="stretch">
        <VStack spacing="sm" align="center">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <VStack spacing="sm" align="center">
                <H2>Boka tid</H2>
                <Body color="secondary" align="center">
                  Välj tjänst, datum och tid för din bokning
                </Body>
              </VStack>
            </div>
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

        {error && (
          <WarningAlert>
            {error}
          </WarningAlert>
        )}

        {success && createdAppointment && (
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

                {createdAppointment.booking_number && (
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
                          {createdAppointment.booking_number}
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
                        <Body>
                          {createdAppointment.service_name || selectedServiceData?.name}
                          {selectedServiceData?.duration_minutes && ` (${selectedServiceData.duration_minutes} min)`}
                          {selectedServiceData?.price && ` - ${selectedServiceData.price} kr`}
                        </Body>
                      </HStack>

                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>Datum:</Label>
                        <Body>
                          {createdAppointment.date
                            ? formatDate(createdAppointment.date)
                            : formatDate(selectedDate)}
                        </Body>
                      </HStack>

                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>Tid:</Label>
                        <Body>
                          {createdAppointment.start_time?.substring(0, 5) || createdAppointment.start_time} - {createdAppointment.end_time?.substring(0, 5) || createdAppointment.end_time}
                        </Body>
                      </HStack>

                      {createdAppointment.resource_name && (
                        <HStack spacing="sm" align="start">
                          <Label size="sm" style={{ minWidth: '120px' }}>Resurs:</Label>
                          <Body>{createdAppointment.resource_name}</Body>
                        </HStack>
                      )}

                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>Kund:</Label>
                        <Body>{createdAppointment.customer_name}</Body>
                      </HStack>
                      <HStack spacing="sm" align="start">
                        <Label size="sm" style={{ minWidth: '120px' }}>E-post:</Label>
                        <Body>{createdAppointment.customer_email}</Body>
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
        )}

        {loading ? (
          <Card>
            <CardContent>
              <VStack spacing="md">
                <Skeleton height="40px" />
                <Skeleton height="200px" />
              </VStack>
            </CardContent>
          </Card>
        ) : (!success || !createdAppointment) ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing="lg">
              {error && (
                <ErrorAlert title="Just nu kan vi inte visa bokning">
                  {error}
                </ErrorAlert>
              )}

              {/* Välj tjänst */}
              <Card>
                <CardHeader>
                  <H3>1. Välj tjänst</H3>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <Body size="sm" color="secondary" align="center">
                      Inga tjänster tillgängliga just nu.
                    </Body>
                  ) : (
                    <VStack spacing="md">
                      <HStack spacing="sm" wrap align="stretch">
                        {services.map((service) => {
                          const isSelected = selectedService === service.id;
                          const isDisabled = !service.can_book;
                          const hasImageError = imageErrors.has(service.id);
                          return (
                            <Card
                              key={service.id}
                              variant={isSelected ? 'elevated' : 'outlined'}
                              radius="md"
                              interactive={!isDisabled}
                              selected={isSelected}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedService(service.id);
                      setSelectedTime(null);
                      setSelectedResource(null);
                      setAvailability(null);
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
                              <div style={{ 
                                width: '100%', 
                                aspectRatio: '1 / 1', // Kvadratisk
                                overflow: 'hidden',
                                borderTopLeftRadius: 'var(--radius-md)',
                                borderTopRightRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--surface-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
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
                                      setImageErrors(prev => new Set(prev).add(service.id));
                                    }}
                                    onLoad={() => {
                                      console.log('[BOOKINGS] ✅ Image loaded successfully:', {
                                        url: service.image_url,
                                        serviceId: service.id,
                                        serviceName: service.name
                                      });
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
                                  <HStack spacing="sm" wrap>
                                    {service.duration_minutes && (
                                      <Body size="sm" color="secondary">
                                        <ClockIcon style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                        {service.duration_minutes} min
                                      </Body>
                                    )}
                                    {service.price && (
                                      <Body size="sm" color="secondary">
                                        {service.price} kr
                                      </Body>
                                    )}
                                  </HStack>
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
                        })}
                      </HStack>
                      {selectedService && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedService(null);
                            setSelectedTime(null);
                            setSelectedResource(null);
                            setAvailability(null);
                          }}
                        >
                          Avmarkera tjänst
                        </Button>
                      )}
                    </VStack>
                  )}
                </CardContent>
              </Card>

              {/* För uthyrningar: Välj datum-intervall */}
              {selectedService && memoizedIsRental && (
                <>
                  <Card>
                    <CardHeader>
                      <H3>{selectedServiceData?.requires_resource ? '3. Välj startdatum' : '2. Välj startdatum'}</H3>
                    </CardHeader>
                    <CardContent>
                      <VStack spacing="sm">
                        <div>
                          <Label>Startdatum</Label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              // Sätt endDate till samma datum om den inte är satt
                              if (!endDate) {
                                setEndDate(e.target.value);
                              }
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            style={{
                              width: '100%',
                              padding: 'var(--foundation-space-sm)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-body-size-md)',
                              marginTop: 'var(--foundation-space-xs)'
                            }}
                          />
                        </div>
                        <div>
                          <Label>Starttid</Label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: 'var(--foundation-space-sm)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-body-size-md)',
                              marginTop: 'var(--foundation-space-xs)'
                            }}
                          />
                        </div>
                      </VStack>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <H3>{selectedServiceData?.requires_resource ? '4. Välj slutdatum' : '3. Välj slutdatum'}</H3>
                    </CardHeader>
                    <CardContent>
                      <VStack spacing="sm">
                        <div>
                          <Label>Slutdatum</Label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || new Date().toISOString().split('T')[0]}
                            required
                            style={{
                              width: '100%',
                              padding: 'var(--foundation-space-sm)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-body-size-md)',
                              marginTop: 'var(--foundation-space-xs)'
                            }}
                          />
                        </div>
                        <div>
                          <Label>Sluttid</Label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: 'var(--foundation-space-sm)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-body-size-md)',
                              marginTop: 'var(--foundation-space-xs)'
                            }}
                          />
                        </div>
                      </VStack>
                    </CardContent>
                  </Card>

                  {/* Visa resurstillgänglighet för uthyrningar */}
                  {startDate && endDate && (!selectedServiceData?.requires_resource || selectedResource) && (
                    <Card variant={rentalAvailability?.available ? 'elevated' : 'outlined'}>
                      <CardContent>
                        {checkingRentalAvailability ? (
                          <VStack spacing="sm" align="center">
                            <Spinner size="md" />
                            <Body size="sm" color="secondary">Kontrollerar tillgänglighet...</Body>
                          </VStack>
                        ) : rentalAvailability ? (
                          <VStack spacing="sm">
                            <HStack spacing="sm" align="center">
                              <Icon size="md" color={rentalAvailability.available ? 'success' : 'error'}>
                                {rentalAvailability.available ? <CheckIcon /> : <XMarkIcon />}
                              </Icon>
                              <Body weight="semibold" color={rentalAvailability.available ? 'success' : 'error'}>
                                {rentalAvailability.available ? 'Tillgänglig' : 'Inte tillgänglig'}
                              </Body>
                            </HStack>
                            <Body size="sm" color="secondary">
                              {rentalAvailability.message}
                            </Body>
                            {rentalAvailability.available_count !== undefined && rentalAvailability.available_count > 1 && (
                              <Body size="sm" color="secondary">
                                {rentalAvailability.available_count} resurser tillgängliga
                              </Body>
                            )}
                          </VStack>
                        ) : null}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Visa service information och regler när service är vald */}
              {selectedService && selectedServiceData && (
                <Card variant="outlined" radius="sm">
                  <CardContent>
                    <VStack spacing="sm">
                      <HStack spacing="sm" align="start">
                        <Body weight="semibold">{selectedServiceData.name}</Body>
                        {selectedServiceData.price && (
                          <Body color="accent" weight="semibold">
                            {selectedServiceData.price} {selectedServiceData.currency?.toUpperCase() || 'SEK'}
                          </Body>
                        )}
                      </HStack>
                      {selectedServiceData.description && (
                        <Body size="sm" color="secondary">
                          {selectedServiceData.description}
                        </Body>
                      )}
                      {/* Info-sektion med regler och viktig information */}
                      {(selectedServiceData.service_rules || selectedServiceData.cancellation_rules || (selectedServiceData.min_advance_booking_hours && selectedServiceData.min_advance_booking_hours > 0)) && (
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
                              
                              {selectedServiceData.service_rules && (
                                <div style={{ width: '100%' }}>
                                  <VStack spacing="xs" align="start">
                                    <Body size="sm" color="secondary" style={{ lineHeight: '1.5' }}>
                                      {selectedServiceData.service_rules}
                                    </Body>
                                  </VStack>
                                </div>
                              )}
                              
                              {/* Boknings- och avbokningsregler */}
                              {(selectedServiceData.cancellation_rules || (selectedServiceData.min_advance_booking_hours && selectedServiceData.min_advance_booking_hours > 0)) && (
                                <div style={{ width: '100%' }}>
                                  <VStack spacing="sm" align="start">
                                    {selectedServiceData.min_advance_booking_hours && selectedServiceData.min_advance_booking_hours > 0 && (
                                      <VStack spacing="xs" align="start">
                                        <Body size="sm" weight="medium" color="secondary">
                                          Bokningsregler:
                                        </Body>
                                        <HStack spacing="xs" align="start">
                                          <Icon size="sm" color="warning" style={{ flexShrink: 0, marginTop: '2px' }}>
                                            <ClockIcon />
                                          </Icon>
                                          <Body size="sm" color="secondary" style={{ lineHeight: '1.5' }}>
                                            Du måste boka minst {selectedServiceData.min_advance_booking_hours} {selectedServiceData.min_advance_booking_hours === 1 ? 'timme' : 'timmar'} i förväg.
                                          </Body>
                                        </HStack>
                                      </VStack>
                                    )}
                                    
                                    {selectedServiceData.cancellation_rules && (
                                      <VStack spacing="xs" align="start">
                                        <Body size="sm" weight="medium" color="secondary">
                                          Avbokningsregler:
                                        </Body>
                                        <Body size="sm" color="secondary" style={{ lineHeight: '1.5' }}>
                                          {selectedServiceData.cancellation_rules}
                                        </Body>
                                      </VStack>
                                    )}
                                  </VStack>
                                </div>
                              )}
                            </VStack>
                          </CardContent>
                        </Card>
                      )}
                    </VStack>
                  </CardContent>
                </Card>
              )}

              {/* För appointments: Välj datum och tid med kalender */}
              {selectedService && !memoizedIsRental && (
                <Card>
                  <CardHeader>
                    <H3>2. Välj datum och tid</H3>
                  </CardHeader>
                  <CardContent>
                    {loadingAvailability ? (
                      <VStack spacing="sm" align="center">
                        <Spinner size="md" />
                        <Body size="sm" color="secondary">Laddar tillgängliga tider...</Body>
                      </VStack>
                    ) : availability && availability.intervals.length > 0 ? (
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Calendar
                          value={selectedDate}
                          onChange={(date: string) => {
                            setSelectedDate(date);
                            setSelectedTime(null); // Rensa vald tid när datum ändras
                            setAvailability(null); // Rensa availability för att tvinga omhämtning
                          }}
                          minDate={new Date().toISOString().split('T')[0]}
                          availableTimes={availability.intervals}
                          selectedTime={selectedTime}
                          onTimeSelect={(time: { start_time: string; end_time: string }) => {
                            setSelectedTime(time);
                          }}
                          showTimeSelection={!!selectedDate}
                          className="booking-calendar"
                        />
                      </div>
                    ) : availability && availability.intervals.length === 0 ? (
                      <VStack spacing="md" align="center">
                        <WarningAlert
                          title="Inga tillgängliga tider för detta datum"
                          variant="solid"
                        >
                          Välj ett annat datum eller kontakta oss direkt för att boka.
                        </WarningAlert>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <Calendar
                            value={selectedDate}
                            onChange={(date: string) => {
                              setSelectedDate(date);
                              setSelectedTime(null); // Rensa vald tid när datum ändras
                              setAvailability(null); // Rensa availability för att tvinga omhämtning
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                            availableTimes={[]}
                            selectedTime={selectedTime}
                            onTimeSelect={(time: { start_time: string; end_time: string }) => {
                              setSelectedTime(time);
                            }}
                            showTimeSelection={!!selectedDate}
                            className="booking-calendar"
                          />
                        </div>
                      </VStack>
                    ) : selectedDate ? (
                      <VStack spacing="sm" align="center">
                        <Body size="sm" color="secondary">Välj ett datum för att se tillgängliga tider</Body>
                      </VStack>
                    ) : null}
                  </CardContent>
                </Card>
              )}

              {/* Välj resurs (om tjänsten kräver det) */}
              {selectedService && selectedServiceData?.requires_resource && (
                <Card>
                  <CardHeader>
                    <H3>{memoizedIsRental ? '2. Välj resurs' : '3. Välj resurs'}</H3>
                  </CardHeader>
                  <CardContent>
                    {loadingResources ? (
                      <VStack spacing="sm" align="center">
                        <Spinner size="md" />
                        <Body size="sm" color="secondary">Laddar resurser...</Body>
                      </VStack>
                    ) : resources.length > 0 ? (
                      <VStack spacing="md">
                        <Body size="sm" color="secondary">
                          Välj vem du vill boka med. Klicka på en resurs för att markera den.
                        </Body>
                        <HStack spacing="sm" wrap align="stretch">
                          {resources.map((resource) => {
                            const isSelected = selectedResource === resource.id;
                            return (
                              <Card
                                key={resource.id}
                                variant={isSelected ? 'elevated' : 'outlined'}
                                radius="md"
                                interactive
                                selected={isSelected}
                                onClick={() => handleResourceSelect(resource.id)}
                              >
                                {resource.image_url && (
                                  <div style={{ 
                                    width: '100%', 
                                    aspectRatio: '1 / 1', // Kvadratisk
                                    overflow: 'hidden',
                                    borderTopLeftRadius: 'var(--radius-md)',
                                    borderTopRightRadius: 'var(--radius-md)'
                                  }}>
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
                                )}
                                <CardContent>
                                  <VStack spacing="xs" align="start">
                                    <HStack spacing="sm" align="center">
                                      {!resource.image_url && (
                                      <Icon size="sm" color={isSelected ? 'accent' : 'primary'}>
                                        <UserIcon />
                                      </Icon>
                                      )}
                                      <Body weight="semibold" color={isSelected ? 'accent' : 'primary'}>
                                        {resource.name}
                                      </Body>
                                    </HStack>
                                    {resource.description && (
                                      <Body size="sm" color="secondary">
                                        {resource.description}
                                      </Body>
                                    )}
                                  </VStack>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </HStack>
                        {selectedResource && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResource(null)}
                          >
                            Avmarkera resurs
                          </Button>
                        )}
                      </VStack>
                    ) : (
                      <WarningAlert
                        title="Inga tillgängliga resurser för denna tjänst"
                      >
                        Det finns för närvarande inga tillgängliga resurser för denna tjänst. Kontakta oss direkt för att boka.
                      </WarningAlert>
                    )}
                  </CardContent>
                </Card>
              )}


              {/* Kundinformation */}
              {selectedService && 
               ((!memoizedIsRental && selectedDate && selectedTime) || (memoizedIsRental && startDate && endDate)) && 
               (!selectedServiceData?.requires_resource || selectedResource) && (
                <Card>
                  <CardHeader>
                    <H3>
                      {memoizedIsRental 
                        ? (selectedServiceData?.requires_resource ? '5. Dina uppgifter' : '4. Dina uppgifter')
                        : (selectedServiceData?.requires_resource ? '5. Dina uppgifter' : '4. Dina uppgifter')
                      }
                    </H3>
                  </CardHeader>
                  <CardContent>
                    <VStack spacing="md">
                      <Input
                        label="Namn"
                        value={formData.customer_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 255) {
                            setFormData({ ...formData, customer_name: value });
                          }
                        }}
                        required
                        placeholder="Ditt fullständiga namn"
                        maxLength={255}
                      />
                      <Input
                        label="E-post"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => {
                          const email = e.target.value;
                          setFormData({ ...formData, customer_email: email });
                          // Validera email format i realtid
                          if (email.trim()) {
                            if (!emailRegex.test(email.trim())) {
                              setEmailError('Ange en giltig e-postadress');
                            } else {
                              setEmailError(null);
                            }
                          } else {
                            setEmailError(null);
                          }
                        }}
                        required
                        placeholder="din@epost.se"
                        error={emailError || undefined}
                      />
                      <Input
                        label="Telefonnummer (valfritt)"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 50) {
                            setFormData({ ...formData, customer_phone: value });
                          }
                        }}
                        placeholder="070-123 45 67"
                        maxLength={50}
                      />
                      <Textarea
                        label="Meddelande (valfritt)"
                        value={formData.notes}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 1000) {
                            setFormData({ ...formData, notes: value });
                          }
                        }}
                        placeholder="Eventuella önskemål eller frågor..."
                        maxLength={1000}
                      />
                    </VStack>
                  </CardContent>
                </Card>
              )}

              {/* Submit */}
              {selectedService && selectedDate && selectedTime && (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting || !formData.customer_name.trim() || !formData.customer_email.trim() || !!emailError}
                  style={{ width: '100%' }}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" />
                      Skapar bokning...
                    </>
                  ) : (
                    'Bekräfta bokning'
                  )}
                </Button>
              )}
            </VStack>
          </form>
        ) : null}
      </VStack>
    </div>
  );
}

