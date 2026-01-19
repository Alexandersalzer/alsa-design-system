import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Avatar } from '../../../components/media/Avatar';
import { Badge } from '../../../components/feedback/Badge';
import './TestimonialCard.css';

interface TestimonialCardProps {
  componentKey?: string;
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating: number;
  /** Optional external link (e.g., Trustpilot review URL, X/Twitter post URL) */
  link?: string;
  /** Optional avatar image source */
  avatarSrc?: string;
  /** Show badge on avatar (e.g., for verified reviews) */
  showBadge?: boolean;
  /** Badge content (e.g., platform icon or text) */
  badgeContent?: React.ReactNode;
  /** Badge variant */
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default';
}

export type { TestimonialCardProps };

export function TestimonialCard({
  componentKey,
  text,
  author,
  authorInitial,
  caseType,
  rating,
  link,
  avatarSrc,
  showBadge = false,
  badgeContent,
  badgeVariant = 'info'
}: TestimonialCardProps) {
  const CardWrapper = link ? 'a' : 'div';
  const cardProps = link
    ? {
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'testimonial-card-link'
      }
    : {};

  const avatarElement = (
    <Avatar
      name={author}
      src={avatarSrc}
      variant="outline"
      size="md"
      shape="full"
      colorPalette="gray"
    />
  );

  return (
    <CardWrapper {...cardProps}>
      <Card variant="outlined" className="testimonial-card" data-component-key={componentKey}>
        <VStack spacing="md" className="testimonial-card-content">
          {/* Author Info at top */}
          <div className="testimonial-author">
            {showBadge ? (
              <Badge
                content={badgeContent}
                variant={badgeVariant}
                size="sm"
                placement="bottom-right"
                shape="circle"
                showOutline={true}
                isDot={!badgeContent}
              >
                {avatarElement}
              </Badge>
            ) : (
              avatarElement
            )}
            <VStack spacing="xs" className="testimonial-author-details">
              <Typography variant="body-sm" weight="bold" color="primary">
                {author}
              </Typography>
              <Typography variant="body-xs" weight="regular" color="tertiary">
                {caseType}
              </Typography>
            </VStack>
          </div>

          {/* Quote Text at bottom */}
          <Typography
            variant="body-md"
            weight="regular"
            color="secondary"
            className="testimonial-text"
          >
            {text}
          </Typography>
        </VStack>
      </Card>
    </CardWrapper>
  );
}