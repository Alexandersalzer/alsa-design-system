// ===============================================
// design/system/components/patterns/client/PKLFAQCategories/PKLFAQCategories.tsx
// PKL FAQ CATEGORIES - FAQ with sidebar category navigation
// ===============================================

'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { PlusIcon } from '@heroicons/react/24/outline';

// ===== TYPE DEFINITIONS =====

export interface PKLFAQCategoryItem {
  id: string;
  question: string;
  answer: string;
}

export interface PKLFAQCategory {
  id: string;
  label: string;
  title: string;
  description?: string;
  faqs: PKLFAQCategoryItem[];
}

export interface PKLFAQCategoriesContent {
  heading: string;
  description: string;
  categories: PKLFAQCategory[];
}

export interface PKLFAQCategoriesProps {
  content: PKLFAQCategoriesContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN FAQ CATEGORIES COMPONENT =====

export const PKLFAQCategories: React.FC<PKLFAQCategoriesProps> = ({
  content,
  id = "pkl-faq-categories",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { heading, description, categories } = content;
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isExpanded = (itemId: string) => expandedItems.has(itemId);
  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Collapse all items when switching category
    setExpandedItems(new Set());
  };

  return (
    <>
      <style>{`
        .pkl-faq-categories-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
        }
        
        .pkl-faq-categories-main-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
          grid-column: 1 / -1; /* Span both columns */
        }
        
        .pkl-faq-categories-content-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--foundation-space-12);
          align-items: start;
        }
        
        .pkl-faq-categories-sidebar-wrapper {
          /* Wrapper that contains sidebar + step indicator */
          display: flex;
          flex-direction: column;
        }
        
        .pkl-faq-categories-sidebar {
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-2);
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-6);
        }
        
        .pkl-faq-category-button {
          display: block;
          width: 100%;
          padding: var(--foundation-space-4);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-md);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
          text-align: center; /* Center align text */
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
        }
        
        .pkl-faq-category-button:hover {
          background: var(--surface-subtle);
          color: var(--text-primary);
          transform: translateX(4px);
        }
        
        .pkl-faq-category-button.active {
          background: var(--surface-subtle);
          color: var(--text-primary);
          border-color: var(--accent-500);
          font-weight: var(--font-weight-semibold);
        }
        
        .pkl-faq-categories-main-content {
          min-height: 400px;
        }
        
        .pkl-faq-category-header {
          margin-bottom: var(--foundation-space-8);
          padding-bottom: var(--foundation-space-6);
          border-bottom: 1px solid var(--border-medium);
        }
        
        .pkl-faq-accordion {
          background: transparent;
          border-radius: 0;
          padding: 0;
        }
        
        .pkl-faq-item {
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.2s ease;
          background: transparent;
        }
        
        .pkl-faq-item:last-child {
          border-bottom: none;
        }
        
        .pkl-faq-question-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--foundation-space-6);
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: var(--foundation-space-4);
          transition: background 0.2s ease;
        }
        
        .pkl-faq-question-text {
          flex: 1;
          color: var(--text-primary);
          font-size: ${textScale === 'lg' ? 'clamp(1.125rem, 1.5vw, 1.375rem)' : textScale === 'sm' ? 'var(--foundation-typography-size-lg)' : 'var(--foundation-typography-size-xl)'};
          font-weight: var(--font-weight-semibold);
          line-height: 1.4;
        }
        
        .pkl-faq-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: var(--accent-500);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pkl-faq-icon.expanded {
          transform: rotate(45deg);
        }
        
        .pkl-faq-answer {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.3s ease,
                      padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pkl-faq-answer.collapsed {
          max-height: 0;
          opacity: 0;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-faq-answer.expanded {
          max-height: 1000px;
          opacity: 1;
          padding: 0 var(--foundation-space-6) var(--foundation-space-6);
        }
        
        .pkl-faq-answer-content {
          color: var(--text-secondary);
          font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-md)' : textScale === 'sm' ? 'var(--foundation-typography-size-xs)' : 'var(--foundation-typography-size-sm)'};
          line-height: 1.75;
        }
        
        /* Step indicator - hidden on desktop */
        .pkl-faq-step-indicator {
          display: none;
        }
        
        @media (max-width: 1200px) {
          .pkl-faq-categories-content-grid {
            grid-template-columns: 1fr;
            gap: var(--foundation-space-8);
          }
          
          .pkl-faq-categories-main-header {
            margin-bottom: var(--foundation-space-8);
          }
          
          .pkl-faq-categories-sidebar {
            position: static;
            overflow-x: auto;
            white-space: nowrap;
            padding: var(--foundation-space-4) var(--foundation-space-6);
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin; /* Show scrollbar on mobile for clarity */
            scrollbar-color: var(--accent-500) var(--surface-subtle);
            background: var(--surface-subtle); /* More visible background */
            margin-bottom: var(--foundation-space-6);
          }
          
          .pkl-faq-categories-sidebar::-webkit-scrollbar {
            height: 6px; /* Show thin scrollbar */
          }
          
          .pkl-faq-categories-sidebar::-webkit-scrollbar-track {
            background: var(--surface-subtle);
          }
          
          .pkl-faq-categories-sidebar::-webkit-scrollbar-thumb {
            background: var(--accent-500);
            border-radius: var(--radius-full);
          }
          
          .pkl-faq-category-button {
            flex-shrink: 0;
            white-space: nowrap;
            padding: var(--foundation-space-3) var(--foundation-space-6); /* Larger touch target */
            font-size: var(--foundation-typography-size-sm);
            border-radius: var(--radius-full); /* Pill shape for clarity */
            text-align: center; /* Center align on mobile */
          }
          
          .pkl-faq-category-button.active {
            background: var(--accent-500); /* More visible active state */
            color: white;
            border-color: var(--accent-500);
          }
          
          /* Step indicator - visible on mobile */
          .pkl-faq-step-indicator {
            display: flex !important; /* Show on mobile */
            justify-content: center;
            align-items: center;
            gap: var(--foundation-space-3);
            padding: var(--foundation-space-4) 0 var(--foundation-space-2);
          }
          
          .pkl-faq-step-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--border-medium);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .pkl-faq-step-dot.active {
            background: var(--accent-500);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
            transform: scale(1.3);
          }
        }
        
        @media (max-width: 768px) {
          .pkl-faq-question-button {
            padding: var(--foundation-space-5);
          }
          
          .pkl-faq-answer.expanded {
            padding: 0 var(--foundation-space-5) var(--foundation-space-5);
          }
          
          .pkl-faq-answer.collapsed {
            padding: 0 var(--foundation-space-5);
          }
        }
      `}</style>

      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom,
          paddingLeft: 'var(--foundation-space-6)',
          paddingRight: 'var(--foundation-space-6)'
        }}
      >
        <div className="pkl-faq-categories-outer-container">
          {/* Content Grid - Header + Sidebar + Main */}
          <div className="pkl-faq-categories-content-grid">
            {/* Main Header - Spans both columns */}
            <div className="pkl-faq-categories-main-header">
              <Stack spacing="md" align="center">
                <Typography 
                  variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                  weight="semibold"
                  color="primary"
                  as="h1"
                >
                  {heading}
                </Typography>
                
                <Typography 
                  variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                  color="secondary"
                  style={{
                    maxWidth: 'var(--size-page-narrow-max-width)'
                  }}
                >
                  {description}
                </Typography>
              </Stack>
            </div>

            {/* Sidebar - Category Navigation */}
            <div className="pkl-faq-categories-sidebar-wrapper">
              <div className="pkl-faq-categories-sidebar">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`pkl-faq-category-button ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              {/* Step indicator dots - only visible on mobile/tablet */}
              <div className="pkl-faq-step-indicator">
                {categories.map((category) => (
                  <div
                    key={`dot-${category.id}`}
                    className={`pkl-faq-step-dot ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* Main Content - FAQ Items */}
            <div className="pkl-faq-categories-main-content">
              {activeCategoryData && (
                <>
                  {/* Category Header */}
                  <div className="pkl-faq-category-header">
                    <Stack spacing="sm" align="start">
                      <Typography 
                        variant="label-sm" 
                        color="accent"
                        weight="medium"
                      >
                        {activeCategoryData.label}
                      </Typography>
                      
                      <Typography 
                        variant={textScale === 'lg' ? 'h2' : textScale === 'sm' ? 'h4' : 'h3'}
                        weight="semibold"
                        color="primary"
                        as="h2"
                      >
                        {activeCategoryData.title}
                      </Typography>
                      
                      {activeCategoryData.description && (
                        <Typography 
                          variant={textScale === 'lg' ? 'body-lg' : 'body-md'}
                          color="secondary"
                        >
                          {activeCategoryData.description}
                        </Typography>
                      )}
                    </Stack>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="pkl-faq-accordion">
                    {activeCategoryData.faqs.map((faq) => {
                      const expanded = isExpanded(faq.id);
                      
                      return (
                        <div key={faq.id} className="pkl-faq-item">
                          <button 
                            className="pkl-faq-question-button" 
                            onClick={() => toggleItem(faq.id)}
                            aria-expanded={expanded}
                            aria-controls={`faq-answer-${faq.id}`}
                          >
                            <span className="pkl-faq-question-text">
                              {faq.question}
                            </span>
                            <PlusIcon className={`pkl-faq-icon ${expanded ? 'expanded' : ''}`} />
                          </button>
                          <div 
                            id={`faq-answer-${faq.id}`} 
                            role="region"
                            aria-labelledby={`faq-question-${faq.id}`}
                            className={`pkl-faq-answer ${expanded ? 'expanded' : 'collapsed'}`}
                          >
                            <div className="pkl-faq-answer-content">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

