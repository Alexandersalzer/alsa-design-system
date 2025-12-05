/**
 * Customer Portal - Kundportal för att se och hantera bokningar
 * 
 * Route: /bookings/customer/[userId]
 * 
 * TODO: Ersätt user_id med slug/identifierare när CRM är klart
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
  Tag,
  Spinner,
  WarningAlert,
  SuccessAlert
} from '@blimpify-im/ui';
import { CalendarIcon, ClockIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Icon } from '@blimpify-im/ui';
import { apiClient } from '../../../../lib/api/client';

interface Appointment {
  id: number;
  service_name: string;
  resource_name?: string | null;
  date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  booking_type?: 'appointment' | 'rental' | 'recurring';
  start_datetime?: string | null;
  end_datetime?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
}

export default function CustomerPortalPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const userId = parseInt(resolvedParams.userId);
  
  const [bookingNumber, setBookingNumber] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<Record<number, boolean>>({});

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!bookingNumber || bookingNumber.trim().length === 0) {
      setError('Ange ett bokningsnummer');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const params = new URLSearchParams();
      params.append('user_id', userId.toString());
      params.append('booking_number', bookingNumber.trim());
      
      const response = await apiClient.get(
        `/labs/bookings/public/customer/appointments?${params.toString()}`
      );

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
        if (response.data.appointments.length === 0) {
          setSuccess('Inga bokningar hittades för detta bokningsnummer.');
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Kunde inte hämta bokningar. Kontrollera att bokningsnumret är korrekt.'
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm('Är du säker på att du vill avboka denna bokning?')) {
      return;
    }

    try {
      setCancelling(prev => ({ ...prev, [appointmentId]: true }));
      setError(null);
      
      const response = await apiClient.post(`/labs/bookings/public/appointments/${appointmentId}/cancel`, {
        user_id: userId,
        booking_number: bookingNumber
      });

      if (response.data.success) {
        setSuccess('Bokningen har avbokats.');
        // Uppdatera listan
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelled' as const }
              : apt
          )
        );
        // Rensa success-meddelande efter 3 sekunder
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunde inte avboka bokningen.');
    } finally {
      setCancelling(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Bekräftad';
      case 'pending':
        return 'Väntande';
      case 'cancelled':
        return 'Avbokad';
      case 'completed':
        return 'Genomförd';
      default:
        return status;
    }
  };

  const canCancel = (appointment: Appointment) => {
    return appointment.status !== 'cancelled' && appointment.status !== 'completed';
  };

  const getAppointmentDateTime = (appointment: Appointment) => {
    if (appointment.booking_type === 'rental' || appointment.booking_type === 'recurring') {
      if (appointment.start_datetime && appointment.end_datetime) {
        const start = formatDateTime(appointment.start_datetime);
        const end = formatDateTime(appointment.end_datetime);
        return { date: start, time: end };
      }
      return { date: 'Datum saknas', time: '' };
    } else {
      return {
        date: appointment.date ? formatDate(appointment.date) : 'Datum saknas',
        time: appointment.start_time && appointment.end_time
          ? `${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`
          : 'Tid saknas'
      };
    }
  };

  return (
    <Container align="center" style={{ padding: 'var(--foundation-space-xl) 0', maxWidth: '768px', margin: '0 auto' }}>
      <VStack spacing="lg">
        <VStack spacing="sm" align="center">
          <H2>Mina bokningar</H2>
          <Body color="secondary">Ange ditt bokningsnummer för att se dina bokningar</Body>
        </VStack>

        <Card>
          <CardContent>
            <form onSubmit={handleSearch}>
              <VStack spacing="md">
                <Input
                  label="Bokningsnummer"
                  type="text"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  placeholder="BK-20251126-123456"
                  required
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !bookingNumber}
                  style={{ width: '100%' }}
                >
                  {loading ? <Spinner size="sm" /> : 'Visa mina bokningar'}
                </Button>
              </VStack>
            </form>
          </CardContent>
        </Card>

        {error && (
          <WarningAlert>
            {error}
          </WarningAlert>
        )}

        {success && (
          <SuccessAlert>
            {success}
          </SuccessAlert>
        )}

        {appointments.length > 0 && (
          <VStack spacing="md">
            <H3>Dina bokningar ({appointments.length})</H3>
            {appointments.map((appointment) => {
              const dateTime = getAppointmentDateTime(appointment);
              return (
                <Card key={appointment.id} variant="outlined">
                  <CardContent>
                    <VStack spacing="md">
                      <HStack spacing="md" justify="between" align="start">
                        <VStack spacing="xs" align="start">
                          <H3>{appointment.service_name}</H3>
                          {appointment.resource_name && (
                            <Body size="sm" color="secondary">
                              Resurs: {appointment.resource_name}
                            </Body>
                          )}
                        </VStack>
                        <Tag variant={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Tag>
                      </HStack>

                      <HStack spacing="sm" align="start">
                        <Icon size="sm" color="secondary">
                          <CalendarIcon />
                        </Icon>
                        <Body size="sm">{dateTime.date}</Body>
                      </HStack>

                      {dateTime.time && (
                        <HStack spacing="sm" align="start">
                          <Icon size="sm" color="secondary">
                            <ClockIcon />
                          </Icon>
                          <Body size="sm">{dateTime.time}</Body>
                        </HStack>
                      )}

                      {appointment.notes && (
                        <Body size="sm" color="secondary">
                          Anteckningar: {appointment.notes}
                        </Body>
                      )}

                      {canCancel(appointment) && (
                        <HStack spacing="sm" justify="end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(appointment.id)}
                            disabled={cancelling[appointment.id]}
                          >
                            {cancelling[appointment.id] ? (
                              <>
                                <Spinner size="sm" />
                                Avbokar...
                              </>
                            ) : (
                              <>
                                <Icon size="sm">
                                  <XMarkIcon />
                                </Icon>
                                Avboka
                              </>
                            )}
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </CardContent>
                </Card>
              );
            })}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}



