// ===============================================
// src/design/system/components/patterns/client/BlogSection/BlogSection.tsx
// BLOG SECTION - Display blog posts in a grid
// ===============================================

'use client';

import React from 'react';
import { VStack } from '../../../components/layout';
import { Typography } from '../../../components/Typography';
import { Card } from '../../../components/layout';
import { Button } from '../../../../system/components';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  link?: string;
  readTime?: string;
}

export interface BlogSectionProps {
  heading: string;
  subheading?: string;
  posts: BlogPost[];
  ctaText?: string;
  ctaLink?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  heading,
  subheading,
  posts = [],
  ctaText = 'Visa alla artiklar',
  ctaLink = '/blogg'
}) => {
  return (
    <section>
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <VStack spacing="lg" align="center">
          {/* Header */}
          <VStack spacing="md" align="center">
            <Typography
              variant="h2"
              weight="bold"
              color="heading"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'center'
              }}
            >
              {heading}
            </Typography>

            {subheading && (
              <Typography
                variant="body-lg"
                weight="medium"
                color="secondary"
                align="center"
                style={{ maxWidth: 'var(--size-page-narrow-max-width)' }}
              >
                {subheading}
              </Typography>
            )}
          </VStack>

          {/* Blog Posts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--foundation-space-8)',
            width: '100%',
            maxWidth: '1200px'
          }}>
            {posts.map((post) => (
              <Card
                key={post.id}
                variant="elevated"
                radius="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  cursor: post.link ? 'pointer' : 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onClick={() => {
                  if (post.link) {
                    window.location.href = post.link;
                  }
                }}
                onMouseEnter={(e) => {
                  if (post.link) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                {post.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '220px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--surface-subtle)'
                  }}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{
                  padding: 'var(--foundation-space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <VStack spacing="sm" align="start">
                    {/* Category Badge */}
                    {post.category && (
                      <div style={{
                        padding: 'var(--foundation-space-2) var(--foundation-space-4)',
                        backgroundColor: 'var(--accent-50)',
                        borderRadius: 'var(--foundation-radius-full)',
                        border: '1px solid var(--accent-200)',
                        display: 'inline-component'
                      }}>
                        <Typography variant="body-xs" weight="bold" color="accent">
                          {post.category.toUpperCase()}
                        </Typography>
                      </div>
                    )}

                    {/* Title */}
                    <Typography
                      variant="h4"
                      weight="bold"
                      color="heading"
                      style={{ 
                        textAlign: 'left',
                        lineHeight: '1.3',
                        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)'
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                      variant="body-md"
                      weight="regular"
                      color="secondary"
                      style={{ 
                        lineHeight: '1.6', 
                        textAlign: 'left',
                        flex: 1
                      }}
                    >
                      {post.excerpt}
                    </Typography>

                    {/* Footer Meta */}
                    <div style={{
                      width: '100%',
                      paddingTop: 'var(--foundation-space-4)',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'var(--foundation-space-3)'
                      }}>
                        {/* Date and Read Time */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--foundation-space-2)' 
                        }}>
                          <Typography variant="body-sm" weight="medium" color="secondary">
                            {post.date}
                          </Typography>
                          {post.readTime && (
                            <>
                              <Typography variant="body-sm" color="secondary">•</Typography>
                              <Typography variant="body-sm" weight="medium" color="secondary">
                                {post.readTime}
                              </Typography>
                            </>
                          )}
                        </div>
                        
                        {/* Read More Link */}
                        {post.link && (
                          <Typography 
                            variant="body-sm" 
                            weight="bold" 
                            color="accent"
                            style={{ 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            Läs mer →
                          </Typography>
                        )}
                      </div>
                    </div>
                  </VStack>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          {ctaLink && (
            <Button 
              variant="accent" 
              size="lg"
              onClick={() => window.location.href = ctaLink}
            >
              {ctaText}
            </Button>
          )}
        </VStack>
      </div>
    </section>
  );
};

BlogSection.displayName = 'BlogSection';

