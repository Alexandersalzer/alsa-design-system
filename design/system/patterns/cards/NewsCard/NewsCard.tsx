// ===============================================
// design/system/patterns/cards/NewsCard/NewsCard.tsx
// NEWS CARD PATTERN - Uses only design system, no custom CSS
// ===============================================

import React from 'react';
import { Card, CardContent } from '../../../components/layout';
import { VStack, HStack } from '../../../components/layout';
import { H3, Body } from '../../../components/Typography';
import { Tag } from '../../../components/feedback';
import { Icon } from '../../../components/media';
import { Image } from '../../../components/media/Image';
import { SparklesIcon } from '@heroicons/react/24/outline';
import './NewsCard.css';

// ===== TYPE DEFINITIONS =====

export interface NewsCardProps {
  // Content
  title: string;
  excerpt?: string;
  publishedAt: string;
  imageUrl?: string;
  featured?: boolean;
  authorUsername?: string;
  
  // Layout variants
  variant?: 'featured' | 'compact';
  
  // Interaction
  onClick?: () => void;
  
  // Styling
  className?: string;
}

// ===== HELPER FUNCTIONS =====

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ===== MAIN COMPONENT =====

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  publishedAt,
  imageUrl,
  featured = false,
  authorUsername,
  variant = 'compact',
  onClick,
  className
}) => {
  
  // Featured card - large with image on top
  if (variant === 'featured') {
    return (
      <Card
        interactive
        onCardClick={onClick}
        variant="outlined"
        className={className}
      >
        {imageUrl && (
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-subtle)'
          }}>
            <Image
              src={imageUrl}
              alt={title}
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardContent>
          <VStack spacing="sm" align="start">
            <HStack spacing="xs" align="center">
              <H3>{title}</H3>
              {featured && (
                <Tag variant="accent">
                  <Icon size="xs">
                    <SparklesIcon />
                  </Icon>
                </Tag>
              )}
            </HStack>
            {excerpt && (
              <Body size="sm" color="secondary">
                {excerpt}
              </Body>
            )}
            <Body size="xs" color="tertiary">
              {formatDate(publishedAt)}
              {authorUsername && ` • ${authorUsername}`}
            </Body>
          </VStack>
        </CardContent>
      </Card>
    );
  }
  
  // Compact card - horizontal layout with small image on right
  return (
    <Card
      interactive
      onCardClick={onClick}
      variant="outlined"
      padding="md"
      className={className}
    >
      <HStack spacing="md" align="center">
        <VStack spacing="sm" align="start" style={{ flex: 1 }}>
          <HStack spacing="xs" align="center">
            <Body weight="semibold" color="primary">
              {title}
            </Body>
            {featured && (
              <Tag variant="accent" size="small">
                <Icon size="xs">
                  <SparklesIcon />
                </Icon>
              </Tag>
            )}
          </HStack>
          {excerpt && (
            <Body size="sm" color="secondary">
              {excerpt}
            </Body>
          )}
          <Body size="xs" color="tertiary">
            {formatDate(publishedAt)}
            {authorUsername && ` • ${authorUsername}`}
          </Body>
        </VStack>
        {imageUrl && (
          <div style={{
            width: '80px',
            height: '80px',
            minWidth: '80px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-subtle)',
            flexShrink: 0
          }}>
            <Image
              src={imageUrl}
              alt={title}
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              sizes="80px"
            />
          </div>
        )}
      </HStack>
    </Card>
  );
};