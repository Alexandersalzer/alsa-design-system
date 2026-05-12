"use client";

import React from 'react';
import {
  Card,
  CardContent,
  VStack,
  HStack,
  Grid,
  Skeleton,
  SkeletonCircle,
  H2,
  Body,
  Button
} from '../../../design/index';

/**
 * Loading Skeleton Demo Page
 * Full interactive demo of the app-level dashboard loading skeleton
 */
export default function LoadingSkeletonDemoPage() {
  return (
    <div style={{ padding: 'var(--foundation-space-6)' }}>
      <VStack spacing="xl">
        <VStack spacing="sm">
          <H2>App-Level Dashboard Loading Skeleton</H2>
          <Body color="secondary">
            This is the loading skeleton that shows during initial dashboard load.
            It includes sidebar, header, and content area to match the actual layout.
          </Body>
        </VStack>

        {/* Full Dashboard Skeleton Preview */}
        <div style={{
          border: '2px solid var(--border-subtle)',
          borderRadius: 'var(--foundation-radius-lg)',
          overflow: 'hidden',
          height: '600px'
        }}>
          <div style={{
            display: 'flex',
            height: '100%',
            background: 'var(--surface-base)'
          }}>
            {/* Sidebar Skeleton */}
            <aside style={{
              width: '260px',
              flexShrink: 0,
              background: 'var(--surface-sidebar)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--foundation-space-4)'
            }}>
              {/* Logo area */}
              <div style={{ marginBottom: 'var(--foundation-space-6)' }}>
                <HStack spacing="md" align="center">
                  <SkeletonCircle size="40px" />
                  <Skeleton height="20px" width="120px" variant="pulse" />
                </HStack>
              </div>

              {/* Navigation items */}
              <VStack spacing="xs" style={{ flex: 1 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton
                    key={i}
                    height="44px"
                    width="100%"
                    variant="pulse"
                    style={{ borderRadius: 'var(--foundation-radius-md)' }}
                  />
                ))}
              </VStack>

              {/* Bottom section */}
              <div style={{ marginTop: 'auto', paddingTop: 'var(--foundation-space-4)' }}>
                <Skeleton
                  height="44px"
                  width="100%"
                  variant="pulse"
                  style={{ borderRadius: 'var(--foundation-radius-md)' }}
                />
              </div>
            </aside>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Header Skeleton */}
              <header style={{
                height: '64px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--surface-base)',
                padding: '0 var(--foundation-space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                {/* Left side - Search */}
                <Skeleton height="40px" width="320px" variant="pulse" />

                {/* Right side - Actions */}
                <HStack spacing="md" align="center">
                  <Skeleton height="40px" width="140px" variant="pulse" />
                  <SkeletonCircle size="40px" />
                  <SkeletonCircle size="40px" />
                  <SkeletonCircle size="40px" />
                </HStack>
              </header>

              {/* Main Content Area Skeleton */}
              <main style={{
                flex: 1,
                overflow: 'auto',
                padding: 'var(--foundation-space-6)'
              }}>
                <div style={{ maxWidth: '100%', margin: '0 auto' }}>
                  <VStack spacing="xl">
                    {/* Page header skeleton */}
                    <VStack spacing="xs">
                      <Skeleton height="32px" width="30%" variant="pulse" />
                      <Skeleton height="16px" width="50%" variant="pulse" />
                    </VStack>

                    {/* Generic 3-column card grid */}
                    <Grid columns={3} gap="md">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i}>
                          <CardContent>
                            <VStack spacing="sm">
                              <Skeleton height="20px" width="70%" variant="pulse" />
                              <Skeleton height="14px" width="60%" variant="pulse" />
                              <Skeleton height="14px" width="80%" variant="pulse" />
                            </VStack>
                          </CardContent>
                        </Card>
                      ))}
                    </Grid>
                  </VStack>
                </div>
              </main>
            </div>
          </div>
        </div>

        <Body size="sm" color="secondary" align="center">
          This skeleton appears at <code>/dashboard/loading.tsx</code> when the dashboard first loads.
        </Body>
      </VStack>
    </div>
  );
}
