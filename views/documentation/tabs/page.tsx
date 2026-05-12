"use client";

import React, { useState } from 'react';
import { Box, Body, Tab, TabGroup } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function TabsPage() {
  const [lineTab, setLineTab] = useState('members');
  const [subtleTab, setSubtleTab] = useState('members');
  const [enclosedTab, setEnclosedTab] = useState('members');
  const [outlineTab, setOutlineTab] = useState('members');
  const [plainTab, setPlainTab] = useState('members');
  const [contentTab, setContentTab] = useState('details');
  const [accentTab, setAccentTab] = useState('members');

  return (
    <ComponentDocPage
      componentName="Tab & TabGroup"
      description="Tab navigation for switching between different views or content sections. Follows Chakra UI variant naming: line, subtle, enclosed, outline, plain."
      importStatement={`import { Tab, TabGroup } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple tab navigation with TabGroup wrapper. Defaults to "line" variant with horizontal orientation and neutral colors.',
          preview: (
            <Box>
              <TabGroup>
                <Tab isActive={lineTab === 'members'} onClick={() => setLineTab('members')}>
                  Members
                </Tab>
                <Tab isActive={lineTab === 'projects'} onClick={() => setLineTab('projects')}>
                  Projects
                </Tab>
                <Tab isActive={lineTab === 'settings'} onClick={() => setLineTab('settings')}>
                  Settings
                </Tab>
              </TabGroup>
              <Box padding="md" style={{ marginTop: '16px' }}>
                <Body color="secondary">
                  Selected: <Body as="span" weight="medium">{lineTab}</Body>
                </Body>
              </Box>
            </Box>
          ),
          code: `const [activeTab, setActiveTab] = useState('members');

<TabGroup>
  <Tab isActive={activeTab === 'members'} onClick={() => setActiveTab('members')}>
    Members
  </Tab>
  <Tab isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
    Projects
  </Tab>
  <Tab isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
    Settings
  </Tab>
</TabGroup>`,
        },

        {
          title: 'Variants',
          description: 'Five visual variants: line (underline indicator), subtle (filled pill), enclosed (only active has folder border), outline (all tabs bordered), and plain (text only).',
          preview: (
            <Box display="flex" direction="column" gap="xl">
              {/* Line variant */}
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  line (default) - underline indicator
                </Body>
                <Box>
                  <TabGroup variant="line">
                    <Tab isActive={lineTab === 'members'} onClick={() => setLineTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={lineTab === 'projects'} onClick={() => setLineTab('projects')}>
                      Projects
                    </Tab>
                    <Tab isActive={lineTab === 'settings'} onClick={() => setLineTab('settings')}>
                      Settings
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>

              {/* Subtle variant */}
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  subtle - filled pill on active
                </Body>
                <Box>
                  <TabGroup variant="subtle" orientation='horizontal'>
                    <Tab isActive={subtleTab === 'members'} onClick={() => setSubtleTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={subtleTab === 'projects'} onClick={() => setSubtleTab('projects')}>
                      Projects
                    </Tab>
                    <Tab isActive={subtleTab === 'settings'} onClick={() => setSubtleTab('settings')}>
                      Settings
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>

              {/* Enclosed variant */}
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  enclosed - only active tab has folder border (inactive are open)
                </Body>
                <Box>
                  <TabGroup variant="enclosed">
                    <Tab isActive={enclosedTab === 'members'} onClick={() => setEnclosedTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={enclosedTab === 'projects'} onClick={() => setEnclosedTab('projects')}>
                      Projects
                    </Tab>
                    <Tab isActive={enclosedTab === 'settings'} onClick={() => setEnclosedTab('settings')}>
                      Settings
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>

              {/* Outline variant */}
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  outline - ALL tabs are bordered (folder-style)
                </Body>
                <Box>
                  <TabGroup variant="outline">
                    <Tab isActive={outlineTab === 'members'} onClick={() => setOutlineTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={outlineTab === 'projects'} onClick={() => setOutlineTab('projects')}>
                      Projects
                    </Tab>
                    <Tab isActive={outlineTab === 'settings'} onClick={() => setOutlineTab('settings')}>
                      Settings
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>

              {/* Plain variant */}
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  plain - minimal, text only
                </Body>
                <Box>
                  <TabGroup variant="plain">
                    <Tab isActive={plainTab === 'members'} onClick={() => setPlainTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={plainTab === 'projects'} onClick={() => setPlainTab('projects')}>
                      Projects
                    </Tab>
                    <Tab isActive={plainTab === 'settings'} onClick={() => setPlainTab('settings')}>
                      Settings
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Line variant (default) - underline indicator
<TabGroup variant="line">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>

// Subtle variant - background on active
<TabGroup variant="subtle">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>

// Enclosed variant - folder-style tabs
<TabGroup variant="enclosed">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>

// Outline variant - folder-style bordered tabs
<TabGroup variant="outline">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>

// Plain variant - minimal, text only
<TabGroup variant="plain">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>`
        },

        {
          title: 'Accent Colors',
          description: 'Use isAccent={true} to switch from neutral colors (default) to accent colors.',
          preview: (
            <Box display="flex" direction="column" gap="lg">
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  Neutral (default) - text-default → text-strong
                </Body>
                <Box>
                  <TabGroup variant="subtle" orientation='horizontal'>
                    <Tab isActive={accentTab === 'members'} onClick={() => setAccentTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={accentTab === 'projects'} onClick={() => setAccentTab('projects')}>
                      Projects
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>
              <Box>
                <Body size="sm" weight="semibold" color="secondary" style={{ marginBottom: '8px' }}>
                  Accent (isAccent=true) - text-accent, surface-accent-muted
                </Body>
                <Box>
                  <TabGroup variant="subtle" isAccent>
                    <Tab isActive={accentTab === 'members'} onClick={() => setAccentTab('members')}>
                      Members
                    </Tab>
                    <Tab isActive={accentTab === 'projects'} onClick={() => setAccentTab('projects')}>
                      Projects
                    </Tab>
                  </TabGroup>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Neutral colors (default)
<TabGroup variant="subtle">
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>

// Accent colors
<TabGroup variant="subtle" isAccent>
  <Tab isActive={isActive} onClick={handleClick}>Members</Tab>
</TabGroup>`,
        },

        {
          title: 'With Content',
          description: 'Tabs controlling rendered content panels.',
          preview: (
            <Box>
              <TabGroup>
                <Tab isActive={contentTab === 'details'} onClick={() => setContentTab('details')}>
                  Details
                </Tab>
                <Tab isActive={contentTab === 'activity'} onClick={() => setContentTab('activity')}>
                  Activity
                </Tab>
                <Tab isActive={contentTab === 'analytics'} onClick={() => setContentTab('analytics')}>
                  Analytics
                </Tab>
              </TabGroup>
              <Box padding="lg" style={{ marginTop: '16px' }} border="default" radius="md" bg="base">
                {contentTab === 'details' && (
                  <Box>
                    <Body weight="medium">Details Content</Body>
                    <Body size="sm" color="secondary">View and manage your account details</Body>
                  </Box>
                )}
                {contentTab === 'activity' && (
                  <Box>
                    <Body weight="medium">Activity Content</Body>
                    <Body size="sm" color="secondary">Track your recent activity</Body>
                  </Box>
                )}
                {contentTab === 'analytics' && (
                  <Box>
                    <Body weight="medium">Analytics Content</Body>
                    <Body size="sm" color="secondary">View your performance metrics</Body>
                  </Box>
                )}
              </Box>
            </Box>
          ),
          code: `const [activeTab, setActiveTab] = useState('details');

<TabGroup>
  <Tab isActive={activeTab === 'details'} onClick={() => setActiveTab('details')}>
    Details
  </Tab>
  <Tab isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
    Activity
  </Tab>
</TabGroup>

<Box padding="lg">
  {activeTab === 'details' && <DetailsContent />}
  {activeTab === 'activity' && <ActivityContent />}
</Box>`,
        },

        {
          title: 'Vertical Orientation',
          description: 'Use orientation="vertical" for sidebar-style navigation.',
          preview: (
            <Box>
              <TabGroup variant="navigation" orientation="vertical">
                <Tab isActive={lineTab === 'members'} onClick={() => setLineTab('members')}>
                  Members
                </Tab>
                <Tab isActive={lineTab === 'projects'} onClick={() => setLineTab('projects')}>
                  Projects
                </Tab>
                <Tab isActive={lineTab === 'settings'} onClick={() => setLineTab('settings')}>
                  Settings
                </Tab>
              </TabGroup>
            </Box>
          ),
          code: `// Use navigation variant with vertical orientation for sidebars
<TabGroup variant="navigation" orientation="vertical">
  <Tab isActive={activeTab === 'members'} onClick={() => setActiveTab('members')}>
    Members
  </Tab>
  <Tab isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
    Projects
  </Tab>
</TabGroup>`,
        },
      ]}
    />
  );
}
