import { useCallback } from 'react';
import { ContentBlock } from '../types/content';
import * as queries from '../utils/contentQueries';

/**
 * Hook that provides component manipulation utilities
 */
export function useContentBlocks() {
  const getBlocksByType = useCallback((blocks: ContentBlock[], blockType: string): ContentBlock[] => {
    return queries.getBlocksByType(blocks, blockType);
  }, []);

  const getBlockContent = useCallback((blocks: ContentBlock[], blockType: string): string | undefined => {
    return queries.getBlockContent(blocks, blockType);
  }, []);

  const getBlockConfig = useCallback((blocks: ContentBlock[], blockType: string): any => {
    return queries.getBlockConfig(blocks, blockType);
  }, []);

  return {
    getBlocksByType,
    getBlockContent,
    getBlockConfig
  };
} 