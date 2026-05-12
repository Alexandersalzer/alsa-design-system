"use client";

import React from "react";
import {
  VStack,
  HStack,
  H1,
  H2,
  H3,
  Body,
  Label,
  Card,
  Divider,
  List,
  Icon,
} from "../../../design/index";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function ListPage() {
  return (
    <VStack spacing="2xl">
      {/* Header */}
      <VStack spacing="md">
        <H1>List</H1>
        <Body size="lg" color="secondary">
          Semantic list wrapper with proper styling for ordered and unordered
          lists.
        </Body>
      </VStack>

      <Divider />

      {/* Default List */}
      <VStack spacing="lg">
        <H2>Default List</H2>
        <Body color="secondary">
          Basic unordered list with default styling.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Features
            </Label>
            <List variant="default" spacing="sm">
              <li>
                <Body>Semantic HTML structure</Body>
              </li>
              <li>
                <Body>Flexible spacing options</Body>
              </li>
              <li>
                <Body>Multiple visual variants</Body>
              </li>
              <li>
                <Body>Accessibility built-in</Body>
              </li>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Ordered List */}
      <VStack spacing="lg">
        <H2>Ordered List</H2>
        <Body color="secondary">
          Numbered list for sequential content.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Setup Steps
            </Label>
            <List ordered variant="default" spacing="sm">
              <li>
                <Body>Install dependencies</Body>
              </li>
              <li>
                <Body>Configure environment variables</Body>
              </li>
              <li>
                <Body>Run database migrations</Body>
              </li>
              <li>
                <Body>Start the development server</Body>
              </li>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Divided Variant */}
      <VStack spacing="lg">
        <H2>Divided Variant</H2>
        <Body color="secondary">
          List items separated by dividers.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Team Members
            </Label>
            <List variant="divided" spacing="md">
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">John Doe</Body>
                  <Body size="sm" color="secondary">
                    Product Manager
                  </Body>
                </VStack>
              </li>
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">Jane Smith</Body>
                  <Body size="sm" color="secondary">
                    Lead Developer
                  </Body>
                </VStack>
              </li>
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">Mike Johnson</Body>
                  <Body size="sm" color="secondary">
                    UX Designer
                  </Body>
                </VStack>
              </li>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Bordered Variant */}
      <VStack spacing="lg">
        <H2>Bordered Variant</H2>
        <Body color="secondary">
          List with border around the entire list.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Available Plans
            </Label>
            <List variant="bordered" spacing="md">
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">Starter Plan</Body>
                  <Body size="sm" color="secondary">
                    $9/month - Perfect for individuals
                  </Body>
                </VStack>
              </li>
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">Pro Plan</Body>
                  <Body size="sm" color="secondary">
                    $29/month - For growing teams
                  </Body>
                </VStack>
              </li>
              <li>
                <VStack spacing="xs">
                  <Body weight="medium">Enterprise Plan</Body>
                  <Body size="sm" color="secondary">
                    Custom pricing - For large organizations
                  </Body>
                </VStack>
              </li>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* With Icons */}
      <VStack spacing="lg">
        <H2>With Icons</H2>
        <Body color="secondary">
          Combine with Icon component for enhanced visual hierarchy.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              System Status
            </Label>
            <List variant="divided" spacing="md">
              <li>
                <HStack spacing="sm" align="center">
                  <Icon size="md" color="success">
                    <CheckCircleIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">API Service</Body>
                    <Body size="sm" color="secondary">
                      All systems operational
                    </Body>
                  </VStack>
                </HStack>
              </li>
              <li>
                <HStack spacing="sm" align="center">
                  <Icon size="md" color="success">
                    <CheckCircleIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">Database</Body>
                    <Body size="sm" color="secondary">
                      Running smoothly
                    </Body>
                  </VStack>
                </HStack>
              </li>
              <li>
                <HStack spacing="sm" align="center">
                  <Icon size="md" color="warning">
                    <InformationCircleIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">File Storage</Body>
                    <Body size="sm" color="secondary">
                      Scheduled maintenance tonight
                    </Body>
                  </VStack>
                </HStack>
              </li>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Spacing Options */}
      <VStack spacing="lg">
        <H2>Spacing Options</H2>
        <Body color="secondary">
          Control spacing between list items.
        </Body>

        <HStack spacing="lg" align="start">
          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                None
              </Label>
              <List spacing="none">
                <li>
                  <Body size="sm">Item 1</Body>
                </li>
                <li>
                  <Body size="sm">Item 2</Body>
                </li>
                <li>
                  <Body size="sm">Item 3</Body>
                </li>
              </List>
            </VStack>
          </Card>

          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Small (sm)
              </Label>
              <List spacing="sm">
                <li>
                  <Body size="sm">Item 1</Body>
                </li>
                <li>
                  <Body size="sm">Item 2</Body>
                </li>
                <li>
                  <Body size="sm">Item 3</Body>
                </li>
              </List>
            </VStack>
          </Card>

          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Medium (md)
              </Label>
              <List spacing="md">
                <li>
                  <Body size="sm">Item 1</Body>
                </li>
                <li>
                  <Body size="sm">Item 2</Body>
                </li>
                <li>
                  <Body size="sm">Item 3</Body>
                </li>
              </List>
            </VStack>
          </Card>

          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Large (lg)
              </Label>
              <List spacing="lg">
                <li>
                  <Body size="sm">Item 1</Body>
                </li>
                <li>
                  <Body size="sm">Item 2</Body>
                </li>
                <li>
                  <Body size="sm">Item 3</Body>
                </li>
              </List>
            </VStack>
          </Card>
        </HStack>
      </VStack>

      {/* API Reference */}
      <VStack spacing="lg">
        <H2>API Reference</H2>
        <Card>
          <VStack spacing="md">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    <Body weight="semibold">Prop</Body>
                  </th>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    <Body weight="semibold">Type</Body>
                  </th>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    <Body weight="semibold">Default</Body>
                  </th>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    <Body weight="semibold">Description</Body>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      ordered
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      boolean
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      false
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Render as ordered list (ol) instead of unordered (ul)
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      variant
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;default&apos; | &apos;divided&apos; | &apos;bordered&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;default&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Visual style variant
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      spacing
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos; | &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Spacing between list items
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      role
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;list&apos; | &apos;listbox&apos; | &apos;menu&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;list&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      ARIA role for accessibility
                    </Body>
                  </td>
                </tr>
              </tbody>
            </table>
          </VStack>
        </Card>
      </VStack>

      {/* Best Practices */}
      <VStack spacing="lg">
        <H2>Best Practices</H2>
        <Card>
          <VStack spacing="md">
            <Body weight="semibold">Guidelines:</Body>
            <ul style={{ marginLeft: "20px" }}>
              <li>
                <Body>Use ordered lists for sequential or prioritized content</Body>
              </li>
              <li>
                <Body>Use divided variant for content with metadata</Body>
              </li>
              <li>
                <Body>Use bordered variant to visually contain related items</Body>
              </li>
              <li>
                <Body>Combine with ListboxItem for interactive lists</Body>
              </li>
              <li>
                <Body>Keep spacing consistent within the same list</Body>
              </li>
            </ul>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}
