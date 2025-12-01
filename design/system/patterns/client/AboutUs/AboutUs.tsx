'use client';

import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout';
import { Card } from '../../../components/layout';
import React from 'react';

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
}

export interface AboutUsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  story: {
    title: string;
    content: string;
  };
  values: AboutValue[];
  difference: {
    title: string;
    points: string[];
  };
  team: AboutTeamMember[];
}

export interface AboutUsProps {
  content: AboutUsContent;
}

export function AboutUs({ content }: AboutUsProps) {
  const { title, titleAccent, subtitle, story, values = [], difference, team = [] } = content;

  return (
    <div
      style={{
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)',
        backgroundColor: 'transparent'
      }}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'var(--size-page-max-width)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--foundation-space-12)' }}>
            <Typography
              variant="h2"
              weight="bold"
              color="inverse"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                color: 'var(--surface-page)',
                marginBottom: 'var(--foundation-space-4)'
              }}
            >
              {title.split(' ').map((word, index) => {
                if (titleAccent && word === titleAccent) {
                  return (
                    <span 
                      key={index} 
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </Typography>

            <Typography 
              variant="body-xl" 
              color="inverse"
              style={{
                color: 'var(--surface-page)',
                opacity: 0.9,
                maxWidth: 'var(--size-page-narrow-max-width)',
                margin: '0 auto'
              }}
            >
              {subtitle}
            </Typography>
          </div>

          {/* Story Section */}
          <div style={{ 
            width: '100%', 
            maxWidth: 'var(--size-page-content-max-width)', 
            marginBottom: 'var(--foundation-space-16)' 
          }}>
            <Card
              variant="elevated"
              padding="lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--foundation-radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
              }}
            >
              <VStack spacing="md">
                <Typography
                  variant="h3"
                  weight="bold"
                  style={{ color: 'var(--surface-page)' }}
                >
                  {story.title}
                </Typography>
                <Typography
                  variant="body-lg"
                  style={{ 
                    color: 'var(--surface-page)', 
                    opacity: 0.9,
                    lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                  }}
                >
                  {story.content}
                </Typography>
              </VStack>
            </Card>
          </div>

          {/* Values Section */}
          <div style={{ 
            width: '100%', 
            marginBottom: 'var(--foundation-space-16)' 
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--foundation-space-6)',
              maxWidth: 'var(--size-page-max-width)',
              margin: '0 auto'
            }}>
              {values.map((value) => (
                <Card
                  key={value.id}
                  variant="elevated"
                  padding="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--foundation-radius-xl)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <VStack spacing="md" align="center">
                    <div style={{
                      background: 'linear-gradient(135deg, #1f2937, #64748b)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {value.icon}
                      </div>
                    </div>
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: 'var(--surface-page)' }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body-md"
                      style={{ 
                        color: 'var(--surface-page)', 
                        opacity: 0.9,
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                      }}
                    >
                      {value.description}
                    </Typography>
                  </VStack>
                </Card>
              ))}
            </div>
          </div>

          {/* What Makes Us Different */}
          <div style={{ 
            width: '100%', 
            maxWidth: 'var(--size-page-content-max-width)', 
            marginBottom: 'var(--foundation-space-16)' 
          }}>
            <Card
              variant="elevated"
              padding="lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--foundation-radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
              }}
            >
              <VStack spacing="md">
                <Typography
                  variant="h3"
                  weight="bold"
                  style={{ color: 'var(--surface-page)' }}
                >
                  {difference?.title}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-3)' }}>
                  {(difference?.points || []).map((point, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--foundation-space-3)' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: 'white',
                          borderRadius: '50%'
                        }} />
                      </div>
                      <Typography
                        variant="body-md"
                        style={{ 
                          color: 'var(--surface-page)', 
                          opacity: 0.9,
                          lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                        }}
                      >
                        {point}
                      </Typography>
                    </div>
                  ))}
                </div>
              </VStack>
            </Card>
          </div>

          {/* Team Section */}
          <div style={{ 
            width: '100%', 
            maxWidth: 'var(--size-page-max-width)' 
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--foundation-space-6)'
            }}>
              {team.map((member) => (
                <Card
                  key={member.id}
                  variant="elevated"
                  padding="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--foundation-radius-xl)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <VStack spacing="md" align="center">
                    <div style={{
                      background: 'linear-gradient(135deg, #1f2937, #64748b)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)',
                      overflow: 'hidden'
                    }}>
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: 'var(--surface-page)' }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body-md"
                      weight="semibold"
                      style={{ 
                        color: 'var(--accent-400)',
                        marginBottom: 'var(--foundation-space-2)'
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      style={{ 
                        color: 'var(--surface-page)', 
                        opacity: 0.9,
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                      }}
                    >
                      {member.description}
                    </Typography>
                  </VStack>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AboutUs.displayName = 'AboutUs';
