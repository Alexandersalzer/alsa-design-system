"use client";

import React, { useState } from "react";
import {
  VStack,
  HStack,
  H1,
  H2,
  H3,
  H4,
  Body,
  Label,
  Card,
  Divider,
  SelectionCard,
  Icon,
  Box,
} from "../../../design/index";
import {
  SparklesIcon,
  HomeIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function SelectionCardPage() {
  const [selectedTheme, setSelectedTheme] = useState("ocean");
  const [selectedSections, setSelectedSections] = useState<string[]>(["hero"]);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [selectedPage, setSelectedPage] = useState("about");

  const toggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <VStack spacing="2xl">
      {/* Header */}
      <VStack spacing="md">
        <H1>SelectionCard</H1>
        <Body size="lg" color="secondary">
          Unified component for all selection scenarios - replaces RadioCard,
          CheckboxCard, and custom selection patterns.
        </Body>
      </VStack>

      <Divider />

      {/* Basic Usage */}
      <VStack spacing="lg">
        <H2>Basic Usage</H2>
        <Body color="secondary">
          SelectionCard is a versatile component for visual selections without
          traditional form inputs.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Theme Selector (Single Select, No Indicator)
            </Label>
            <HStack spacing="md">
              <SelectionCard
                selected={selectedTheme === "ocean"}
                onChange={() => setSelectedTheme("ocean")}
              >
                <VStack spacing="sm" align="center">
                  <Box
                    style={{
                      width: 60,
                      height: 60,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                    }}
                  />
                  <Body weight="medium">Ocean</Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedTheme === "forest"}
                onChange={() => setSelectedTheme("forest")}
              >
                <VStack spacing="sm" align="center">
                  <Box
                    style={{
                      width: 60,
                      height: 60,
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      borderRadius: "50%",
                    }}
                  />
                  <Body weight="medium">Forest</Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedTheme === "sunset"}
                onChange={() => setSelectedTheme("sunset")}
              >
                <VStack spacing="sm" align="center">
                  <Box
                    style={{
                      width: 60,
                      height: 60,
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      borderRadius: "50%",
                    }}
                  />
                  <Body weight="medium">Sunset</Body>
                </VStack>
              </SelectionCard>
            </HStack>
            <Body size="sm" color="secondary">
              Selected: {selectedTheme}
            </Body>
          </VStack>
        </Card>
      </VStack>

      {/* With Checkbox Indicator */}
      <VStack spacing="lg">
        <H2>Multi-Select with Checkbox</H2>
        <Body color="secondary">
          Use the checkbox indicator for multi-select scenarios.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Select Sections
            </Label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--foundation-space-3)" }}>
              <SelectionCard
                selected={selectedSections.includes("hero")}
                onChange={(checked) => toggleSection("hero")}
                indicator="checkbox"
              >
                <VStack spacing="xs">
                  <HStack spacing="sm" align="center">
                    <Icon size="md" color="primary">
                      <SparklesIcon />
                    </Icon>
                    <H4>Hero Section</H4>
                  </HStack>
                  <Body size="sm" color="secondary">
                    Eye-catching header
                  </Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedSections.includes("about")}
                onChange={(checked) => toggleSection("about")}
                indicator="checkbox"
              >
                <VStack spacing="xs">
                  <HStack spacing="sm" align="center">
                    <Icon size="md" color="primary">
                      <InformationCircleIcon />
                    </Icon>
                    <H4>About Section</H4>
                  </HStack>
                  <Body size="sm" color="secondary">
                    Company information
                  </Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedSections.includes("contact")}
                onChange={(checked) => toggleSection("contact")}
                indicator="checkbox"
              >
                <VStack spacing="xs">
                  <HStack spacing="sm" align="center">
                    <Icon size="md" color="primary">
                      <PhoneIcon />
                    </Icon>
                    <H4>Contact Section</H4>
                  </HStack>
                  <Body size="sm" color="secondary">
                    Get in touch
                  </Body>
                </VStack>
              </SelectionCard>
            </div>
            <Body size="sm" color="secondary">
              Selected: {selectedSections.join(", ") || "None"}
            </Body>
          </VStack>
        </Card>
      </VStack>

      {/* With Radio Indicator */}
      <VStack spacing="lg">
        <H2>Single Select with Radio</H2>
        <Body color="secondary">
          Use the radio indicator for form-based single selection.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Choose Your Plan
            </Label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--foundation-space-3)" }}>
              <SelectionCard
                selected={selectedPlan === "starter"}
                onChange={() => setSelectedPlan("starter")}
                indicator="radio"
                name="plan"
                value="starter"
              >
                <VStack spacing="xs">
                  <H4>Starter</H4>
                  <Body size="lg" weight="bold">
                    $9/month
                  </Body>
                  <Body size="sm" color="secondary">
                    Perfect for individuals
                  </Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedPlan === "pro"}
                onChange={() => setSelectedPlan("pro")}
                indicator="radio"
                name="plan"
                value="pro"
                variant="accent"
              >
                <VStack spacing="xs">
                  <H4>Pro</H4>
                  <Body size="lg" weight="bold">
                    $29/month
                  </Body>
                  <Body size="sm" color="secondary">
                    For growing teams
                  </Body>
                </VStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedPlan === "enterprise"}
                onChange={() => setSelectedPlan("enterprise")}
                indicator="radio"
                name="plan"
                value="enterprise"
              >
                <VStack spacing="xs">
                  <H4>Enterprise</H4>
                  <Body size="lg" weight="bold">
                    Custom
                  </Body>
                  <Body size="sm" color="secondary">
                    For large organizations
                  </Body>
                </VStack>
              </SelectionCard>
            </div>
            <Body size="sm" color="secondary">
              Selected: {selectedPlan}
            </Body>
          </VStack>
        </Card>
      </VStack>

      {/* Horizontal Orientation */}
      <VStack spacing="lg">
        <H2>Horizontal Layout</H2>
        <Body color="secondary">
          Use horizontal orientation for list-style selections.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Select Page
            </Label>
            <VStack spacing="sm">
              <SelectionCard
                selected={selectedPage === "home"}
                onChange={() => setSelectedPage("home")}
                orientation="horizontal"
              >
                <HStack spacing="md" align="center">
                  <Icon size="lg" color="primary">
                    <HomeIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">Home Page</Body>
                    <Body size="sm" color="secondary">
                      Landing page for visitors
                    </Body>
                  </VStack>
                </HStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedPage === "about"}
                onChange={() => setSelectedPage("about")}
                orientation="horizontal"
              >
                <HStack spacing="md" align="center">
                  <Icon size="lg" color="primary">
                    <InformationCircleIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">About Page</Body>
                    <Body size="sm" color="secondary">
                      Company information
                    </Body>
                  </VStack>
                </HStack>
              </SelectionCard>

              <SelectionCard
                selected={selectedPage === "contact"}
                onChange={() => setSelectedPage("contact")}
                orientation="horizontal"
              >
                <HStack spacing="md" align="center">
                  <Icon size="lg" color="primary">
                    <EnvelopeIcon />
                  </Icon>
                  <VStack spacing="xs">
                    <Body weight="medium">Contact Page</Body>
                    <Body size="sm" color="secondary">
                      Get in touch form
                    </Body>
                  </VStack>
                </HStack>
              </SelectionCard>
            </VStack>
            <Body size="sm" color="secondary">
              Selected: {selectedPage}
            </Body>
          </VStack>
        </Card>
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
                      selected
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
                      Whether the card is selected
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      onChange
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      (selected: boolean) =&gt; void
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Callback when selection changes
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      indicator
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos; | &apos;checkbox&apos; | &apos;radio&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Visual indicator type
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      orientation
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;horizontal&apos; | &apos;vertical&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;vertical&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Layout direction
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      size
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;md&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Card size
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
                      &apos;neutral&apos; | &apos;accent&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;neutral&apos;
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
                      disabled
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
                      Whether the card is disabled
                    </Body>
                  </td>
                </tr>
              </tbody>
            </table>
          </VStack>
        </Card>
      </VStack>

      {/* Use Cases */}
      <VStack spacing="lg">
        <H2>Use Cases</H2>
        <Card>
          <VStack spacing="md">
            <Body weight="semibold">Perfect for:</Body>
            <ul style={{ marginLeft: "20px" }}>
              <li>
                <Body>Theme pickers (color swatches)</Body>
              </li>
              <li>
                <Body>Page/section selectors</Body>
              </li>
              <li>
                <Body>Dashboard layout pickers</Body>
              </li>
              <li>
                <Body>Plan selection interfaces</Body>
              </li>
              <li>
                <Body>Any grid-based selection</Body>
              </li>
            </ul>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}
