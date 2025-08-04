// ===============================================
// src/design-system/components/primitives/Stepper/index.ts
// ENKEL STEPPER EXPORTS
// ===============================================

export {
  Stepper,
  type StepperProps,
  type Step
} from './Stepper';

// ===== ANVÄNDNINGSEXEMPEL =====
/*


const steps: Step[] = [
  {
    label: "Företagsinfo",
    description: "Berätta om ditt företag och vad ni gör"
  },
  {
    label: "Design", 
    description: "Välj designstil, färger och typsnitt"
  },
  {
    label: "Innehåll",
    description: "Bestäm vilka sidor och funktioner ni vill ha"
  },
  {
    label: "Bekräfta",
    description: "Granska och bekräfta din beställning"
  }
];

<Stepper
  steps={steps}
  currentStep={currentStep}
  onPrevious={() => setCurrentStep(prev => prev - 1)}
  onNext={() => setCurrentStep(prev => prev + 1)}
  previousLabel="Tillbaka"
  nextLabel="Nästa"
/>
*/