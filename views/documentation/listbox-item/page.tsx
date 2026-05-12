"use client";

import React, { useState } from "react";
import {
  VStack,
  HStack,
  H1,
  H2,
  Body,
  Label,
  Card,
  Divider,
  List,
  ListboxItem,
  Icon,
  Avatar,
  Badge,
  Tag,
} from "../../../design/index";
import {
  ServerIcon,
  ChevronRightIcon,
  CheckIcon,
  BellIcon,
  NewspaperIcon,
  GlobeAltIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function ListboxItemPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  return (
    <VStack spacing="2xl">
      {/* Header */}
      <VStack spacing="md">
        <H1>ListboxItem</H1>
        <Body size="lg" color="secondary">
          Single source of truth for interactive list items. Use for domains,
          notifications, news, selections, and any clickable list.
        </Body>
      </VStack>

      <Divider />

      {/* Basic Usage */}
      <VStack spacing="lg">
        <H2>Basic Usage</H2>
        <Body color="secondary">
          Simple clickable list items with automatic hover and focus states.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Navigation Menu
            </Label>
            <List role="menu" spacing="xs">
              <ListboxItem onClick={() => alert("Dashboard clicked")}>
                <Body>Dashboard</Body>
              </ListboxItem>
              <ListboxItem onClick={() => alert("Settings clicked")}>
                <Body>Settings</Body>
              </ListboxItem>
              <ListboxItem onClick={() => alert("Profile clicked")}>
                <Body>Profile</Body>
              </ListboxItem>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* With Leading and Trailing */}
      <VStack spacing="lg">
        <H2>With Leading & Trailing Icons</H2>
        <Body color="secondary">
          Add icons before or after the content for enhanced visual hierarchy.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Domain List
            </Label>
            <List role="listbox" spacing="xs">
              <ListboxItem
                leading={
                  <Icon size="md" color="primary">
                    <GlobeAltIcon />
                  </Icon>
                }
                trailing={
                  <Icon size="sm" color="secondary">
                    <ChevronRightIcon />
                  </Icon>
                }
                onClick={() => alert("example.com")}
                selected={selectedDomain === "example.com"}
              >
                <VStack spacing="xs">
                  <Body weight="medium">example.com</Body>
                  <Body size="sm" color="secondary">
                    Ready to activate
                  </Body>
                </VStack>
              </ListboxItem>

              <ListboxItem
                leading={
                  <Icon size="md" color="primary">
                    <ServerIcon />
                  </Icon>
                }
                trailing={
                  <Tag content="Live" variant="success" size="small">
                    Live
                  </Tag>
                }
                onClick={() => alert("mywebsite.com")}
                selected={selectedDomain === "mywebsite.com"}
              >
                <VStack spacing="xs">
                  <Body weight="medium">mywebsite.com</Body>
                  <Body size="sm" color="secondary">
                    Active and running
                  </Body>
                </VStack>
              </ListboxItem>

              <ListboxItem
                leading={
                  <Icon size="md" color="primary">
                    <GlobeAltIcon />
                  </Icon>
                }
                trailing={
                  <Icon size="sm" color="secondary">
                    <ChevronRightIcon />
                  </Icon>
                }
                onClick={() => alert("company.org")}
                selected={selectedDomain === "company.org"}
              >
                <VStack spacing="xs">
                  <Body weight="medium">company.org</Body>
                  <Body size="sm" color="secondary">
                    Pending verification
                  </Body>
                </VStack>
              </ListboxItem>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Sizes */}
      <VStack spacing="lg">
        <H2>Sizes</H2>
        <Body color="secondary">
          Three size variants: small, medium (default), and large.
        </Body>

        <HStack spacing="lg" align="start">
          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Small
              </Label>
              <List spacing="xs">
                <ListboxItem size="sm" onClick={() => {}}>
                  <Body size="sm">Small item</Body>
                </ListboxItem>
                <ListboxItem size="sm" onClick={() => {}}>
                  <Body size="sm">Another item</Body>
                </ListboxItem>
              </List>
            </VStack>
          </Card>

          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Medium
              </Label>
              <List spacing="xs">
                <ListboxItem size="md" onClick={() => {}}>
                  <Body>Medium item</Body>
                </ListboxItem>
                <ListboxItem size="md" onClick={() => {}}>
                  <Body>Another item</Body>
                </ListboxItem>
              </List>
            </VStack>
          </Card>

          <Card style={{ flex: 1 }}>
            <VStack spacing="md">
              <Label size="sm" weight="semibold">
                Large
              </Label>
              <List spacing="xs">
                <ListboxItem size="lg" onClick={() => {}}>
                  <Body size="lg">Large item</Body>
                </ListboxItem>
                <ListboxItem size="lg" onClick={() => {}}>
                  <Body size="lg">Another item</Body>
                </ListboxItem>
              </List>
            </VStack>
          </Card>
        </HStack>
      </VStack>

      {/* Card Variant */}
      <VStack spacing="lg">
        <H2>Card Variant</H2>
        <Body color="secondary">
          Elevated card style with border for grid layouts.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Select News Article
            </Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "var(--foundation-space-3)",
              }}
            >
              <ListboxItem
                variant="card"
                selected={selectedNotification === "update"}
                onClick={() => setSelectedNotification("update")}
                leading={
                  <Icon size="md" color="accent">
                    <NewspaperIcon />
                  </Icon>
                }
              >
                <VStack spacing="xs">
                  <Body weight="medium">System Update</Body>
                  <Body size="sm" color="secondary">
                    New features available
                  </Body>
                </VStack>
              </ListboxItem>

              <ListboxItem
                variant="card"
                selected={selectedNotification === "maintenance"}
                onClick={() => setSelectedNotification("maintenance")}
                leading={
                  <Icon size="md" color="warning">
                    <Cog6ToothIcon />
                  </Icon>
                }
              >
                <VStack spacing="xs">
                  <Body weight="medium">Maintenance</Body>
                  <Body size="sm" color="secondary">
                    Scheduled tonight
                  </Body>
                </VStack>
              </ListboxItem>

              <ListboxItem
                variant="card"
                selected={selectedNotification === "announcement"}
                onClick={() => setSelectedNotification("announcement")}
                leading={
                  <Icon size="md" color="accent">
                    <BellIcon />
                  </Icon>
                }
              >
                <VStack spacing="xs">
                  <Body weight="medium">Announcement</Body>
                  <Body size="sm" color="secondary">
                    Important news
                  </Body>
                </VStack>
              </ListboxItem>
            </div>
          </VStack>
        </Card>
      </VStack>

      {/* Selected State */}
      <VStack spacing="lg">
        <H2>Selected State</H2>
        <Body color="secondary">
          Visual feedback for selected items in a list.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Choose a Domain
            </Label>
            <List role="listbox" spacing="xs">
              <ListboxItem
                selected={selectedDomain === "example1"}
                onClick={() => setSelectedDomain("example1")}
                leading={
                  <Icon size="md" color="primary">
                    <GlobeAltIcon />
                  </Icon>
                }
                trailing={
                  selectedDomain === "example1" && (
                    <Icon size="sm" color="accent">
                      <CheckIcon />
                    </Icon>
                  )
                }
              >
                <Body>example1.com</Body>
              </ListboxItem>

              <ListboxItem
                selected={selectedDomain === "example2"}
                onClick={() => setSelectedDomain("example2")}
                leading={
                  <Icon size="md" color="primary">
                    <GlobeAltIcon />
                  </Icon>
                }
                trailing={
                  selectedDomain === "example2" && (
                    <Icon size="sm" color="accent">
                      <CheckIcon />
                    </Icon>
                  )
                }
              >
                <Body>example2.com</Body>
              </ListboxItem>

              <ListboxItem
                selected={selectedDomain === "example3"}
                onClick={() => setSelectedDomain("example3")}
                leading={
                  <Icon size="md" color="primary">
                    <GlobeAltIcon />
                  </Icon>
                }
                trailing={
                  selectedDomain === "example3" && (
                    <Icon size="sm" color="accent">
                      <CheckIcon />
                    </Icon>
                  )
                }
              >
                <Body>example3.com</Body>
              </ListboxItem>
            </List>
          </VStack>
        </Card>
      </VStack>

      {/* Disabled State */}
      <VStack spacing="lg">
        <H2>Disabled State</H2>
        <Body color="secondary">
          Non-interactive items with visual indication.
        </Body>

        <Card>
          <List spacing="xs">
            <ListboxItem onClick={() => alert("Available")}>
              <Body>Available Item</Body>
            </ListboxItem>
            <ListboxItem disabled>
              <Body>Disabled Item</Body>
            </ListboxItem>
            <ListboxItem onClick={() => alert("Another available")}>
              <Body>Another Available</Body>
            </ListboxItem>
          </List>
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
                      leading
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      ReactNode
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Content before main content (icon, avatar)
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      trailing
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      ReactNode
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Content after main content (chevron, button)
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
                      Size of the item
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
                      &apos;default&apos; | &apos;card&apos;
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
                      Whether the item is selected
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
                      Whether the item is disabled
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      interactive
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      boolean
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      true
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Whether the item is clickable
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      onClick
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      (event) =&gt; void
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Click handler
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
                <Body>Domain management lists</Body>
              </li>
              <li>
                <Body>Notification feeds</Body>
              </li>
              <li>
                <Body>News article lists</Body>
              </li>
              <li>
                <Body>Navigation menus</Body>
              </li>
              <li>
                <Body>Settings options</Body>
              </li>
              <li>
                <Body>Any interactive list scenario</Body>
              </li>
            </ul>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}
