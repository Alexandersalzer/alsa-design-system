/**
 * BookingWizard - Main wizard component for booking flow
 * Handles step navigation and state management
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Stepper, type Step } from '@blimpify-im/ui';
import { VStack, Card, CardContent, ErrorAlert, WarningAlert, Body } from '@blimpify-im/ui';
import Step1ServiceSelection from './steps/Step1ServiceSelection';
import Step2ResourceSelection from './steps/Step2ResourceSelection';
import Step3DateTimeSelection from './steps/Step3DateTimeSelection';
import Step4ContactInformation from './steps/Step4ContactInformation';
import BookingSuccess from './BookingSuccess';
import type { Service, Resource, AvailabilityResponse, BookingFormData } from '../types';

interface BookingWizardProps {
  externalId: string;
  services: Service[];
  resourceTypes: Service[]; // Categories för rentals
  businessType: 'services' | 'rentals' | 'both';
  loadingServices: boolean;
  servicesError: string | null;
  imageErrors: Set<number>;
  onImageError: (serviceId: number) => void;
  onSubmit: (formData: BookingFormData) => Promise<any>;
  createdAppointment: any;
  success: boolean;
  submitting: boolean;
  error: string | null;
}

export default function BookingWizard({
  externalId,
  services,
  resourceTypes,
  businessType,
  loadingServices,
  servicesError,
  imageErrors,
  onImageError,
  onSubmit,
  createdAppointment,
  success,
  submitting,
  error
}: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [selectedResourceData, setSelectedResourceData] = useState<Resource | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<{ start_time: string; end_time: string } | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [pickupTime, setPickupTime] = useState<string>(''); // För rentals
  const [dropoffTime, setDropoffTime] = useState<string>(''); // För rentals
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [pickupTimeValid, setPickupTimeValid] = useState<boolean>(true);
  const [dropoffTimeValid, setDropoffTimeValid] = useState<boolean>(true);
  // Kombinera services och resourceTypes till en lista (måste definieras först)
  // VIKTIGT: resourceTypes är alltid kategorier (rentals), så markera dem som rentals
  // VIKTIGT: Använd inte allBookableItems för att identifiera om något är en kategori
  // Använd istället resourceTypes direkt när du behöver kolla om något är en kategori
  const allBookableItems = useMemo(() => {
    console.log('[BookingWizard] ===== BUILDING allBookableItems =====');
    console.log('[BookingWizard] businessType:', businessType);
    console.log('[BookingWizard] services count:', services.length);
    console.log('[BookingWizard] resourceTypes count:', resourceTypes.length);
    
    const items: Service[] = [];
    if (businessType === 'services' || businessType === 'both') {
      // Lägg till services med booking_type: 'appointment'
      const servicesToAdd = services
        .filter(s => s.can_book !== false)
        .map(s => ({
          ...s,
          booking_type: (s.booking_type || 'appointment') as 'appointment' | 'rental'
        }));
      console.log('[BookingWizard] Adding services:', servicesToAdd.map(s => ({
        id: s.id,
        name: s.name,
        booking_type: s.booking_type
      })));
      items.push(...servicesToAdd);
    }
    if (businessType === 'rentals' || businessType === 'both') {
      // Markera alla resourceTypes som rentals
      const rentalCategories = resourceTypes
        .filter(rt => rt.can_book !== false)
        .map(rt => ({
          ...rt,
          booking_type: 'rental' as const, // Tvinga booking_type till 'rental'
          requires_resource: true // Kategorier kräver alltid resurs
        }));
      console.log('[BookingWizard] Adding categories (resourceTypes):', rentalCategories.map(rt => ({
        id: rt.id,
        name: rt.name,
        booking_type: rt.booking_type
      })));
      items.push(...rentalCategories);
    }
    console.log('[BookingWizard] Total allBookableItems:', items.length);
    console.log('[BookingWizard] allBookableItems:', items.map(item => ({
      id: item.id,
      name: item.name,
      booking_type: item.booking_type,
      isCategory: resourceTypes.some(rt => rt.id === item.id)
    })));
    return items;
  }, [services, resourceTypes, businessType]);

  const selectedServiceData = useMemo(() => {
    if (!selectedService) return null;
    
    console.log('[BookingWizard] ===== IDENTIFYING selectedServiceData =====');
    console.log('[BookingWizard] selectedService ID:', selectedService);
    
    // Först kolla om det är en kategori (finns i resourceTypes)
    const category = resourceTypes.find(rt => rt.id === selectedService);
    if (category) {
      console.log('[BookingWizard] ✅ FOUND AS CATEGORY:', {
        id: category.id,
        name: category.name,
        booking_type: 'rental'
      });
      // Det är en kategori - returnera med booking_type: 'rental'
      return {
        ...category,
        booking_type: 'rental' as const,
        requires_resource: true
      };
    }
    // Annars är det en tjänst - hitta i services eller allBookableItems
    const service = services.find(s => s.id === selectedService);
    if (service) {
      console.log('[BookingWizard] ✅ FOUND AS SERVICE:', {
        id: service.id,
        name: service.name,
        booking_type: service.booking_type || 'appointment'
      });
      return {
        ...service,
        booking_type: service.booking_type || 'appointment' as const
      };
    }
    // Fallback: hitta i allBookableItems
    const fallback = allBookableItems.find(s => s.id === selectedService);
    console.log('[BookingWizard] ⚠️ FOUND IN FALLBACK (allBookableItems):', fallback ? {
      id: fallback.id,
      name: fallback.name,
      booking_type: fallback.booking_type
    } : null);
    return fallback || null;
  }, [selectedService, resourceTypes, services, allBookableItems]);

  // Determine if this is a rental based on booking_type or price_unit
  // VIKTIGT: Kategorier (från resourceTypes) är ALLTID rentals
  const isRental = useMemo(() => {
    if (!selectedServiceData) {
      console.log('[BookingWizard] isRental: false (no selectedServiceData)');
      return false;
    }
    
    console.log('[BookingWizard] ===== CHECKING isRental =====');
    console.log('[BookingWizard] selectedServiceData:', {
      id: selectedServiceData.id,
      name: selectedServiceData.name,
      booking_type: selectedServiceData.booking_type,
      price_unit: selectedServiceData.price_unit
    });
    
    // Först kolla booking_type
    if (selectedServiceData.booking_type === 'rental') {
      console.log('[BookingWizard] ✅ isRental: true (booking_type === rental)');
      return true;
    }
    if (selectedServiceData.booking_type === 'appointment') {
      console.log('[BookingWizard] ❌ isRental: false (booking_type === appointment)');
      return false;
    }
    // Kolla om det är en kategori (finns i resourceTypes)
    const isCategory = resourceTypes.some(rt => rt.id === selectedServiceData.id);
    if (isCategory) {
      console.log('[BookingWizard] ✅ isRental: true (found in resourceTypes - is category)');
      return true; // Kategorier är alltid rentals
    }
    // Fallback: kolla price_unit
    const priceUnit = selectedServiceData.price_unit;
    const result = priceUnit === 'day' || priceUnit === 'week' || priceUnit === 'month';
    console.log('[BookingWizard] isRental:', result, '(based on price_unit:', priceUnit, ')');
    return result;
  }, [selectedServiceData, resourceTypes]);

  const requiresResource = useMemo(() => {
    return selectedServiceData?.requires_resource === true;
  }, [selectedServiceData]);

  const [formData, setFormData] = useState<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    notes: string;
  }>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: ''
  });
  const [emailError, setEmailError] = useState<string | null>(null);

  // Check if we should skip service selection
  // VIKTIGT: Hoppa bara över om det bara finns EN kategori (rental), INTE om det bara finns en tjänst
  // Tjänster ska alltid visas även om det bara finns en
  const shouldSkipServiceSelection = useMemo(() => {
    // Om det bara finns ett item OCH det är en kategori (rental), hoppa över
    if (allBookableItems.length === 1) {
      const item = allBookableItems[0];
      const isCategory = resourceTypes.some(rt => rt.id === item.id);
      return isCategory; // Hoppa bara över om det är en kategori
    }
    return false;
  }, [allBookableItems, resourceTypes]);

  // Auto-select single item on mount (endast för kategorier)
  useEffect(() => {
    if (shouldSkipServiceSelection && !selectedService && allBookableItems.length > 0) {
      const activeItem = allBookableItems[0];
      if (activeItem) {
        setSelectedService(activeItem.id);
        // För kategorier (rentals): gå direkt till datum/tid-steget (step 0 när service selection är hoppad över)
        // Eftersom shouldSkipServiceSelection bara är true för kategorier, vet vi att det är en kategori
        setCurrentStep(0); // Starta på datum/tid för kategorier
      }
    }
  }, [shouldSkipServiceSelection, allBookableItems, selectedService]);

  // Show steps based on whether service selection is skipped
  // VIKTIGT: shouldSkipServiceSelection är bara true för kategorier (rentals)
  const steps: Step[] = useMemo(() => {
    if (shouldSkipServiceSelection) {
      // Skip kategori step - show only: Datum/Tid, Resurs, Uppgifter (3 steps för kategorier)
      return [
        {
          label: '',
          description: ''
        },
        {
          label: '',
          description: '',
          disabled: !requiresResource
        },
        {
          label: '',
          description: ''
        }
      ];
    }
    // Show all 4 steps: Tjänst/Kategori, Resurs/Datum, Datum/Resurs, Uppgifter
    // Steg-ordningen beror på om det är rental eller service (hanteras i render)
    return [
      {
        label: '',
        description: ''
      },
      {
        label: '',
        description: '',
        disabled: !requiresResource && !isRental // För rentals är resurs alltid required
      },
      {
        label: '',
        description: ''
      },
      {
        label: '',
        description: ''
      }
    ];
  }, [requiresResource, isRental, shouldSkipServiceSelection]);

  // Reset dependent selections when service changes
  useEffect(() => {
    if (selectedService) {
      // Reset resource, date/time when service changes
      setSelectedResource(null);
      setSelectedResourceData(null);
      setSelectedDate('');
      setSelectedTime(null);
      setStartDate('');
      setEndDate('');
      setAvailability(null);
    }
  }, [selectedService]);

  // Ta bort auto-advance - låt användaren klicka på "Nästa" manuellt


  // Auto-skip resource step if not required (endast för services, inte rentals)
  useEffect(() => {
    // If we're on step 1 (resource) and it's disabled, skip to step 2
    // Men inte för rentals - rentals kräver alltid resurs
    if (currentStep === 1 && !requiresResource && !isRental) {
      setCurrentStep(2);
    }
  }, [currentStep, requiresResource, isRental]);

  // Calculate next button disabled state
  const isNextDisabled = useMemo(() => {
    // VIKTIGT: För rentals (kategorier): Kategori → Datum/Tid → Resurs → Kontaktuppgifter
    // För services: Tjänst → Resurs → Datum/Tid → Kontaktuppgifter
    const resourceStepIndex = shouldSkipServiceSelection 
      ? (isRental ? 1 : 0)  // För rentals: step 1 (efter datum/tid), för services: step 0
      : (isRental ? 2 : 1); // För rentals: step 2 (efter datum/tid), för services: step 1 (efter tjänst)
    const dateTimeStepIndex = shouldSkipServiceSelection 
      ? (isRental ? 0 : 1)  // För rentals: step 0 (efter kategori), för services: step 1
      : (isRental ? 1 : 2); // För rentals: step 1 (efter kategori), för services: step 2 (efter resurs)
    const contactStepIndex = shouldSkipServiceSelection ? 2 : 3;

    if (!shouldSkipServiceSelection && currentStep === 0) {
      // Step 0: Service/Kategori selection (endast om inte hoppad över)
      return !selectedService;
    }
    
    if (currentStep === dateTimeStepIndex) {
      // Date/time selection step
      if (isRental) {
        // För rentals: kräv datum (resurs väljs efter datum/tid)
        if (!startDate || !endDate) {
          return true; // Disable next if dates are missing
        }
        
        // Om tider är obligatoriska (pga regler), kräv att de är ifyllda och validerade
        const timesRequired = selectedServiceData && (selectedServiceData.min_advance_booking_hours || selectedServiceData.cancellation_rules);
        if (timesRequired) {
          if (!pickupTime || !pickupTimeValid) {
            return true; // Disable next if pickup time is required but missing or invalid
          }
          if (!dropoffTime || !dropoffTimeValid) {
            return true; // Disable next if dropoff time is required but missing or invalid
          }
        } else {
          // Om tider inte är obligatoriska, validera bara om de är ifyllda
          if (pickupTime && !pickupTimeValid) {
            return true; // Disable next if pickup time is invalid
          }
          if (dropoffTime && !dropoffTimeValid) {
            return true; // Disable next if dropoff time is invalid
          }
        }
        return false; // Can proceed
      } else {
        return !selectedDate || !selectedTime;
      }
    }

    if (currentStep === resourceStepIndex) {
      // Resource selection step
      if (!requiresResource) {
        return false; // Can always proceed if resource not required
      }
      return !selectedResource;
    }

    if (currentStep === contactStepIndex) {
      // Contact information step
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !formData.customer_name.trim() || 
             !formData.customer_email.trim() || 
             !emailRegex.test(formData.customer_email.trim()) ||
             !!emailError;
    }

    return false;
  }, [currentStep, selectedService, selectedResource, selectedResourceData, requiresResource, isRental, 
      selectedDate, selectedTime, startDate, endDate, pickupTime, dropoffTime, pickupTimeValid, dropoffTimeValid, formData, emailError, shouldSkipServiceSelection]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (shouldSkipServiceSelection) {
        // When service selection is skipped
        if (isRental) {
          // Rentals: Datum(0), Resurs(1), Uppgifter(2)
          setCurrentStep(prev => prev - 1);
        } else {
          // Services: Resurs(0), Datum(1), Uppgifter(2)
          // If going back from date/time step and resource step is disabled, skip it
          if (currentStep === 1 && !requiresResource) {
            // Can't go back further than step 0 (resource) when service is auto-selected
            return;
          }
          setCurrentStep(prev => prev - 1);
        }
      } else {
        // Normal flow
        if (isRental) {
          // Rentals: Kategori(0), Datum/Tid(1), Resurs(2), Uppgifter(3)
          setCurrentStep(prev => prev - 1);
        } else {
          // Services: Tjänst(0), Resurs(1), Datum(2), Uppgifter(3)
          // If going back from step 2 (date/time) and resource step is disabled, skip to step 0
          if (currentStep === 2 && !requiresResource) {
            setCurrentStep(0);
          } else {
            setCurrentStep(prev => prev - 1);
          }
        }
      }
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Last step - submit booking
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.customer_name.trim() || 
          !formData.customer_email.trim() || 
          !emailRegex.test(formData.customer_email.trim())) {
        setEmailError('Ange en giltig e-postadress');
        return;
      }

      // Calculate total price for rentals
      // Räknar antal dygn baserat på 24-timmarsperioder från upphämtningstidpunkten
      let totalPrice: number | undefined = undefined;
      if (isRental && selectedServiceData?.price && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Kontrollera att datum är giltiga
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          totalPrice = undefined;
        } else {
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
          
          const pricePerUnit = selectedServiceData.price;
          const priceUnit = selectedServiceData.price_unit;
          
          if (priceUnit === 'day') {
            totalPrice = rentalDays * pricePerUnit;
          } else if (priceUnit === 'week') {
            const weeks = Math.ceil(rentalDays / 7);
            totalPrice = weeks * pricePerUnit;
          } else if (priceUnit === 'month') {
            const months = Math.ceil(rentalDays / 30);
            totalPrice = months * pricePerUnit;
          } else {
            totalPrice = pricePerUnit; // fixed price
          }
        }
      }

      // För rentals: skapa ISO-datetime med timezone
      let startDatetime: string | undefined;
      let endDatetime: string | undefined;
      if (isRental && startDate && endDate) {
        // Använd faktiska tider om de är satta, annars använd standardtider
        // Men validera bara om tiderna faktiskt är satta (inte tomma strängar)
        const actualPickupTime = pickupTime && pickupTime.trim() ? pickupTime : '09:00';
        const actualDropoffTime = dropoffTime && dropoffTime.trim() ? dropoffTime : '17:00';
        
        // Kombinera datum och tid till ISO-format med timezone
        const startDateTime = new Date(`${startDate}T${actualPickupTime}:00`);
        const endDateTime = new Date(`${endDate}T${actualDropoffTime}:00`);
        
        // Validera att datum är korrekta
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          throw new Error('Ogiltiga datum eller tider');
        }
        
        // Validera att tiderna inte är i det förflutna
        const now = new Date();
        if (startDateTime < now) {
          throw new Error('Hämtningsdatum och tid kan inte vara i det förflutna');
        }
        if (endDateTime < now) {
          throw new Error('Lämningsdatum och tid kan inte vara i det förflutna');
        }
        
        // Validera att end_datetime är efter start_datetime
        if (endDateTime <= startDateTime) {
          throw new Error('Lämningstid måste vara efter hämtningstid');
        }
        
        startDatetime = startDateTime.toISOString();
        endDatetime = endDateTime.toISOString();
      }

      const bookingData: BookingFormData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        notes: formData.notes,
        service_id: selectedService!,
        resource_id: selectedResource || undefined,
        booking_type: isRental ? 'rental' : 'appointment',
        date: isRental ? undefined : selectedDate,
        start_time: isRental ? undefined : selectedTime?.start_time,
        end_time: isRental ? undefined : selectedTime?.end_time,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        pickup_time: isRental ? pickupTime : undefined,
        dropoff_time: isRental ? dropoffTime : undefined,
        price: totalPrice
      };

      await onSubmit(bookingData);
    } else {
      if (shouldSkipServiceSelection) {
        // When service selection is skipped
        if (isRental) {
          // Rentals: Datum(0), Resurs(1), Uppgifter(2)
          setCurrentStep(prev => prev + 1);
        } else {
          // Services: Resurs(0), Datum(1), Uppgifter(2)
          // Auto-skip resource step if not required
          if (currentStep === 0 && !requiresResource) {
            setCurrentStep(1); // Skip directly to date/time step
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }
      } else {
        // Normal flow
        if (isRental) {
          // Rentals: Kategori(0), Datum/Tid(1), Resurs(2), Uppgifter(3)
          setCurrentStep(prev => prev + 1);
        } else {
          // Services: Tjänst(0), Resurs(1), Datum(2), Uppgifter(3)
          // Auto-skip resource step if not required
          if (currentStep === 1 && !requiresResource) {
            setCurrentStep(2); // Skip directly to step 2 (date/time)
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Don't allow clicking on disabled steps
    if (steps[stepIndex]?.disabled) {
      return;
    }
    // Only allow clicking on completed steps or current step
    if (stepIndex <= currentStep) {
      // För rentals: Kategori(0), Datum/Tid(1), Resurs(2), Uppgifter(3)
      // För services: Tjänst(0), Resurs(1), Datum(2), Uppgifter(3)
      if (isRental) {
        // För rentals: tillåt alltid att klicka på steg
        setCurrentStep(stepIndex);
      } else {
        // För services: If trying to go to step 1 (resurs) and it's disabled, go to step 2 instead
        if (stepIndex === 1 && !requiresResource) {
          setCurrentStep(2);
        } else {
          setCurrentStep(stepIndex);
        }
      }
    }
  };

  // Show success screen
  if (success && createdAppointment) {
    return (
      <BookingSuccess
        appointment={createdAppointment}
        service={selectedServiceData}
        externalId={externalId}
      />
    );
  }

  // Show error if services failed to load
  if (servicesError && services.length === 0) {
    return (
      <Card>
        <CardContent>
          <ErrorAlert title="Kunde inte ladda tjänster">
            {servicesError}
          </ErrorAlert>
        </CardContent>
      </Card>
    );
  }

  return (
    <VStack spacing="lg" align="stretch">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onPrevious={handlePrevious}
        onNext={handleNext}
        nextDisabled={isNextDisabled || submitting}
        nextLabel={currentStep === steps.length - 1 ? 'Bekräfta bokning' : 'Nästa'}
        onStepClick={handleStepClick}
        sticky
        stickyOffset="0"
        variant="compact"
      />

      {(() => {
        // VIKTIGT: För rentals (kategorier): Kategori → Datum/Tid → Resurs → Kontaktuppgifter
        // För services: Tjänst → Resurs → Datum/Tid → Kontaktuppgifter
        const resourceStepIndex = shouldSkipServiceSelection 
          ? (isRental ? 1 : 0)  // För rentals: step 1 (efter datum/tid), för services: step 0
          : (isRental ? 2 : 1); // För rentals: step 2 (efter datum/tid), för services: step 1 (efter tjänst)
        const dateTimeStepIndex = shouldSkipServiceSelection 
          ? (isRental ? 0 : 1)  // För rentals: step 0 (efter kategori), för services: step 1
          : (isRental ? 1 : 2); // För rentals: step 1 (efter kategori), för services: step 2 (efter resurs)

        // Bygg stepTexts baserat på faktisk steg-ordning
        let stepTexts: string[];
        if (shouldSkipServiceSelection) {
          if (isRental) {
            // Rentals: Datum(0), Resurs(1), Uppgifter(2)
            stepTexts = [
              'Välj start- och slutdatum för din bokning',
              requiresResource ? 'Välj resurs. Klicka på en resurs för att markera den.' : 'Resurs hoppas över',
              'Ange dina kontaktuppgifter för att slutföra bokningen'
            ];
          } else {
            // Services: Resurs(0), Datum(1), Uppgifter(2)
            stepTexts = [
              requiresResource ? 'Välj resurs. Klicka på en resurs för att markera den.' : 'Resurs hoppas över',
              'Välj datum och tid för din bokning',
              'Ange dina kontaktuppgifter för att slutföra bokningen'
            ];
          }
        } else {
          if (isRental) {
            // Rentals: Kategori(0), Datum/Tid(1), Resurs(2), Uppgifter(3)
            stepTexts = [
              'Välj kategori',
              'Välj start- och slutdatum för din bokning',
              requiresResource ? 'Välj resurs. Klicka på en resurs för att markera den.' : 'Resurs hoppas över',
              'Ange dina kontaktuppgifter för att slutföra bokningen'
            ];
          } else {
            // Services: Tjänst(0), Resurs(1), Datum(2), Uppgifter(3)
            stepTexts = [
              'Välj vilken tjänst du vill boka',
              requiresResource ? 'Välj resurs. Klicka på en resurs för att markera den.' : 'Resurs hoppas över',
              'Välj datum och tid för din bokning',
              'Ange dina kontaktuppgifter för att slutföra bokningen'
            ];
          }
        }

        return (
          <Body weight="semibold" size="lg" align="center" color="primary" style={{ marginTop: 'var(--foundation-space-md)', marginBottom: 'var(--foundation-space-lg)' }}>
            {stepTexts[currentStep]}
          </Body>
        );
      })()}

      {error && (
        <WarningAlert>
          {error}
        </WarningAlert>
      )}

      <Card style={{ marginTop: 'var(--foundation-space-xl)' }}>
        <CardContent>
          {!shouldSkipServiceSelection && currentStep === 0 && (
            <Step1ServiceSelection
              services={businessType === 'services' || businessType === 'both' ? services : []}
              resourceTypes={businessType === 'rentals' || businessType === 'both' ? resourceTypes : []}
              businessType={businessType}
              allBookableItems={allBookableItems}
              selectedService={selectedService}
              onServiceSelect={(serviceId) => {
                const previousService = selectedService;
                setSelectedService(serviceId);
                // Reset all dependent state when service changes
                if (serviceId && serviceId !== previousService) {
                  setSelectedResource(null);
                  setSelectedDate('');
                  setSelectedTime(null);
                  setStartDate('');
                  setEndDate('');
                  setAvailability(null);
                } else if (!serviceId) {
                  // If deselecting service, reset everything
                  setSelectedResource(null);
                  setSelectedDate('');
                  setSelectedTime(null);
                  setStartDate('');
                  setEndDate('');
                  setAvailability(null);
                }
              }}
              loadingServices={loadingServices}
              imageErrors={imageErrors}
              onImageError={onImageError}
            />
          )}

          {(() => {
            // VIKTIGT: För rentals (kategorier): Kategori → Datum/Tid → Resurs → Kontaktuppgifter
            // För services: Tjänst → Resurs → Datum/Tid → Kontaktuppgifter
            const resourceStepIndex = shouldSkipServiceSelection 
              ? (isRental ? 1 : 0)  // För rentals: step 1 (efter datum/tid), för services: step 0
              : (isRental ? 2 : 1); // För rentals: step 2 (efter datum/tid), för services: step 1 (efter tjänst)
            const dateTimeStepIndex = shouldSkipServiceSelection 
              ? (isRental ? 0 : 1)  // För rentals: step 0 (efter kategori), för services: step 1
              : (isRental ? 1 : 2); // För rentals: step 1 (efter kategori), för services: step 2 (efter resurs)
            const contactStepIndex = shouldSkipServiceSelection ? 2 : 3;

            return (
              <>
                {currentStep === resourceStepIndex && requiresResource && selectedService && (
                  <Step2ResourceSelection
                    externalId={externalId}
                    serviceId={selectedService}
                    selectedResource={selectedResource}
                    onResourceSelect={setSelectedResource}
                    onResourceDataChange={setSelectedResourceData}
                    onAvailabilityChange={setAvailability}
                    isRental={isRental}
                    servicePrice={selectedServiceData?.price}
                    servicePriceUnit={selectedServiceData?.price_unit || undefined}
                    // För rentals: visa alla resurser för kategorin (startDate/endDate behövs inte för att visa resurser)
                    startDate={undefined} // För rentals: visa alla resurser först, datum väljs senare
                    endDate={undefined} // För rentals: visa alla resurser först, datum väljs senare
                    pickupTime={isRental ? pickupTime : undefined}
                    dropoffTime={isRental ? dropoffTime : undefined}
                  />
                )}

                {currentStep === resourceStepIndex && !requiresResource && selectedService && (
                  <Body size="sm" color="secondary" align="center">
                    Resurs hoppas över för denna tjänst
                  </Body>
                )}

                {currentStep === dateTimeStepIndex && selectedService && (
                  <Step3DateTimeSelection
                    externalId={externalId}
                    serviceId={selectedService}
                    resourceId={isRental ? (selectedResource || undefined) : (selectedResource || undefined)}
                    isRental={isRental}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    startDate={startDate}
                    endDate={endDate}
                    startTime={startTime}
                    endTime={endTime}
                    pickupTime={pickupTime}
                    dropoffTime={dropoffTime}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onStartTimeChange={setStartTime}
                    onEndTimeChange={setEndTime}
                    onPickupTimeChange={setPickupTime}
                    onDropoffTimeChange={setDropoffTime}
                    service={selectedServiceData ? { 
                      min_advance_booking_hours: selectedServiceData.min_advance_booking_hours,
                      cancellation_rules: selectedServiceData.cancellation_rules 
                    } : null}
                    availability={availability}
                    loadingAvailability={loadingAvailability}
                    onAvailabilityChange={setAvailability}
                    onLoadingChange={setLoadingAvailability}
                    servicePrice={selectedServiceData?.price}
                    servicePriceUnit={selectedServiceData?.price_unit || undefined}
                    selectedResource={isRental ? selectedResourceData : null}
                    onPickupTimeValidationChange={setPickupTimeValid}
                    onDropoffTimeValidationChange={setDropoffTimeValid}
                  />
                )}

                {currentStep === contactStepIndex && selectedService && (
                  <Step4ContactInformation
                    formData={formData}
                    onFormDataChange={setFormData}
                    emailError={emailError}
                    onEmailErrorChange={setEmailError}
                    service={selectedServiceData}
                    isRental={isRental}
                    startDate={startDate}
                    endDate={endDate}
                    pickupTime={pickupTime}
                    dropoffTime={dropoffTime}
                    selectedResource={selectedResourceData ? {
                      name: selectedResourceData.name,
                      price: (selectedResourceData as any).price !== undefined && (selectedResourceData as any).price !== null ? Number((selectedResourceData as any).price) : undefined,
                      price_unit: (selectedResourceData as any).price_unit && String((selectedResourceData as any).price_unit).trim() !== '' ? String((selectedResourceData as any).price_unit).trim() : undefined
                    } : null}
                  />
                )}

                {!selectedService && currentStep > 0 && (
                  <Body size="sm" color="secondary" align="center">
                    Välj en tjänst för att fortsätta
                  </Body>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>
    </VStack>
  );
}

