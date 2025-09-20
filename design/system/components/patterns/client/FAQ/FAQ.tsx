'use client';

import './FAQ.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface FAQProps {
  content: FAQContent;
}

const FAQ = ({ content }: FAQProps) => {
  const { title, subtitle, items } = content;

  return (
    <section id="faq" className="faq-section" role="region" aria-label="Vanliga frågor">
      <div className="faq-container">
        {/* Header */}
        <Stack spacing="xl" align="center" className="faq-header">
          <Typography 
            variant="h2" 
            weight="bold"
            color="heading"
            className="faq-title"
          >
            {title.split(' ').map((word, index) => {
              if (word === 'frågor') {
                return (
                  <span key={index} className="faq-title-accent">
                    {word}
                  </span>
                );
              }
              return word + ' ';
            })}
          </Typography>
          <Typography 
            variant="body-xl" 
            color="secondary" 
            className="faq-subtitle"
          >
            {subtitle}
          </Typography>
        </Stack>

        {/* FAQ Grid */}
        <div className="faq-grid">
          {items.map((item, index) => (
            <Card key={index} className="faq-item">
              <Stack spacing="md">
                <Typography 
                  variant="h4" 
                  weight="semibold" 
                  color="heading" 
                  className="faq-question"
                >
                  {item.question}
                </Typography>
                <Typography 
                  variant="body-md" 
                  color="secondary" 
                  className="faq-answer"
                >
                  {item.answer}
                </Typography>
              </Stack>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FAQ };
export type { FAQItem, FAQContent, FAQProps };
