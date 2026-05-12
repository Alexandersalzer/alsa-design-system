"use client";

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Body,
  Button,
  Modal,
  Input,
  Label,
  Divider,
} from '../../../design/index';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [mediumOpen, setMediumOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [xlOpen, setXlOpen] = useState(false);
  const [xxlOpen, setXxlOpen] = useState(false);
  const [xxxlOpen, setXxxlOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  return (
    <ComponentDocPage
      componentName="Modal"
      description="Overlay dialog that focuses user attention on a specific task or message"
      importStatement={`import { Modal } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Button onClick={() => setBasicOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={basicOpen}
                onClose={() => setBasicOpen(false)}
                title="Basic Modal"
              >
                <VStack spacing="md">
                  <Body>This is a basic modal example with default settings.</Body>
                  <HStack justify="end" spacing="sm">
                    <Button variant="secondary" onClick={() => setBasicOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setBasicOpen(false)}>
                      Confirm
                    </Button>
                  </HStack>
                </VStack>
              </Modal>
            </Box>
          ),
          code: `const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Basic Modal"
>
  <VStack spacing="md">
    <Body>This is a basic modal example.</Body>
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setIsOpen(false)}>
        Confirm
      </Button>
    </HStack>
  </VStack>
</Modal>`,
        },

        // ===== SIZES =====
        {
          title: 'Sizes',
          description: 'Modals come in different sizes to accommodate various content types',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setSmallOpen(true)}>Small</Button>
                <Body size="xs" color="secondary">size="sm"</Body>
                <Modal
                  isOpen={smallOpen}
                  onClose={() => setSmallOpen(false)}
                  title="Small Modal"
                  size="sm"
                >
                  <VStack spacing="md">
                    <Body size="sm">This is a small modal, perfect for simple confirmations.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setSmallOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setMediumOpen(true)}>Medium</Button>
                <Body size="xs" color="secondary">size="md" (default)</Body>
                <Modal
                  isOpen={mediumOpen}
                  onClose={() => setMediumOpen(false)}
                  title="Medium Modal"
                  size="md"
                >
                  <VStack spacing="md">
                    <Body>This is a medium modal, the default size for most use cases.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setMediumOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setLargeOpen(true)}>Large</Button>
                <Body size="xs" color="secondary">size="lg"</Body>
                <Modal
                  isOpen={largeOpen}
                  onClose={() => setLargeOpen(false)}
                  title="Large Modal"
                  size="lg"
                >
                  <VStack spacing="md">
                    <Body>This is a large modal, suitable for forms and detailed content.</Body>
                    <Body color="secondary">It provides more space for complex layouts.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setLargeOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setXlOpen(true)}>XL</Button>
                <Body size="xs" color="secondary">size="xl"</Body>
                <Modal
                  isOpen={xlOpen}
                  onClose={() => setXlOpen(false)}
                  title="Extra Large Modal"
                  size="xl"
                >
                  <VStack spacing="md">
                    <Body>This is an extra large modal, ideal for complex forms, data tables, or rich content.</Body>
                    <Body color="secondary">Use this size when you need maximum screen real estate.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setXlOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setXxlOpen(true)}>2XL</Button>
                <Body size="xs" color="secondary">size="2xl"</Body>
                <Modal
                  isOpen={xxlOpen}
                  onClose={() => setXxlOpen(false)}
                  title="2XL Modal"
                  size="2xl"
                >
                  <VStack spacing="md">
                    <Body>This is a 2XL modal for very large content.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setXxlOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setXxxlOpen(true)}>3XL</Button>
                <Body size="xs" color="secondary">size="3xl"</Body>
                <Modal
                  isOpen={xxxlOpen}
                  onClose={() => setXxxlOpen(false)}
                  title="3XL Modal"
                  size="3xl"
                >
                  <VStack spacing="md">
                    <Body>This is a 3XL modal for extremely large content.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setXxxlOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setFullOpen(true)}>Full</Button>
                <Body size="xs" color="secondary">size="full"</Body>
                <Modal
                  isOpen={fullOpen}
                  onClose={() => setFullOpen(false)}
                  title="Full Screen Modal"
                  size="full"
                >
                  <VStack spacing="md">
                    <Body>This is a full-screen modal that takes up the entire viewport.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button size="sm" variant="secondary" onClick={() => setFullOpen(false)}>
                        Close
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>
            </Box>
          ),
          code: `<Modal size="sm" isOpen={isOpen} onClose={onClose} title="Small">...</Modal>
<Modal size="md" isOpen={isOpen} onClose={onClose} title="Medium">...</Modal>
<Modal size="lg" isOpen={isOpen} onClose={onClose} title="Large">...</Modal>
<Modal size="xl" isOpen={isOpen} onClose={onClose} title="XL">...</Modal>
<Modal size="2xl" isOpen={isOpen} onClose={onClose} title="2XL">...</Modal>
<Modal size="3xl" isOpen={isOpen} onClose={onClose} title="3XL">...</Modal>
<Modal size="full" isOpen={isOpen} onClose={onClose} title="Full">...</Modal>`,
        },

        // ===== WITH FOOTER =====
        {
          title: 'With Footer',
          description: 'Modals with custom footer content for actions',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Button onClick={() => setFooterOpen(true)}>Open Modal with Footer</Button>
              <Modal
                isOpen={footerOpen}
                onClose={() => setFooterOpen(false)}
                title="Modal with Footer"
                size="md"
                footer={
                  <HStack justify="end" spacing="sm">
                    <Button variant="secondary" onClick={() => setFooterOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="accent" onClick={() => setFooterOpen(false)}>
                      Save Changes
                    </Button>
                  </HStack>
                }
              >
                <VStack spacing="md">
                  <Body>This modal has a custom footer with action buttons.</Body>
                  <Body color="secondary">
                    The footer prop allows you to add custom content at the bottom of the modal,
                    typically used for action buttons like Save, Cancel, Delete, etc.
                  </Body>
                  <VStack spacing="sm">
                    <Label>Name</Label>
                    <Input placeholder="Enter your name" />
                  </VStack>
                  <VStack spacing="sm">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@example.com" />
                  </VStack>
                </VStack>
              </Modal>
            </Box>
          ),
          code: `const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal with Footer"
  footer={
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="accent" onClick={() => setIsOpen(false)}>
        Save Changes
      </Button>
    </HStack>
  }
>
  <VStack spacing="md">
    <Body>Modal content goes here</Body>
    <Input placeholder="Example input" />
  </VStack>
</Modal>`,
        },

        // ===== INTERACTIVE EXAMPLES =====
        {
          title: 'Interactive Examples',
          description: 'Common modal use cases with interactive content',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="accent" onClick={() => setFormOpen(true)}>Form Modal</Button>
                <Body size="xs" color="secondary">With form inputs</Body>
                <Modal
                  isOpen={formOpen}
                  onClose={() => setFormOpen(false)}
                  title="User Information"
                  size="md"
                >
                  <VStack spacing="lg">
                    <VStack spacing="sm">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter your name" />
                    </VStack>
                    <VStack spacing="sm">
                      <Label>Email Address</Label>
                      <Input type="email" placeholder="you@example.com" />
                    </VStack>
                    <VStack spacing="sm">
                      <Label>Role</Label>
                      <Input placeholder="Your role" />
                    </VStack>
                    <HStack justify="end" spacing="sm">
                      <Button variant="secondary" onClick={() => setFormOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setFormOpen(false)}>
                        Save
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Confirm Action</Button>
                <Body size="xs" color="secondary">Confirmation dialog</Body>
                <Modal
                  isOpen={confirmOpen}
                  onClose={() => setConfirmOpen(false)}
                  title="Confirm Delete"
                  size="sm"
                >
                  <VStack spacing="lg">
                    <Body>Are you sure you want to delete this item? This action cannot be undone.</Body>
                    <HStack justify="end" spacing="sm">
                      <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => setConfirmOpen(false)}>
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="secondary" onClick={() => setContentOpen(true)}>Content Modal</Button>
                <Body size="xs" color="secondary">With rich content</Body>
                <Modal
                  isOpen={contentOpen}
                  onClose={() => setContentOpen(false)}
                  title="Terms and Conditions"
                  size="lg"
                >
                  <VStack spacing="md">
                    <Body weight="semibold">1. Acceptance of Terms</Body>
                    <Body color="secondary">
                      By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
                    </Body>
                    <Body weight="semibold">2. Use License</Body>
                    <Body color="secondary">
                      Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.
                    </Body>
                    <Body weight="semibold">3. Disclaimer</Body>
                    <Body color="secondary">
                      The materials are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.
                    </Body>
                    <HStack justify="end" spacing="sm">
                      <Button variant="secondary" onClick={() => setContentOpen(false)}>
                        Decline
                      </Button>
                      <Button onClick={() => setContentOpen(false)}>
                        Accept
                      </Button>
                    </HStack>
                  </VStack>
                </Modal>
              </Box>
            </Box>
          ),
          code: `<Modal isOpen={isOpen} onClose={onClose} title="User Information" size="md">
  <VStack spacing="lg">
    <VStack spacing="sm">
      <Label>Full Name</Label>
      <Input placeholder="Enter your name" />
    </VStack>
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onClose}>Save</Button>
    </HStack>
  </VStack>
</Modal>

<Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
  <VStack spacing="lg">
    <Body>Are you sure you want to delete this item?</Body>
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="destructive" onClick={onClose}>Delete</Button>
    </HStack>
  </VStack>
</Modal>

<Modal isOpen={isOpen} onClose={onClose} title="Terms" size="lg">
  <VStack spacing="md">
    <Body weight="semibold">1. Acceptance of Terms</Body>
    <Body color="secondary">By accessing this service...</Body>
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={onClose}>Decline</Button>
      <Button onClick={onClose}>Accept</Button>
    </HStack>
  </VStack>
</Modal>`
        },
      ]}
    >
      {/* Props Section */}
      <VStack spacing="md">
        <Box>
          <VStack spacing="sm">
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">isOpen</Body>
              <Body color="secondary">boolean - Controls modal visibility</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">onClose</Body>
              <Body color="secondary">function - Callback when modal is closed</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">title</Body>
              <Body color="secondary">string - Modal header title (optional)</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">size</Body>
              <Body color="secondary">'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' - Modal width (default: 'md')</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">footer</Body>
              <Body color="secondary">ReactNode - Custom footer content, typically for action buttons (optional)</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">showCloseButton</Body>
              <Body color="secondary">boolean - Show close button in header (optional)</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[140px]">children</Body>
              <Body color="secondary">ReactNode - Modal content</Body>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </ComponentDocPage>
  );
}
