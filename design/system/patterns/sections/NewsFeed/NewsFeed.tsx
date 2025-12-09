// ===============================================
// design/system/patterns/sections/NewsFeed/NewsFeed.tsx
// NEWS FEED SECTION - Fetches and displays news items
// ===============================================

import React, { useEffect, useState } from 'react';
import { VStack, HStack } from '../../../components/layout';
import { H3, Body } from '../../../components/Typography';
import { NewsCard, NewsCardProps } from '../../cards/NewsCard';
import { Skeleton } from '../../../components/feedback';

// ===== TYPE DEFINITIONS =====

export interface NewsItem {
  id: string | number;
  title: string;
  excerpt?: string;
  publishedAt: string;
  imageUrl?: string;
  featured?: boolean;
  authorUsername?: string;
}

export interface NewsFeedProps {
  /** Maximum number of news items to display */
  limit?: number;
  /** News items variant */
  variant?: 'featured' | 'compact';
  /** Custom fetch function (optional) */
  fetchNews?: () => Promise<NewsItem[]>;
  /** Optional className */
  className?: string;
}

// ===== DEFAULT FETCH FUNCTION =====

const defaultFetchNews = async (): Promise<NewsItem[]> => {
  // TODO: Replace with actual API endpoint
  const response = await fetch('/api/news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  const data = await response.json();
  return data.news || [];
};

// ===== MAIN COMPONENT =====

export const NewsFeed: React.FC<NewsFeedProps> = ({
  limit = 3,
  variant = 'compact',
  fetchNews = defaultFetchNews,
  className
}) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchNews();
        setNewsItems(items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [limit, fetchNews]);

  if (loading) {
    return (
      <VStack spacing="md" className={className}>
        <H3>Nyheter från Blimpify</H3>
        <VStack spacing="sm">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} height="120px" />
          ))}
        </VStack>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing="md" className={className}>
        <H3>Nyheter från Blimpify</H3>
        <Body color="secondary">Kunde inte ladda nyheter just nu.</Body>
      </VStack>
    );
  }

  if (newsItems.length === 0) {
    return (
      <VStack spacing="md" className={className}>
        <H3>Nyheter från Blimpify</H3>
        <Body color="secondary">Inga nyheter att visa just nu.</Body>
      </VStack>
    );
  }

  return (
    <VStack spacing="md" className={className}>
      <H3>Nyheter från Blimpify</H3>
      <VStack spacing="sm">
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            excerpt={item.excerpt}
            publishedAt={item.publishedAt}
            imageUrl={item.imageUrl}
            featured={item.featured}
            authorUsername={item.authorUsername}
            variant={variant}
          />
        ))}
      </VStack>
    </VStack>
  );
};
