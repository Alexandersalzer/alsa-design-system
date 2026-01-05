/**
 * Step 3: Date/Time Selection
 * Handles both appointments (date + time) and rentals (date interval)
 */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  VStack,
  Body,
  Spinner,
  WarningAlert,
  Label,
  Card,
  CardContent,
  HStack,
  Icon,
  DateRangePicker,
  TimeInput
} from '@blimpify-im/ui';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { parseDate, CalendarDate, Time, parseTime, getLocalTimeZone } from '@internationalized/date';
import WeekViewCalendar from '../WeekViewCalendar';
import apiClient from '../../../../../../lib/api/client';
import type { AvailabilityResponse, RentalAvailability, Resource } from '../../types';

interface Step3DateTimeSelectionProps {
  externalId: string;
  serviceId: number;
  resourceId?: number;
  isRental: boolean;
  selectedDate: string;
  selectedTime: { start_time: string; end_time: string } | null;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  pickupTime?: string; // För rentals
  dropoffTime?: string; // För rentals
  onDateChange: (date: string) => void;
  onTimeChange: (time: { start_time: string; end_time: string } | null) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onPickupTimeChange?: (time: string) => void; // För rentals
  onDropoffTimeChange?: (time: string) => void; // För rentals
  availability: AvailabilityResponse | null;
  loadingAvailability: boolean;
  onAvailabilityChange: (availability: AvailabilityResponse | null) => void;
  onLoadingChange: (loading: boolean) => void;
  servicePrice?: number; // För prisberäkning
  servicePriceUnit?: string; // 'day', 'week', 'month'
  selectedResource?: Resource | null; // För att hämta pickup/dropoff hours
  onPickupTimeValidationChange?: (isValid: boolean) => void; // För att meddela parent om validering
  onDropoffTimeValidationChange?: (isValid: boolean) => void; // För att meddela parent om validering
  service?: { min_advance_booking_hours?: number; cancellation_rules?: string } | null; // För att kontrollera om tider är obligatoriska
}

export default function Step3DateTimeSelection({
  externalId,
  serviceId,
  resourceId,
  isRental,
  selectedDate,
  selectedTime,
  startDate,
  endDate,
  startTime,
  endTime,
  pickupTime = '09:00',
  dropoffTime = '17:00',
  onDateChange,
  onTimeChange,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onPickupTimeChange,
  onDropoffTimeChange,
  availability,
  loadingAvailability,
  onAvailabilityChange,
  onLoadingChange,
  servicePrice,
  servicePriceUnit,
  selectedResource,
  onPickupTimeValidationChange,
  onDropoffTimeValidationChange,
  service
}: Step3DateTimeSelectionProps) {
  const [rentalAvailability, setRentalAvailability] = useState<RentalAvailability | null>(null);
  const [checkingRentalAvailability, setCheckingRentalAvailability] = useState(false);
  const [pickupHours, setPickupHours] = useState<{ min: string; max: string } | null>(null);
  const [dropoffHours, setDropoffHours] = useState<{ min: string; max: string } | null>(null);
  const [timeSlots, setTimeSlots] = useState<any>(null);
  const [pickupTimeError, setPickupTimeError] = useState<string | null>(null);
  const [dropoffTimeError, setDropoffTimeError] = useState<string | null>(null);

  // Helper functions för konvertering mellan string och DateValue/TimeValue
  const stringToDateValue = (dateStr: string | null | undefined): CalendarDate | null => {
    if (!dateStr) return null;
    try {
      return parseDate(dateStr);
    } catch {
      return null;
    }
  };

  const dateValueToString = (dateValue: CalendarDate | null | undefined): string => {
    if (!dateValue) return '';
    return dateValue.toString();
  };

  const stringToTimeValue = (timeStr: string | null | undefined): Time | null => {
    if (!timeStr) return null;
    try {
      // Konvertera HH:MM till HH:MM:SS om nödvändigt
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        return parseTime(`${timeStr}:00`);
      }
      return parseTime(timeStr);
    } catch {
      return null;
    }
  };

  const timeValueToString = (timeValue: any): string => {
    if (!timeValue) return '';
    // Hantera både Time och CalendarDateTime
    const hour = String(timeValue.hour || 0).padStart(2, '0');
    const minute = String(timeValue.minute || 0).padStart(2, '0');
    return `${hour}:${minute}`;
  };

  // Konvertera startDate/endDate till DateRangeValue för DateRangePicker
  const dateRangeValue = useMemo(() => {
    const start = stringToDateValue(startDate);
    const end = stringToDateValue(endDate);
    if (start && end) {
      return { start, end };
    }
    if (start) {
      return { start, end: start };
    }
    return null;
  }, [startDate, endDate]);

  // Konvertera pickupTime/dropoffTime till TimeValue
  const pickupTimeValue = useMemo(() => stringToTimeValue(pickupTime), [pickupTime]);
  const dropoffTimeValue = useMemo(() => stringToTimeValue(dropoffTime), [dropoffTime]);

  // Set default dates
  useEffect(() => {
    if (!isRental && !selectedDate) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      onDateChange(`${year}-${month}-${day}`);
    }
    
    if (isRental && !startDate) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      onStartDateChange(dateStr);
      onEndDateChange(dateStr);
    }
  }, [isRental, selectedDate, startDate, onDateChange, onStartDateChange, onEndDateChange]);

  // Hämta time slots för öppettider
  useEffect(() => {
    if (!isRental || !externalId) return;

    // Debounce: vänta 300ms innan vi gör API-anrop (time slots ändras sällan)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/labs/bookings/public/time-slots?external_id=${externalId}`);
        if (response.data?.success && response.data?.timeSlots) {
          setTimeSlots(response.data.timeSlots);
        }
      } catch (error: any) {
        // Ignorera 429-fel (rate limiting)
        if (error.response?.status === 429) {
          console.warn('[Step3DateTimeSelection] Rate limited when fetching time slots');
          return;
        }
        console.error('Error fetching time slots:', error);
        setTimeSlots(null);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [isRental, externalId]);

  // Beräkna pickup hours för startdatumets veckodag
  useEffect(() => {
    if (!isRental || !startDate) {
      setPickupHours(null);
      return;
    }

    const calculatePickupHours = () => {
      // Använd explicit lokal tid för att undvika timezone-problem
      const date = new Date(startDate + 'T12:00:00');
      const weekday = date.getDay(); // 0 = söndag, 1 = måndag, etc.
      
      // Standard öppettider från time slots
      let minTime = '00:00';
      let maxTime = '23:59';
      
      // Formatera tider till HH:MM (ta bort sekunder om de finns)
      const formatTime = (t: string) => t && t.length > 5 ? t.substring(0, 5) : t;
      
      if (timeSlots && timeSlots[weekday] && timeSlots[weekday].slots && timeSlots[weekday].slots.length > 0) {
        const times = timeSlots[weekday].slots.flatMap((slot: any) => [
          formatTime(slot.start_time),
          formatTime(slot.end_time)
        ]);
        if (times.length > 0) {
          minTime = times.reduce((min: string, time: string) => time < min ? time : min, times[0]);
          maxTime = times.reduce((max: string, time: string) => time > max ? time : max, times[0]);
        }
      }
      
      // Om resurs har pickup_hours, använd dem (mer specifikt)
      if (selectedResource?.pickup_hours?.[weekday]) {
        const pickupTimes = selectedResource.pickup_hours[weekday];
        if (pickupTimes && pickupTimes.length >= 2) {
          minTime = formatTime(pickupTimes[0] || minTime);
          maxTime = formatTime(pickupTimes[1] || maxTime);
        }
      }
      
      setPickupHours({ min: minTime, max: maxTime });
    };

    calculatePickupHours();
  }, [isRental, startDate, timeSlots, selectedResource]);

  // Beräkna dropoff hours för slutdatumets veckodag
  useEffect(() => {
    if (!isRental || !endDate) {
      setDropoffHours(null);
      return;
    }

    const calculateDropoffHours = () => {
      // Använd explicit lokal tid för att undvika timezone-problem
      const date = new Date(endDate + 'T12:00:00');
      const weekday = date.getDay(); // 0 = söndag, 1 = måndag, etc.
      
      // Standard öppettider från time slots
      let minTime = '00:00';
      let maxTime = '23:59';
      
      // Formatera tider till HH:MM (ta bort sekunder om de finns)
      const formatTime = (t: string) => t && t.length > 5 ? t.substring(0, 5) : t;
      
      if (timeSlots && timeSlots[weekday] && timeSlots[weekday].slots && timeSlots[weekday].slots.length > 0) {
        const times = timeSlots[weekday].slots.flatMap((slot: any) => [
          formatTime(slot.start_time),
          formatTime(slot.end_time)
        ]);
        if (times.length > 0) {
          minTime = times.reduce((min: string, time: string) => time < min ? time : min, times[0]);
          maxTime = times.reduce((max: string, time: string) => time > max ? time : max, times[0]);
        }
      }
      
      // Om resurs har dropoff_hours, använd dem (mer specifikt)
      if (selectedResource?.dropoff_hours?.[weekday]) {
        const dropoffTimes = selectedResource.dropoff_hours[weekday];
        if (dropoffTimes && dropoffTimes.length >= 2) {
          minTime = formatTime(dropoffTimes[0] || minTime);
          maxTime = formatTime(dropoffTimes[1] || maxTime);
        }
      }
      
      setDropoffHours({ min: minTime, max: maxTime });
    };

    calculateDropoffHours();
  }, [isRental, endDate, timeSlots, selectedResource]);

  // Validera pickup/dropoff tider när de eller öppettiderna ändras
  useEffect(() => {
    // Om tider är obligatoriska (pga regler) och pickupTime saknas, markera som ogiltig (men visa inget felmeddelande)
    const timesRequired = service && (service.min_advance_booking_hours || service.cancellation_rules);
    if (!isRental) {
      onPickupTimeValidationChange?.(true);
      setPickupTimeError(null);
      return;
    }
    
    if (timesRequired && !pickupTime) {
      onPickupTimeValidationChange?.(false);
      setPickupTimeError(null); // Visa inget felmeddelande, bara blockera "nästa"
      return;
    }
    
    if (!pickupTime || !startDate) {
      onPickupTimeValidationChange?.(true);
      setPickupTimeError(null);
      return;
    }

    // Validera att tiden inte är i det förflutna
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let isValid = true;
    let errorMessage: string | null = null;
    
    if (startDate && pickupTime) {
      const selectedDateTime = new Date(`${startDate}T${pickupTime}:00`);
      const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
      
      // Om det är idag, kontrollera att tiden inte är i det förflutna
      if (selectedDateOnly.getTime() === today.getTime()) {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (pickupTime < currentTime) {
          isValid = false;
          errorMessage = 'Hämtningstid kan inte vara i det förflutna';
        }
      }
      
      // Om datumet är i det förflutna
      if (selectedDateOnly < today) {
        isValid = false;
        errorMessage = 'Hämtningsdatum kan inte vara i det förflutna';
      }
    }
    
    // Validera mot pickup hours om det finns
    if (isValid && pickupHours && pickupTime) {
      const formatTime = (t: string) => t.length > 5 ? t.substring(0, 5) : t;
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('sv-SE', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      };
      
      if (pickupTime < pickupHours.min || pickupTime > pickupHours.max) {
        isValid = false;
        errorMessage = `Hämtningstid måste vara mellan ${formatTime(pickupHours.min)} och ${formatTime(pickupHours.max)} den ${formatDate(startDate)}`;
      }
    }
    
    // Validera min_advance_booking_hours om det finns
    if (isValid && service?.min_advance_booking_hours && startDate && pickupTime) {
      const pickupDateTime = new Date(`${startDate}T${pickupTime}:00`);
      const hoursUntilPickup = (pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilPickup < service.min_advance_booking_hours) {
        isValid = false;
        errorMessage = `Du måste boka minst ${service.min_advance_booking_hours} ${service.min_advance_booking_hours === 1 ? 'timme' : 'timmar'} i förväg. Vald tid är ${Math.ceil(hoursUntilPickup)} ${Math.ceil(hoursUntilPickup) === 1 ? 'timme' : 'timmar'} bort.`;
      }
    }
    
    onPickupTimeValidationChange?.(isValid);
    setPickupTimeError(errorMessage);
  }, [isRental, pickupTime, startDate, pickupHours, onPickupTimeValidationChange, service]);

  useEffect(() => {
    // Om tider är obligatoriska (pga regler) och dropoffTime saknas, markera som ogiltig (men visa inget felmeddelande)
    const timesRequired = service && (service.min_advance_booking_hours || service.cancellation_rules);
    if (!isRental) {
      onDropoffTimeValidationChange?.(true);
      setDropoffTimeError(null);
      return;
    }
    
    if (timesRequired && !dropoffTime) {
      onDropoffTimeValidationChange?.(false);
      setDropoffTimeError(null); // Visa inget felmeddelande, bara blockera "nästa"
      return;
    }
    
    if (!dropoffTime || !endDate) {
      onDropoffTimeValidationChange?.(true);
      setDropoffTimeError(null);
      return;
    }

    // Validera att tiden inte är i det förflutna
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let isValid = true;
    let errorMessage: string | null = null;
    
    if (endDate && dropoffTime) {
      const selectedDateTime = new Date(`${endDate}T${dropoffTime}:00`);
      const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
      
      // Om det är idag, kontrollera att tiden inte är i det förflutna
      if (selectedDateOnly.getTime() === today.getTime()) {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (dropoffTime < currentTime) {
          isValid = false;
          errorMessage = 'Lämningstid kan inte vara i det förflutna';
        }
      }
      
      // Om datumet är i det förflutna
      if (selectedDateOnly < today) {
        isValid = false;
        errorMessage = 'Lämningsdatum kan inte vara i det förflutna';
      }
    }
    
    // Validera mot dropoff hours om det finns
    if (isValid && dropoffHours && dropoffTime) {
      const formatTime = (t: string) => t.length > 5 ? t.substring(0, 5) : t;
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('sv-SE', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      };
      
      if (dropoffTime < dropoffHours.min || dropoffTime > dropoffHours.max) {
        isValid = false;
        errorMessage = `Lämningstid måste vara mellan ${formatTime(dropoffHours.min)} och ${formatTime(dropoffHours.max)} den ${formatDate(endDate)}`;
      }
    }
    
    // Validera att dropoff är efter pickup
    if (isValid && startDate && endDate && pickupTime && dropoffTime) {
      const pickupDateTime = new Date(`${startDate}T${pickupTime}:00`);
      const dropoffDateTime = new Date(`${endDate}T${dropoffTime}:00`);
      
      if (dropoffDateTime <= pickupDateTime) {
        isValid = false;
        errorMessage = 'Lämningstid måste vara efter hämtningstid';
      }
    }
    
    onDropoffTimeValidationChange?.(isValid);
    setDropoffTimeError(errorMessage);
  }, [isRental, dropoffTime, endDate, dropoffHours, startDate, pickupTime, onDropoffTimeValidationChange, service]);

  // WeekViewCalendar handles availability fetching internally

  // Check rental availability
  useEffect(() => {
    // För rentals: kräv serviceId, startDate och endDate (resourceId behövs inte längre eftersom kunden väljer resurs efteråt)
    if (!isRental || !serviceId || !startDate || !endDate) {
      setRentalAvailability(null);
      return;
    }

    const checkRentalAvailability = async () => {
      // För rentals: om ingen resurs är vald än, visa inte availability (resurs väljs i nästa steg)
      if (isRental && !resourceId) {
        console.log('[Step3DateTimeSelection] Skipping availability check - no resource selected yet (rental flow)');
        setRentalAvailability(null);
        return;
      }
      
      try {
        setCheckingRentalAvailability(true);
        
        // För rentals: använd pickupTime/dropoffTime om de är satta, annars standardtider
        // Om tiderna inte är satta än, använd standardtider för tillgänglighetskontroll
        const startTimeStr = pickupTime && pickupTime.trim() ? `${pickupTime}:00` : (startTime || '00:00:00');
        const endTimeStr = dropoffTime && dropoffTime.trim() ? `${dropoffTime}:00` : (endTime || '23:59:59');
        
        const startDateTime = `${startDate}T${startTimeStr}`;
        const endDateTime = `${endDate}T${endTimeStr}`;
        
        // För rentals: skicka resourceId om det är valt (för att kontrollera tillgänglighet för specifik resurs)
        const resourceParam = resourceId ? `&resource_id=${resourceId}` : '';
        // Lägg till timestamp för att undvika cache-problem
        const cacheBuster = `&_t=${Date.now()}`;
        const url = `/labs/bookings/public/rental/availability?external_id=${externalId}&service_id=${serviceId}&start_datetime=${startDateTime}&end_datetime=${endDateTime}${resourceParam}${cacheBuster}`;
        console.log('[Step3DateTimeSelection] Checking rental availability:', {
          url,
          resourceId,
          hasResourceId: !!resourceId,
          resourceIdType: typeof resourceId,
          resourceIdValue: resourceId,
          startDateTime,
          endDateTime,
          isRental
        });
        
        const response = await apiClient.get(url);

        if (response.data.success) {
          console.log('[Step3DateTimeSelection] Rental availability response:', {
            available: response.data.available,
            available_count: response.data.available_count,
            message: response.data.message,
            resourceId: resourceId,
            hasResourceId: !!resourceId,
            resources: response.data.resources?.map((r: any) => ({
              id: r.id,
              name: r.name,
              capacity: r.capacity,
              booked_count: r.booked_count,
              available_units: r.capacity === null || r.capacity === 0 
                ? 1 
                : Math.max(Number(r.capacity) - (typeof r.booked_count === 'string' ? parseInt(r.booked_count, 10) : (r.booked_count || 0)), 0)
            }))
          });
          
          // Om en specifik resurs är vald och available_count är 0, markera som inte tillgänglig
          const isAvailable = resourceId 
            ? (response.data.available && (response.data.available_count || 0) > 0)
            : response.data.available;
          
          setRentalAvailability({
            available: isAvailable,
            message: response.data.message,
            available_count: response.data.available_count || 0
          });
        } else {
          console.warn('[Step3DateTimeSelection] Rental availability returned success: false:', response.data);
          setRentalAvailability({
            available: false,
            message: response.data.message || 'Resursen är inte tillgänglig för detta intervall',
            available_count: 0
          });
        }
      } catch (err: any) {
        // Ignorera 429-fel (rate limiting) - användaren får se att det laddar
        if (err.response?.status === 429) {
          console.warn('[Step3DateTimeSelection] Rate limited when checking availability');
          return;
        }
        // Ignorera 404-fel tyst (endpoint kanske inte är implementerad ännu)
        if (err.response?.status === 404) {
          console.warn('[Step3DateTimeSelection] Rental availability endpoint not found (404). This may be expected if the feature is not yet implemented.');
          setRentalAvailability(null);
          return;
        }
        console.error('Error checking rental availability:', err);
        setRentalAvailability(null);
      } finally {
        setCheckingRentalAvailability(false);
      }
    };

    // Debounce: vänta 500ms efter senaste ändringen innan vi gör API-anrop
    const timeoutId = setTimeout(() => {
      checkRentalAvailability();
    }, 500); // 500ms debounce

    // Cleanup: avbryt timeout om dependencies ändras innan timeout är klar
    return () => clearTimeout(timeoutId);
  }, [externalId, serviceId, resourceId, isRental, startDate, endDate, startTime, endTime, pickupTime, dropoffTime]);

  if (isRental) {
    // Calculate rental days and price
    // Räknar antal dygn baserat på 24-timmarsperioder från upphämtningstidpunkten
    // T.ex. 1 dec 17:00 till 2 dec 17:00 = 1 dygn (exakt 24 timmar)
    // T.ex. 1 dec 17:00 till 2 dec 17:01 = 2 dygn (över 24 timmar, nästa dygn räknas)
    // T.ex. 1 dec 09:00 till 1 dec 17:00 = 1 dygn (mindre än 24 timmar men minst 1 dygn)
    const calculateDays = () => {
      if (!startDate || !endDate) return 0;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Kontrollera att datum är giltiga
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      
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
      let rentalDays: number;
      if (diffHours === 0) {
        rentalDays = 0;
      } else if (diffHours <= 24) {
        rentalDays = 1; // Mindre än eller exakt 24 timmar = 1 dygn
      } else {
        rentalDays = Math.ceil(diffHours / 24); // Mer än 24 timmar, avrunda uppåt
      }
      
      console.log('[Step3DateTimeSelection] calculateDays:', {
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        diffHours: diffHours.toFixed(2),
        rentalDays
      });
      
      return rentalDays;
    };

    const rentalDays = calculateDays();
    
    let totalPrice: number | undefined = undefined;
    if (servicePrice !== undefined && servicePrice !== null && rentalDays > 0) {
      if (servicePriceUnit === 'day') {
        totalPrice = rentalDays * servicePrice;
      } else if (servicePriceUnit === 'week') {
        const weeks = Math.ceil(rentalDays / 7);
        totalPrice = weeks * servicePrice;
      } else if (servicePriceUnit === 'month') {
        const months = Math.ceil(rentalDays / 30);
        totalPrice = months * servicePrice;
      } else {
        totalPrice = servicePrice; // fixed price
      }
    }

    return (
      <VStack spacing="md">
        <DateRangePicker
          label="Välj datumintervall"
          value={dateRangeValue}
          onChange={(range) => {
            if (range) {
              // Konvertera DateValue till CalendarDate om nödvändigt
              const start = range.start instanceof CalendarDate ? range.start : parseDate(range.start.toString());
              const end = range.end instanceof CalendarDate ? range.end : (range.end ? parseDate(range.end.toString()) : start);
              
              // Validera att datum inte är i det förflutna
              const today = parseDate(new Date().toISOString().split('T')[0]);
              if (start.compare(today) < 0) {
                // Startdatum är i det förflutna - ignorera ändringen
                return;
              }
              if (end && end.compare(today) < 0) {
                // Slutdatum är i det förflutna - sätt till startdatum
                onStartDateChange(dateValueToString(start));
                onEndDateChange(dateValueToString(start));
              } else {
                onStartDateChange(dateValueToString(start));
                onEndDateChange(dateValueToString(end));
              }
            } else {
              onStartDateChange('');
              onEndDateChange('');
            }
          }}
          minValue={parseDate(new Date().toISOString().split('T')[0])}
          size="md"
          variant="bordered"
        />
        
        {isRental && (
          <VStack spacing="md">
            <VStack spacing="sm">
              <TimeInput
                label={`Hämtningstid ${service && (service.min_advance_booking_hours || service.cancellation_rules) ? '*' : '(valfritt)'}`}
                value={pickupTimeValue || undefined}
                onChange={(timeValue) => {
                  const timeStr = timeValueToString(timeValue);
                  onPickupTimeChange?.(timeStr);
                  
                  // Validera att tiden inte är i det förflutna
                  if (startDate && timeStr) {
                    const now = new Date();
                    const selectedDateTime = new Date(`${startDate}T${timeStr}:00`);
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
                    
                    if (selectedDateOnly.getTime() === today.getTime()) {
                      // Om det är idag, kontrollera att tiden inte är i det förflutna
                      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      if (timeStr < currentTime) {
                        setPickupTimeError('Hämtningstid kan inte vara i det förflutna');
                        onPickupTimeValidationChange?.(false);
                        return;
                      }
                    }
                  }
                  
                  // Validera att tiden är inom pickup hours för startdatum
                  if (pickupHours && timeStr) {
                    const formatTime = (t: string) => t.length > 5 ? t.substring(0, 5) : t;
                    const formatDate = (dateStr: string) => {
                      const date = new Date(dateStr);
                      return date.toLocaleDateString('sv-SE', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      });
                    };
                    
                    if (timeStr < pickupHours.min || timeStr > pickupHours.max) {
                      setPickupTimeError(`Hämtningstid måste vara mellan ${formatTime(pickupHours.min)} och ${formatTime(pickupHours.max)} den ${formatDate(startDate)}`);
                      onPickupTimeValidationChange?.(false);
                    } else {
                      setPickupTimeError(null);
                      onPickupTimeValidationChange?.(true);
                    }
                  } else {
                    setPickupTimeError(null);
                    onPickupTimeValidationChange?.(true);
                  }
                }}
                minValue={pickupHours?.min ? (stringToTimeValue(pickupHours.min) || undefined) : undefined}
                maxValue={pickupHours?.max ? (stringToTimeValue(pickupHours.max) || undefined) : undefined}
                hourCycle={24}
                granularity="minute"
                size="md"
                variant="bordered"
                isRequired={service && (service.min_advance_booking_hours || service.cancellation_rules) ? true : false}
                errorMessage={pickupTimeError || undefined}
                helper={pickupHours && !pickupTimeError ? `Öppettider för hämtning: ${pickupHours.min.length > 5 ? pickupHours.min.substring(0, 5) : pickupHours.min} - ${pickupHours.max.length > 5 ? pickupHours.max.substring(0, 5) : pickupHours.max}` : undefined}
              />
        </VStack>

        <VStack spacing="sm">
              <TimeInput
                label={`Lämningstid ${service && (service.min_advance_booking_hours || service.cancellation_rules) ? '*' : '(valfritt)'}`}
                value={dropoffTimeValue || undefined}
                onChange={(timeValue) => {
                  const timeStr = timeValueToString(timeValue);
                  onDropoffTimeChange?.(timeStr);
                  
                  // Validera att tiden inte är i det förflutna
                  if (endDate && timeStr) {
                    const now = new Date();
                    const selectedDateTime = new Date(`${endDate}T${timeStr}:00`);
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
                    
                    if (selectedDateOnly.getTime() === today.getTime()) {
                      // Om det är idag, kontrollera att tiden inte är i det förflutna
                      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      if (timeStr < currentTime) {
                        setDropoffTimeError('Lämningstid kan inte vara i det förflutna');
                        onDropoffTimeValidationChange?.(false);
                        return;
                      }
                    }
                  }
                  
                  // Validera att tiden är inom dropoff hours för slutdatum
                  if (dropoffHours && timeStr) {
                    const formatTime = (t: string) => t.length > 5 ? t.substring(0, 5) : t;
                    const formatDate = (dateStr: string) => {
                      const date = new Date(dateStr);
                      return date.toLocaleDateString('sv-SE', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      });
                    };
                    
                    if (timeStr < dropoffHours.min || timeStr > dropoffHours.max) {
                      setDropoffTimeError(`Lämningstid måste vara mellan ${formatTime(dropoffHours.min)} och ${formatTime(dropoffHours.max)} den ${formatDate(endDate)}`);
                      onDropoffTimeValidationChange?.(false);
                    } else {
                      setDropoffTimeError(null);
                      onDropoffTimeValidationChange?.(true);
                    }
                  } else {
                    setDropoffTimeError(null);
                    onDropoffTimeValidationChange?.(true);
                  }
                }}
                minValue={dropoffHours?.min ? (stringToTimeValue(dropoffHours.min) || undefined) : undefined}
                maxValue={dropoffHours?.max ? (stringToTimeValue(dropoffHours.max) || undefined) : undefined}
                hourCycle={24}
                granularity="minute"
                size="md"
                variant="bordered"
                isRequired={service && (service.min_advance_booking_hours || service.cancellation_rules) ? true : false}
                errorMessage={dropoffTimeError || undefined}
                helper={dropoffHours && !dropoffTimeError ? `Öppettider för lämning: ${dropoffHours.min.length > 5 ? dropoffHours.min.substring(0, 5) : dropoffHours.min} - ${dropoffHours.max.length > 5 ? dropoffHours.max.substring(0, 5) : dropoffHours.max}` : undefined}
              />
            </VStack>

            {/* Visa tillgänglighet för rentals */}
            {rentalAvailability && (
              <Card variant={rentalAvailability.available ? 'elevated' : 'outlined'}>
                <CardContent>
                  <VStack spacing="sm">
                    <HStack spacing="sm" align="center">
                      <Icon size="md" color={rentalAvailability.available ? 'success' : 'error'}>
                        {rentalAvailability.available ? <CheckIcon /> : <XMarkIcon />}
                      </Icon>
                      <Body weight="semibold" color={rentalAvailability.available ? 'success' : 'error'}>
                        {rentalAvailability.available ? 'Tillgängligt' : 'Inte tillgängligt'}
                      </Body>
                    </HStack>
                    <Body size="sm" color="secondary">
                      {rentalAvailability.message}
                    </Body>
                    {rentalAvailability.available_count !== undefined && rentalAvailability.available_count > 0 && resourceId && (
                      <Body size="sm" color="secondary" weight="medium">
                        {rentalAvailability.available_count} {rentalAvailability.available_count === 1 ? 'enhet tillgänglig' : 'enheter tillgängliga'} för denna resurs
                      </Body>
                    )}
                    {rentalAvailability.available_count !== undefined && rentalAvailability.available_count === 0 && resourceId && (
                      <Body size="sm" color="error" weight="medium">
                        Denna resurs är fullbokad för valt intervall
                      </Body>
                    )}
                  </VStack>
                </CardContent>
              </Card>
            )}
            
            {/* Varning om ingen resurs är vald för rentals */}
            {isRental && !resourceId && startDate && endDate && (
              <WarningAlert title="Välj en resurs">
                Du måste välja en resurs i nästa steg för att slutföra bokningen.
              </WarningAlert>
            )}

            {totalPrice !== undefined && totalPrice > 0 && rentalDays > 0 && servicePrice && servicePriceUnit && String(servicePriceUnit).trim() !== '' && (
              <Card variant="elevated">
                <CardContent>
                  <VStack spacing="xs">
                    <Body weight="semibold">Prisberäkning</Body>
                    <Body size="sm" color="secondary">
                      {servicePrice} kr/{servicePriceUnit === 'day' ? 'dag' : servicePriceUnit === 'week' ? 'vecka' : servicePriceUnit === 'month' ? 'månad' : servicePriceUnit}
                    </Body>
                    <Body weight="bold" size="lg" color="primary">
                      Totalt: {totalPrice} kr
                    </Body>
                  </VStack>
                </CardContent>
              </Card>
            )}
          </VStack>
        )}

      </VStack>
    );
  }

  // Appointment flow
  return (
    <VStack spacing="md">
      <WeekViewCalendar
        externalId={externalId}
        serviceId={serviceId}
        resourceId={resourceId}
        selectedDate={selectedDate}
            selectedTime={selectedTime}
        onDateChange={(date: string) => {
                onDateChange(date);
                onTimeChange(null);
                onAvailabilityChange(null);
              }}
        onTimeChange={(time: { start_time: string; end_time: string } | null) => {
                onTimeChange(time);
              }}
        onAvailabilityChange={onAvailabilityChange}
        onLoadingChange={onLoadingChange}
      />
    </VStack>
  );
}
