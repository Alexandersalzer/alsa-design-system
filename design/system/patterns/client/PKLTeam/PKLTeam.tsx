// ===============================================
// design/system/components/patterns/client/PKLTeam/PKLTeam.tsx
// PKL TEAM SECTION - Clean, centered team grid
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../components/Typography';
import { VStack} from '../../../components/layout';
import { Section } from '../../../components'
// ===== TYPE DEFINITIONS =====

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedIn?: string; // Optional for future use
}

export interface PKLTeamContent {
  label: string;
  heading: string;
  description: string;
  members: TeamMember[];
}

export interface PKLTeamProps {
  content: PKLTeamContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PKL TEAM COMPONENT =====

export const PKLTeam: React.FC<PKLTeamProps> = ({ 
  content, 
  id = "pkl-team",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description,
    members
  } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-team-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .pkl-team-header {
            text-align: center;
            max-width: 700px;
            margin: 0 auto var(--foundation-space-16);
          }
          
          .pkl-team-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--foundation-space-10);
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .pkl-team-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: var(--foundation-space-4);
          }
          
          .pkl-team-image-wrapper {
            width: 100%;
            aspect-ratio: 4 / 5;
            border-radius: var(--radius-md);
            overflow: hidden;
            background: var(--surface-subtle);
            border: 1px solid var(--border-light);
          }
          
          .pkl-team-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .pkl-team-card:hover .pkl-team-image {
            transform: scale(1.05);
          }
          
          .pkl-team-info {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-1);
          }
          
          .pkl-team-name {
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-lg)' : 'var(--foundation-typography-size-md)'};
          }
          
          .pkl-team-role {
            color: var(--text-secondary);
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-md)' : 'var(--foundation-typography-size-sm)'};
            font-weight: var(--font-weight-normal);
          }
          
          /* Responsiveness */
          @media (max-width: 1024px) {
            .pkl-team-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: var(--foundation-space-8);
            }
          }
          
          @media (max-width: 640px) {
            .pkl-team-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-6);
              max-width: 400px;
            }
            
            .pkl-team-header {
              margin-bottom: var(--foundation-space-12);
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="pkl-team-container">
          {/* Header */}
          <div className="pkl-team-header">
            <VStack spacing="md" align="center">
              <Typography 
                variant="label-sm" 
                color="accent"
                weight="medium"
              >
                {label}
              </Typography>
              
              <Typography 
                variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                weight="semibold"
                color="primary"
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography 
                variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                color="secondary"
                style={{ maxWidth: '700px' }}
              >
                {description}
              </Typography>
            </VStack>
          </div>
          
          {/* Team Grid */}
          <div className="pkl-team-grid">
            {members.map((member, index) => (
              <div key={index} className="pkl-team-card">
                <div className="pkl-team-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="pkl-team-image"
                  />
                </div>
                
                <div className="pkl-team-info">
                  <div className="pkl-team-name">
                    {member.name}
                  </div>
                  <div className="pkl-team-role">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

PKLTeam.displayName = 'PKLTeam';

