// ===============================================
// blimpify-ui/design/system/components/forms/BookingForm/BookingForm.tsx
// BOOKING FORM - Reusable multi-step booking/contact form
// ===============================================

import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { SelectionCard } from '../../actions/SelectionCard/SelectionCard';
import { Input } from '../Input/Input';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimeInput } from '../TimeInput/TimeInput';
import Button from '../../actions/Button/Button';
import './BookingForm.css';

// ===============================================
// TYPES
// ===============================================

export interface BookingPackage {
  id: string;
  label: string;
  price: string;
  description?: string;
}

export interface QuickOption {
  label: string;
  value: string;
}

export interface BookingFormData {
  packageId: string;
  date: string;
  time: string;
  name: string;
  address: string;
  phone: string;
  doorCode: string;
}

export interface BookingFormProps {
  // Step 1: Package
  packageTitle?: string;
  packageCaption?: string;
  packages?: BookingPackage[];

  // Step 2: Date & Time
  dateTitle?: string;
  quickDates?: QuickOption[];
  timeTitle?: string;
  quickTimes?: QuickOption[];

  // Step 3: Details
  detailsTitle?: string;
  submitLabel?: string;

  // Progress bar
  stepLabels?: [string, string, string];

  // Callbacks
  onSubmit?: (data: BookingFormData) => void;

  className?: string;
}

// ===============================================
// DEFAULT PROPS
// ===============================================

const defaultPackages: BookingPackage[] = [
  { id: 'pkg_4', label: '4 knivar', price: '480 kr' },
  { id: 'pkg_5_7', label: '5–7 knivar', price: '600–840 kr' },
  { id: 'pkg_8plus', label: '8+ knivar', price: '960 kr+', description: '120 kr per kniv' },
];

const defaultQuickTimes: QuickOption[] = [
  { label: '08:00', value: '08:00' },
  { label: '10:00', value: '10:00' },
  { label: '12:00', value: '12:00' },
  { label: '14:00', value: '14:00' },
];

function getDefaultQuickDates(): QuickOption[] {
  const dates: QuickOption[] = [];
  const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const today = new Date();
  for (let i = 1; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    const value = d.toISOString().split('T')[0];
    dates.push({ label, value });
  }
  return dates;
}

// ===============================================
// STEP INDICATOR
// ===============================================

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: [string, string, string];
}

function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="booking-form__stepper" aria-label="Bokningssteg">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="booking-form__step">
              <div
                className={cn(
                  'booking-form__step-circle',
                  isCompleted && 'booking-form__step-circle--completed',
                  isActive && 'booking-form__step-circle--active'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span className={cn(
                'booking-form__step-label',
                isActive && 'booking-form__step-label--active'
              )}>
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={cn(
                'booking-form__step-line',
                isCompleted && 'booking-form__step-line--completed'
              )} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export const BookingForm = ({
  packageTitle = 'Hur många knivar vill du slipa?',
  packageCaption = '120 kr per kniv · Minimum 4 knivar per bokning',
  packages = defaultPackages,
  dateTitle = 'Välj datum',
  quickDates,
  timeTitle = 'Välj tid',
  quickTimes = defaultQuickTimes,
  detailsTitle = 'Dina uppgifter',
  submitLabel = 'Betala på plats',
  stepLabels = ['Paket', 'Datum & tid', 'Uppgifter'],
  onSubmit,
  className,
}: BookingFormProps) => {
  const resolvedQuickDates = quickDates || getDefaultQuickDates();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [doorCode, setDoorCode] = useState('');

  const canGoNext1 = selectedPackage !== '';
  const canGoNext2 = selectedDate !== '' && selectedTime !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      packageId: selectedPackage,
      date: selectedDate,
      time: selectedTime,
      name,
      address,
      phone,
      doorCode,
    });
  };

  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  return (
    <div className={cn('booking-form', className)}>
      <StepIndicator
        currentStep={currentStep}
        totalSteps={3}
        labels={stepLabels}
      />

      <form onSubmit={handleSubmit} className="booking-form__form" noValidate>

        {/* ── STEP 1: Package ── */}
        {currentStep === 1 && (
          <div className="booking-form__step-content">
            <h3 className="booking-form__step-title">{packageTitle}</h3>

            <div className="booking-form__packages">
              {packages.map((pkg) => (
                <SelectionCard
                  key={pkg.id}
                  selected={selectedPackage === pkg.id}
                  onChange={() => setSelectedPackage(pkg.id)}
                  indicator="radio"
                  orientation="horizontal"
                  size="md"
                  variant={selectedPackage === pkg.id ? 'accent' : 'neutral'}
                  className="booking-form__package-card"
                >
                  <div className="booking-form__package-info">
                    <span className="booking-form__package-label">{pkg.label}</span>
                    {pkg.description && (
                      <span className="booking-form__package-desc">{pkg.description}</span>
                    )}
                  </div>
                  <span className="booking-form__package-price">{pkg.price}</span>
                </SelectionCard>
              ))}
            </div>

            {packageCaption && (
              <p className="booking-form__caption">{packageCaption}</p>
            )}

            <div className="booking-form__button-row booking-form__button-row--end">
              <Button
                variant="primary"
                size="md"
                disabled={!canGoNext1}
                onClick={() => setCurrentStep(2)}
                type="button"
              >
                Nästa
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Date & Time ── */}
        {currentStep === 2 && (
          <div className="booking-form__step-content">
            <h3 className="booking-form__step-title">{dateTitle}</h3>

            <div className="booking-form__quick-options">
              {resolvedQuickDates.map((d) => (
                <SelectionCard
                  key={d.value}
                  selected={selectedDate === d.value}
                  onChange={() => setSelectedDate(d.value)}
                  indicator="none"
                  orientation="vertical"
                  size="sm"
                  variant={selectedDate === d.value ? 'accent' : 'neutral'}
                  className="booking-form__quick-card"
                >
                  <span className="booking-form__quick-label">{d.label}</span>
                </SelectionCard>
              ))}
            </div>

            <DatePicker
              label="Välj annat datum"
              size="md"
              variant="bordered"
              onChange={(val) => {
                if (val) {
                  const iso = `${val.year}-${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}`;
                  setSelectedDate(iso);
                }
              }}
            />

            <h3 className="booking-form__step-title" style={{ marginTop: 'var(--foundation-space-6)' }}>{timeTitle}</h3>

            <div className="booking-form__quick-options">
              {quickTimes.map((t) => (
                <SelectionCard
                  key={t.value}
                  selected={selectedTime === t.value}
                  onChange={() => setSelectedTime(t.value)}
                  indicator="none"
                  orientation="vertical"
                  size="sm"
                  variant={selectedTime === t.value ? 'accent' : 'neutral'}
                  className="booking-form__quick-card"
                >
                  <span className="booking-form__quick-label">{t.label}</span>
                </SelectionCard>
              ))}
            </div>

            <TimeInput
              label="Välj annan tid"
              size="md"
              variant="bordered"
              granularity="minute"
              hourCycle={24}
              onChange={(val) => {
                if (val) {
                  const h = String(val.hour).padStart(2, '0');
                  const m = String(val.minute).padStart(2, '0');
                  setSelectedTime(`${h}:${m}`);
                }
              }}
            />

            <div className="booking-form__button-row">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(1)}
                type="button"
              >
                Tillbaka
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!canGoNext2}
                onClick={() => setCurrentStep(3)}
                type="button"
              >
                Nästa
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Details ── */}
        {currentStep === 3 && (
          <div className="booking-form__step-content">
            <h3 className="booking-form__step-title">{detailsTitle}</h3>

            <div className="booking-form__fields">
              <Input
                label="Namn"
                required
                size="md"
                variant="bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <Input
                label="Adress"
                required
                size="md"
                variant="bordered"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
              <Input
                label="Telefon"
                required
                size="md"
                variant="bordered"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
              <Input
                label="Portkod (valfritt)"
                size="md"
                variant="bordered"
                value={doorCode}
                onChange={(e) => setDoorCode(e.target.value)}
                fullWidth
              />
            </div>

            {selectedPackageData && (
              <div className="booking-form__review">
                <p className="booking-form__review-title">Granska bokning</p>
                <div className="booking-form__review-row">
                  <span>Paket</span>
                  <span>{selectedPackageData.label} — {selectedPackageData.price}</span>
                </div>
                {selectedDate && (
                  <div className="booking-form__review-row">
                    <span>Datum</span>
                    <span>{selectedDate}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="booking-form__review-row">
                    <span>Tid</span>
                    <span>{selectedTime}</span>
                  </div>
                )}
              </div>
            )}

            <div className="booking-form__button-row">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(2)}
                type="button"
              >
                Tillbaka
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={!name || !address || !phone}
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

BookingForm.displayName = 'BookingForm';
