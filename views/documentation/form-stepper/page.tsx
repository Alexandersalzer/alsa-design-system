"use client";

import React from 'react';
import { Box, VStack, Body, Input, SelectionCard } from '../../../design/index';
import { FormStepper, FormStep } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function FormStepperPage() {
  return (
    <ComponentDocPage
      componentName="Form Stepper"
      description="Universal multi-step form layout component. Manages step navigation and the progress bar — any content can go inside each FormStep."
      importStatement={`import { FormStepper, FormStep } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Wrap FormStep children inside FormStepper. Step labels and navigation labels are configurable.',
          preview: (
            <Box>
              <FormStepper
                stepLabels={['Info', 'Details', 'Confirm']}
                nextLabel="Next"
                backLabel="Back"
                submitLabel="Submit"
              >
                <FormStep stepKey="info" label="Info" index={0}>
                  <VStack spacing="md">
                    <Body>Step 1 — fill in your information.</Body>
                    <Input label="Full name" size="md" variant="bordered" fullWidth />
                    <Input label="Email" type="email" size="md" variant="bordered" fullWidth />
                  </VStack>
                </FormStep>
                <FormStep stepKey="details" label="Details" index={1}>
                  <VStack spacing="md">
                    <Body>Step 2 — add some details.</Body>
                    <Input label="Phone" type="tel" size="md" variant="bordered" fullWidth />
                    <Input label="Address" size="md" variant="bordered" fullWidth />
                  </VStack>
                </FormStep>
                <FormStep stepKey="confirm" label="Confirm" index={2}>
                  <VStack spacing="md">
                    <Body>Step 3 — review and submit.</Body>
                    <Body color="secondary">All your information looks good. Click Submit to continue.</Body>
                  </VStack>
                </FormStep>
              </FormStepper>
            </Box>
          ),
          code: `import { FormStepper, FormStep, Input, VStack } from '../../../design/index';

<FormStepper
  stepLabels={['Info', 'Details', 'Confirm']}
  nextLabel="Next"
  backLabel="Back"
  submitLabel="Submit"
>
  <FormStep stepKey="info" label="Info">
    <VStack spacing="md">
      <Input label="Full name" size="md" variant="bordered" fullWidth />
      <Input label="Email" type="email" size="md" variant="bordered" fullWidth />
    </VStack>
  </FormStep>
  <FormStep stepKey="details" label="Details">
    <VStack spacing="md">
      <Input label="Phone" type="tel" size="md" variant="bordered" fullWidth />
      <Input label="Address" size="md" variant="bordered" fullWidth />
    </VStack>
  </FormStep>
  <FormStep stepKey="confirm" label="Confirm">
    <Body>Review and submit.</Body>
  </FormStep>
</FormStepper>`,
        },

        {
          title: 'Card variant',
          description: 'Use variant="card" to wrap the stepper in a raised card surface.',
          preview: (
            <Box padding="lg">
              <FormStepper
                stepLabels={['Paket', 'Datum & tid', 'Uppgifter']}
                nextLabel="Nästa"
                backLabel="Tillbaka"
                submitLabel="Betala på plats"
                variant="card"
                maxWidth="md"
              >
                <FormStep stepKey="pkg" label="Paket" index={0}>
                  <VStack spacing="sm">
                    <Body weight="medium">Hur många knivar vill du slipa?</Body>
                    <SelectionCard indicator="radio" orientation="horizontal" size="md" variant="neutral" selected={false} onChange={() => {}}>
                      <span>4 knivar</span>
                      <span style={{ marginLeft: 'auto' }}>480 kr</span>
                    </SelectionCard>
                    <SelectionCard indicator="radio" orientation="horizontal" size="md" variant="neutral" selected={false} onChange={() => {}}>
                      <span>5–7 knivar</span>
                      <span style={{ marginLeft: 'auto' }}>600–840 kr</span>
                    </SelectionCard>
                  </VStack>
                </FormStep>
                <FormStep stepKey="datetime" label="Datum & tid" index={1}>
                  <Body>Välj datum och tid.</Body>
                </FormStep>
                <FormStep stepKey="details" label="Uppgifter" index={2}>
                  <VStack spacing="sm">
                    <Input label="Namn" required size="md" variant="bordered" fullWidth />
                    <Input label="Telefon" type="tel" required size="md" variant="bordered" fullWidth />
                  </VStack>
                </FormStep>
              </FormStepper>
            </Box>
          ),
          code: `<FormStepper
  stepLabels={['Paket', 'Datum & tid', 'Uppgifter']}
  nextLabel="Nästa"
  backLabel="Tillbaka"
  submitLabel="Betala på plats"
  variant="card"
  maxWidth="md"
>
  <FormStep stepKey="pkg" label="Paket">
    {/* any content here */}
  </FormStep>
  <FormStep stepKey="datetime" label="Datum & tid">
    {/* date + time pickers */}
  </FormStep>
  <FormStep stepKey="details" label="Uppgifter">
    <Input label="Namn" required />
    <Input label="Telefon" type="tel" required />
  </FormStep>
</FormStepper>`,
        },

        {
          title: 'Two steps',
          description: 'Works with any number of steps — progress bar and buttons adapt automatically.',
          preview: (
            <Box>
              <FormStepper
                stepLabels={['Choose', 'Confirm']}
                nextLabel="Continue"
                backLabel="Go back"
                submitLabel="Done"
                maxWidth="md"
              >
                <FormStep stepKey="choose" label="Choose" index={0}>
                  <Body>Step 1 of 2</Body>
                </FormStep>
                <FormStep stepKey="confirm" label="Confirm" index={1}>
                  <Body>Step 2 of 2 — submit button appears below.</Body>
                </FormStep>
              </FormStepper>
            </Box>
          ),
          code: `<FormStepper
  stepLabels={['Choose', 'Confirm']}
  nextLabel="Continue"
  backLabel="Go back"
  submitLabel="Done"
>
  <FormStep stepKey="choose">...</FormStep>
  <FormStep stepKey="confirm">...</FormStep>
</FormStepper>`,
        },
      ]}
    />
  );
}
