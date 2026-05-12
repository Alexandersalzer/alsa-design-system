"use client";

import React from "react";
import {
  VStack,
  HStack,
  H1,
  H2,
  Body,
  Label,
  Card,
  Divider,
  Logo,
  Box,
} from "../../../design/index";

export default function LogoPage() {
  return (
    <VStack spacing="2xl">
      {/* Header */}
      <VStack spacing="md">
        <H1>Logo</H1>
        <Body size="lg" color="secondary">
          Unified logo component that handles image, text, or both with radius
          support and theme adaptation.
        </Body>
      </VStack>

      <Divider />

      {/* Image Only */}
      <VStack spacing="lg">
        <H2>Image Only</H2>
        <Body color="secondary">
          Display just the logo image without text.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Default Image Logo
            </Label>
            <Box
              style={{
                padding: "var(--foundation-space-4)",
                display: "inline-flex",
              }}
            >
              <Logo
                src="/images/Blimpify AB logo.png"
                alt="Blimpify"
                width={60}
                height={60}
                radius="lg"
              />
            </Box>
          </VStack>
        </Card>
      </VStack>

      {/* Text Only */}
      <VStack spacing="lg">
        <H2>Text Only</H2>
        <Body color="secondary">
          Display just the logo text without an image.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Text Logo Variations
            </Label>
            <VStack spacing="lg">
              <Box>
                <Label size="sm" color="secondary">
                  Default
                </Label>
                <Logo text="Blimpify" textSize="2xl" />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Uppercase
                </Label>
                <Logo
                  text="Blimpify"
                  textSize="2xl"
                  textTransform="uppercase"
                  textSpacing="wider"
                />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  With Gradient
                </Label>
                <Logo text="Blimpify" textSize="2xl" textGradient />
              </Box>
            </VStack>
          </VStack>
        </Card>
      </VStack>

      {/* Image + Text Combined */}
      <VStack spacing="lg">
        <H2>Combined (Image + Text)</H2>
        <Body color="secondary">
          Show both image and text together.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Combined Logo
            </Label>
            <Box
              style={{
                padding: "var(--foundation-space-4)",
                display: "inline-flex",
              }}
            >
              <Logo
                src="/images/Blimpify AB logo.png"
                alt="Blimpify"
                text="Blimpify"
                width={40}
                height={40}
                radius="lg"
                textSize="2xl"
                gap="md"
              />
            </Box>
          </VStack>
        </Card>
      </VStack>

      {/* Radius Options */}
      <VStack spacing="lg">
        <H2>Border Radius</H2>
        <Body color="secondary">
          Control the border radius of the logo image.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Radius Variants
            </Label>
            <HStack spacing="lg" align="center">
              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="None"
                  width={60}
                  height={60}
                  radius="none"
                />
                <Body size="sm" color="secondary">
                  none
                </Body>
              </VStack>

              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Small"
                  width={60}
                  height={60}
                  radius="sm"
                />
                <Body size="sm" color="secondary">
                  sm
                </Body>
              </VStack>

              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Medium"
                  width={60}
                  height={60}
                  radius="md"
                />
                <Body size="sm" color="secondary">
                  md
                </Body>
              </VStack>

              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Large"
                  width={60}
                  height={60}
                  radius="lg"
                />
                <Body size="sm" color="secondary">
                  lg
                </Body>
              </VStack>

              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Extra Large"
                  width={60}
                  height={60}
                  radius="xl"
                />
                <Body size="sm" color="secondary">
                  xl
                </Body>
              </VStack>

              <VStack spacing="sm" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Full"
                  width={60}
                  height={60}
                  radius="full"
                />
                <Body size="sm" color="secondary">
                  full (circle)
                </Body>
              </VStack>
            </HStack>
          </VStack>
        </Card>
      </VStack>

      {/* Sizes */}
      <VStack spacing="lg">
        <H2>Sizes</H2>
        <Body color="secondary">
          Control logo dimensions and text size independently.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Size Variations
            </Label>
            <VStack spacing="lg">
              <HStack spacing="md" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Small"
                  text="Blimpify"
                  width={32}
                  height={32}
                  radius="lg"
                  textSize="md"
                  gap="sm"
                />
                <Body size="sm" color="secondary">
                  Small (32px, text: md)
                </Body>
              </HStack>

              <HStack spacing="md" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Medium"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  textSize="lg"
                  gap="md"
                />
                <Body size="sm" color="secondary">
                  Medium (40px, text: lg)
                </Body>
              </HStack>

              <HStack spacing="md" align="center">
                <Logo
                  src="/images/Blimpify AB logo.png"
                  alt="Large"
                  text="Blimpify"
                  width={56}
                  height={56}
                  radius="lg"
                  textSize="2xl"
                  gap="md"
                />
                <Body size="sm" color="secondary">
                  Large (56px, text: 2xl)
                </Body>
              </HStack>
            </VStack>
          </VStack>
        </Card>
      </VStack>

      {/* Color Modes */}
      <VStack spacing="lg">
        <H2>Color Modes</H2>
        <Body color="secondary">
          Logo automatically adapts to different backgrounds with the color
          prop.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Adaptive Colors
            </Label>
            <VStack spacing="lg">
              <Box>
                <Label size="sm" color="secondary">
                  Auto (adapts to theme)
                </Label>
                <Box
                  style={{
                    padding: "var(--foundation-space-4)",
                    display: "inline-flex",
                  }}
                >
                  <Logo
                    src="/images/Blimpify AB logo.png"
                    text="Blimpify"
                    width={40}
                    height={40}
                    radius="lg"
                    color="auto"
                  />
                </Box>
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Light (for dark backgrounds)
                </Label>
                <Box
                  style={{
                    padding: "var(--foundation-space-4)",
                    background: "var(--background-inverse)",
                    display: "inline-flex",
                    borderRadius: "var(--foundation-radius-md)",
                  }}
                >
                  <Logo
                    src="/images/Blimpify AB logo.png"
                    text="Blimpify"
                    width={40}
                    height={40}
                    radius="lg"
                    color="inverse"
                  />
                </Box>
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Dark (for light backgrounds)
                </Label>
                <Box
                  style={{
                    padding: "var(--foundation-space-4)",
                    background: "var(--surface-card)",
                    display: "inline-flex",
                    borderRadius: "var(--foundation-radius-md)",
                  }}
                >
                  <Logo
                    src="/images/Blimpify AB logo.png"
                    text="Blimpify"
                    width={40}
                    height={40}
                    radius="lg"
                    color="auto"
                  />
                </Box>
              </Box>
            </VStack>
          </VStack>
        </Card>
      </VStack>

      {/* Gap & Alignment */}
      <VStack spacing="lg">
        <H2>Gap & Alignment</H2>
        <Body color="secondary">
          Control spacing between image and text, and vertical alignment.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Layout Options
            </Label>
            <VStack spacing="lg">
              <Box>
                <Label size="sm" color="secondary">
                  Small gap
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  gap="xs"
                />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Medium gap
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  gap="md"
                />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Large gap
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  gap="lg"
                />
              </Box>

              <Divider />

              <Box>
                <Label size="sm" color="secondary">
                  Align start
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  align="start"
                />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Align center
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  align="center"
                />
              </Box>

              <Box>
                <Label size="sm" color="secondary">
                  Align end
                </Label>
                <Logo
                  src="/images/Blimpify AB logo.png"
                  text="Blimpify"
                  width={40}
                  height={40}
                  radius="lg"
                  align="end"
                />
              </Box>
            </VStack>
          </VStack>
        </Card>
      </VStack>

      {/* Hide Text on Mobile */}
      <VStack spacing="lg">
        <H2>Responsive Behavior</H2>
        <Body color="secondary">
          Hide text on mobile screens to save space.
        </Body>

        <Card>
          <VStack spacing="md">
            <Label size="md" weight="semibold">
              Mobile-Friendly Logo
            </Label>
            <Body size="sm" color="secondary">
              Resize your browser to see the text hide on mobile
            </Body>
            <Box
              style={{
                padding: "var(--foundation-space-4)",
                display: "inline-flex",
              }}
            >
              <Logo
                src="/images/Blimpify AB logo.png"
                text="Blimpify"
                width={40}
                height={40}
                radius="lg"
                hideTextOnMobile
              />
            </Box>
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
                      src
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      string
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Logo image source
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      text
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      string
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      -
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Logo text content
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      width
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      number
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      40
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Image width in pixels
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      height
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      number
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      40
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Image height in pixels
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      radius
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos; | &apos;sm&apos; | &apos;md&apos; |
                      &apos;lg&apos; | &apos;xl&apos; | &apos;full&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;none&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Border radius for image
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      color
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;auto&apos; | &apos;light&apos; | &apos;dark&apos; |
                      &apos;brand&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;auto&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Unified color that adapts to theme
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      textSize
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; |
                      &apos;lg&apos; | &apos;xl&apos; | &apos;2xl&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;lg&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Text size
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      gap
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; |
                      &apos;lg&apos; | &apos;xl&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      &apos;sm&apos;
                    </Body>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" color="secondary">
                      Spacing between image and text
                    </Body>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px" }}>
                    <Body size="sm" style={{ fontFamily: "monospace" }}>
                      hideTextOnMobile
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
                      Hide text on mobile screens
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
                <Body>Navigation headers</Body>
              </li>
              <li>
                <Body>Login/signup pages</Body>
              </li>
              <li>
                <Body>Email templates</Body>
              </li>
              <li>
                <Body>Footer branding</Body>
              </li>
              <li>
                <Body>Splash screens</Body>
              </li>
            </ul>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}
