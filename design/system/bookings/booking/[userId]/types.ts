/**
 * Types for booking wizard
 */

export interface Service {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  currency?: string;
  price_unit?: 'hour' | 'day' | 'week' | 'month' | 'fixed' | null; // För rentals
  active: boolean;
  requires_resource: boolean;
  can_book?: boolean;
  image_url?: string;
  cancellation_rules?: string;
  service_rules?: string;
  min_advance_booking_hours?: number;
  min_duration_minutes?: number; // För rentals
  max_duration_minutes?: number; // För rentals
  booking_type?: 'appointment' | 'rental'; // För att skilja services från categories
}

export interface Resource {
  id: number;
  name: string;
  description?: string;
  color?: string;
  image_url?: string;
  active?: boolean;
  capacity?: number | null; // Units för rentals
  pickup_hours?: Record<string | number, string[]> | null;
  dropoff_hours?: Record<string | number, string[]> | null;
  is_rental_item?: boolean;
  buffer_after_rental_hours?: number;
  status?: string;
  price?: number | null;
  price_unit?: 'hour' | 'day' | 'week' | 'month' | null;
}

export interface AvailabilityInterval {
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

export interface AvailabilityResponse {
  date: string;
  timezone: string;
  increment_minutes: number;
  remaining_capacity: number;
  slot_source: string;
  service: Service;
  intervals: AvailabilityInterval[];
}

export interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  service_id: number;
  resource_id?: number;
  booking_type: 'appointment' | 'rental';
  date?: string;
  start_time?: string;
  end_time?: string;
  start_datetime?: string;
  end_datetime?: string;
  pickup_time?: string; // För rentals
  dropoff_time?: string; // För rentals
  price?: number; // Totalt pris för rentals
}

export interface RentalAvailability {
  available: boolean;
  message: string;
  available_count?: number;
}
