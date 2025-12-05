/**
 * WeekViewCalendar - Veckovy med tider direkt under varje dag
 * Använder endast blimpify-ui komponenter
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
  Spinner
} from '@blimpify-im/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../../../../lib/api/client';

const WEEKDAYS = ['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön'];
const MONTHS = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
];

interface WeekViewCalendarProps {
  userId: number;
  serviceId: number;
  resourceId?: number;
  selectedDate: string;
  selectedTime: { start_time: string; end_time: string } | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: { start_time: string; end_time: string } | null) => void;
  onAvailabilityChange: (availability: any) => void;
  onLoadingChange: (loading: boolean) => void;
}

interface DayAvailability {
  date: string;
  intervals: Array<{
    start_time: string;
    end_time: string;
    available?: boolean;
    past?: boolean;
    booked?: boolean;
    availableSpots?: number | null;
    capacityPerSlot?: number | null;
  }>;
}

export default function WeekViewCalendar({
  userId,
  serviceId,
  resourceId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onAvailabilityChange,
  onLoadingChange
}: WeekViewCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [weekAvailability, setWeekAvailability] = useState<Record<string, DayAvailability>>({});
  const [loadingWeek, setLoadingWeek] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const availabilityCacheRef = React.useRef<Record<string, { data: DayAvailability; timestamp: number }>>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minuter cache

  const today = useMemo(() => {
    const now = new Date();
    // Get date in local timezone, not UTC
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Get week days (Monday to Sunday)
  const getWeekDays = () => {
    const weekDays: Date[] = [];
    const monday = new Date(currentWeek);
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time to HH:MM
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  // Fetch availability for all days in the week with debouncing and abort support
  useEffect(() => {
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Get week days for this effect
    const weekDaysForFetch = getWeekDays();

    // Debounce the fetch
    const timeoutId = setTimeout(async () => {
      const fetchWeekAvailability = async () => {
        setLoadingWeek(true);
        const availabilityMap: Record<string, DayAvailability> = {};
        const now = Date.now();

        // Check cache first and filter out expired entries
        const cacheKey = `${userId}-${serviceId}-${resourceId || 'no-resource'}`;
        
        // Process dates sequentially with small delay to avoid rate limiting
        for (const date of weekDaysForFetch) {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            break;
          }

          const dateStr = formatDate(date);
          // Skip past dates completely
          if (dateStr < today) {
            continue;
          }

          // Check cache first
          const cacheEntry = availabilityCacheRef.current[`${cacheKey}-${dateStr}`];
          if (cacheEntry && (now - cacheEntry.timestamp) < CACHE_DURATION) {
            availabilityMap[dateStr] = cacheEntry.data;
            continue;
          }

          try {
            // Small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

            const resourceParam = resourceId ? `&resource_id=${resourceId}` : '';
            const response = await apiClient.get(
              `/labs/bookings/public/availability/v2?user_id=${userId}&service_id=${serviceId}&date=${dateStr}${resourceParam}`,
              {
                signal: abortController.signal
              }
            );

            // Check again if aborted after response
            if (abortController.signal.aborted) {
              break;
            }

            if (response.data.success) {
              const intervals = response.data.intervals || [];
              console.log(`[WeekViewCalendar] Availability for ${dateStr}:`, {
                intervalsCount: intervals.length,
                serviceId,
                resourceId,
                hasIntervals: intervals.length > 0
              });
              const dayData = {
                date: dateStr,
                intervals: intervals
              };
              availabilityMap[dateStr] = dayData;
              
              // Cache the result
              availabilityCacheRef.current[`${cacheKey}-${dateStr}`] = {
                data: dayData,
                timestamp: now
              };
            } else {
              console.warn(`[WeekViewCalendar] Availability returned success: false for ${dateStr}:`, response.data);
              // Sätt tomma intervals om API:et returnerar success: false
              const dayData = {
                date: dateStr,
                intervals: []
              };
              availabilityMap[dateStr] = dayData;
            }
          } catch (err: any) {
            // Don't log errors for aborted requests
            if (err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
              break;
            }
            // For rate limiting, use cached data if available
            if (err.response?.status === 429) {
              console.warn(`Rate limited for ${dateStr}, using cache if available`);
              if (cacheEntry) {
                availabilityMap[dateStr] = cacheEntry.data;
              }
              continue;
            }
            console.error(`Error fetching availability for ${dateStr}:`, err);
          }
        }
        
        // Only update state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setWeekAvailability(availabilityMap);
          setLoadingWeek(false);
        }
      };

      if (serviceId) {
        fetchWeekAvailability();
      }
    }, 500); // 500ms debounce för att ge mer tid mellan navigeringar

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId, serviceId, resourceId, currentWeek, today]);

  const handlePrevWeek = () => {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() - 7);
      return newWeek;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() + 7);
      return newWeek;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    if (dateStr >= today) {
      onDateChange(dateStr);
      onTimeChange(null);
    }
  };

  const handleTimeClick = (time: { start_time: string; end_time: string; past?: boolean }, dateStr: string) => {
    // Double check that date is not in the past
    if (dateStr < today) {
      return;
    }
    
    // Check if time is in the past for today
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isToday = dateStr === today;
    if (isToday && time.start_time < currentTime) {
      return;
    }
    
    // Check if time is marked as past
    if (time.past) {
      return;
    }
    
    onDateChange(dateStr);
    onTimeChange(time);
  };

  const isTimeSelected = (time: { start_time: string; end_time: string }, dateStr: string) => {
    if (!selectedTime || selectedDate !== dateStr) return false;
    return selectedTime.start_time === time.start_time && selectedTime.end_time === time.end_time;
  };

  // Get week range for display
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const formatWeekRange = () => {
    const startMonth = weekStart.getMonth() + 1;
    const endMonth = weekEnd.getMonth() + 1;
    if (startMonth === endMonth) {
      return `${weekStart.getDate()}-${weekEnd.getDate()} ${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
    }
    return `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} - ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]} ${weekStart.getFullYear()}`;
  };

  // Filter out past times and disabled times
  const filterPastTimes = (times: DayAvailability['intervals'], dateStr: string) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const isPastDate = dateStr < today;

    // If the date is in the past, return empty array
    if (isPastDate) {
      return [];
    }

    return times.filter(time => {
      // Filter out explicitly marked past times
      if (time.past) return false;
      // Filter out times that have passed today - be more strict
      if (isToday) {
        // Compare time strings directly
        if (time.start_time < currentTime) return false;
      }
      // Only return available times
      if (time.available === false) return false;
      // Filter out booked times
      if (time.booked) return false;
      return true;
    });
  };

  return (
    <VStack spacing="md" align="stretch">
      {/* Veckonavigering */}
      <HStack spacing="md" align="center" justify="between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevWeek}
          leftIcon={
            <Icon size="sm" color="primary">
              <ChevronLeftIcon />
            </Icon>
          }
        >
          Föregående
        </Button>
        <Body weight="semibold" size="md">
          {formatWeekRange()}
        </Body>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextWeek}
          rightIcon={
            <Icon size="sm" color="primary">
              <ChevronRightIcon />
            </Icon>
          }
        >
          Nästa
        </Button>
      </HStack>

      {loadingWeek ? (
        <VStack spacing="sm" align="center">
          <Spinner size="md" />
          <Body size="sm" color="secondary">Laddar tillgängliga tider...</Body>
        </VStack>
      ) : (
        <VStack spacing="md" align="stretch">
          {/* Veckodagar header - kompakt */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 'var(--foundation-space-md)',
            width: '100%',
            paddingBottom: 'var(--foundation-space-sm)',
            borderBottom: '1px solid var(--border-default)',
            paddingLeft: 0,
            paddingRight: 'var(--foundation-space-sm)'
          }}>
            {weekDays.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === today;
              const isPast = dateStr < today;
              const dayName = WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={isPast}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    padding: 'var(--foundation-space-sm)',
                    textAlign: 'center',
                    opacity: isPast ? 0.5 : 1,
                    borderBottom: isSelected ? '2px solid var(--accent-500)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <VStack spacing="xs" align="center">
                    <Body size="xs" weight="medium" color={isSelected ? 'accent' : 'secondary'}>
                      {dayName}
                    </Body>
                    <Body 
                      size="md" 
                      weight={isSelected || isToday ? 'bold' : 'semibold'}
                      color={isSelected ? 'accent' : isToday ? 'accent' : 'primary'}
                    >
                      {date.getDate()}
                    </Body>
                    {isToday && !isSelected && (
                      <Body size="xs" color="accent" weight="medium">
                        Idag
                      </Body>
                    )}
                  </VStack>
                </button>
              );
            })}
          </div>

          {/* Tider - huvudfokus med gemensam scroll */}
          <div
            style={{
              height: '500px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: 'var(--foundation-space-sm)'
            }}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: 'var(--foundation-space-md)',
              width: '100%',
              minWidth: '0',
              alignItems: 'start',
              paddingLeft: 0,
              paddingRight: 0
            }}>
              {weekDays.map((date) => {
                const dateStr = formatDate(date);
                const isSelected = selectedDate === dateStr;
                const isPast = dateStr < today;
                const dayAvailability = weekAvailability[dateStr];
                const availableTimes = dayAvailability ? filterPastTimes(dayAvailability.intervals, dateStr) : [];

                return (
                  <VStack
                    key={dateStr}
                    spacing="xs"
                    align="stretch"
                    style={{
                      opacity: isPast ? 0.5 : 1
                    }}
                  >
                    {!isPast && availableTimes.length > 0 ? (
                      availableTimes.map((time, timeIndex) => {
                        const isTimeSelectedState = isTimeSelected(time, dateStr);
                        const isFullyBooked = time.availableSpots !== null && time.availableSpots !== undefined && time.availableSpots === 0;
                        
                        // Double check if time is in the past (extra safety)
                        const now = new Date();
                        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        const isToday = dateStr === today;
                        const isTimePast = isToday && time.start_time < currentTime;
                        
                        // If time is past, don't render it at all
                        if (isTimePast || time.past) {
                          return null;
                        }
                        
                        const isTimeDisabled = !time.available || time.booked || isFullyBooked;

                        return (
                          <Button
                            key={`${time.start_time}-${time.end_time}-${timeIndex}`}
                            variant={isTimeSelectedState ? 'accent' : 'secondary'}
                            size="md"
                            onClick={() => {
                              if (!isTimeDisabled && !isPast && !isTimePast && !time.past) {
                                handleTimeClick(time, dateStr);
                              }
                            }}
                            disabled={isTimeDisabled || isPast || isTimePast || !!time.past}
                            style={{
                              width: '100%',
                              padding: 'var(--foundation-space-md)',
                              fontSize: 'var(--text-body-size-md)',
                              opacity: isTimeDisabled || isPast ? 0.4 : 1,
                              cursor: isTimeDisabled || isPast ? 'not-allowed' : 'pointer',
                              justifyContent: 'center',
                              fontWeight: isTimeSelectedState ? 600 : 500,
                              flexShrink: 0
                            }}
                          >
                            {formatTime(time.start_time)}
                          </Button>
                        );
                      }).filter(Boolean)
                    ) : !isPast ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '100px',
                          padding: 'var(--foundation-space-md)'
                        }}
                      >
                        <Body size="sm" color="secondary" align="center">
                          Inga tider
                        </Body>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '100px',
                          padding: 'var(--foundation-space-md)'
                        }}
                      >
                        <Body size="sm" color="tertiary" align="center">
                          Passerad
                        </Body>
                      </div>
                    )}
                  </VStack>
                );
              })}
            </div>
          </div>
        </VStack>
      )}
    </VStack>
  );
}

