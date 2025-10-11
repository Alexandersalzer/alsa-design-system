// ===============================================
// src/design/system/components/patterns/client/BlogSection/BlogSection.tsx
// BLOG SECTION - Display blog posts in a grid
// ===============================================

'use client';

import React from 'react';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Button } from '../../../../../system/components/primitives/Button';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

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
        <Stack spacing="lg" align="center">
          {/* Header */}
          <Stack spacing="md" align="center">
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
          </Stack>

          {/* Blog Posts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--foundation-space-6)',
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
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--surface-subtle)'
                  }}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{
                  padding: 'var(--foundation-space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  gap: 'var(--foundation-space-4)'
                }}>
                  {/* Meta */}
                  <Cluster spacing="sm" align="center" wrap>
                    {post.category && (
                      <div style={{
                        padding: 'var(--foundation-space-1) var(--foundation-space-3)',
                        backgroundColor: 'var(--accent-50)',
                        borderRadius: 'var(--foundation-radius-full)',
                        border: '1px solid var(--accent-200)'
                      }}>
                        <Typography variant="body-xs" weight="semibold" color="accent">
                          {post.category}
                        </Typography>
                      </div>
                    )}
                    <Typography variant="body-xs" color="secondary">
                      {post.date}
                    </Typography>
                    {post.readTime && (
                      <>
                        <Typography variant="body-xs" color="secondary">•</Typography>
                        <Typography variant="body-xs" color="secondary">
                          {post.readTime}
                        </Typography>
                      </>
                    )}
                  </Cluster>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    weight="bold"
                    color="heading"
                    style={{ textAlign: 'left' }}
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

                  {/* Author & Read More */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: 'var(--foundation-space-4)',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    {post.author && (
                      <Typography variant="body-sm" weight="medium" color="secondary">
                        {post.author}
                      </Typography>
                    )}
                    {post.link && (
                      <Typography 
                        variant="body-sm" 
                        weight="semibold" 
                        color="accent"
                        style={{ cursor: 'pointer' }}
                      >
                        Läs mer →
                      </Typography>
                    )}
                  </div>
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
        </Stack>
      </div>
    </section>
  );
};

BlogSection.displayName = 'BlogSection';

