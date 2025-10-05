// ===============================================
// design/system/components/patterns/client/ProcessSection/ProcessSection.tsx
// PROCESS SECTION PATTERN - 4 cards left, header right layout
// ===============================================

import React from 'react';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { ArrowRightIcon } from 'lucide-react';
import './ProcessSection.css';

// ===== TYPE DEFINITIONS =====

export interface ProcessCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ProcessSectionProps {
  id?: string;
  className?: string;
  
  // Content
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  cards: ProcessCard[];
  
  // Layout options
  spacing?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PROCESS SECTION COMPONENT =====

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  id = "process",
  className,
  title,
  subtitle,
  buttonText,
  buttonHref,
  onButtonClick,
  cards,
  spacing = 'lg'
}) => {
  // Ensure we have exactly 4 cards for the 2x2 layout
  const displayCards = cards.slice(0, 4);
  
  return (
    <Section 
      id={id}
      className={className}
      style={{
        backgroundColor: 'var(--surface-primary)',
        paddingTop: 'var(--foundation-space-40)',
        paddingBottom: 'var(--foundation-space-40)'
      }}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div className="process-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--foundation-space-16)',
          alignItems: 'center'
        }}>
          {/* Left side - 4 cards in 2x2 grid */}
          <div className="process-cards" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--foundation-space-6)'
          }}>
            {displayCards.map((card, index) => (
              <div 
                key={card.id}
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  padding: 'var(--foundation-space-6)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--accent-500)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--foundation-space-4)',
                  color: 'white'
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--foundation-space-2) 0'
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right side - Large header with paragraph and button */}
          <div className="process-content process-header" style={{
            textAlign: 'left',
            paddingLeft: 'var(--foundation-space-8)'
          }}>
            <h2 className="process-title" style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: '0 0 var(--foundation-space-6) 0',
              lineHeight: '1.2'
            }}>
              {title}
            </h2>
            <p className="process-subtitle" style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              margin: '0 0 var(--foundation-space-8) 0',
              lineHeight: '1.6'
            }}>
              {subtitle}
            </p>
            {buttonHref ? (
              <a 
                href={buttonHref}
                style={{
                  backgroundColor: 'var(--accent-500)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--foundation-space-4) var(--foundation-space-8)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--foundation-space-2)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-400)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-500)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {buttonText}
                <ArrowRightIcon size={20} />
              </a>
            ) : (
              <button 
                onClick={onButtonClick}
                style={{
                  backgroundColor: 'var(--accent-500)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--foundation-space-4) var(--foundation-space-8)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--foundation-space-2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-400)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-500)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {buttonText}
                <ArrowRightIcon size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

ProcessSection.displayName = 'ProcessSection';

// ===== USAGE EXAMPLE =====
/*
import { ZapIcon, UserCheckIcon, ShieldIcon, CheckCircleIcon } from 'lucide-react';

const exampleCards: ProcessCard[] = [
  {
    id: 'fast',
    icon: <ZapIcon size={24} />,
    title: 'Snabb Hantering',
    description: 'Vi hjälper dig snabbt och effektivt att få rätt ersättning för skador eller olyckor.'
  },
  {
    id: 'personal',
    icon: <UserCheckIcon size={24} />,
    title: 'Personlig Rådgivning',
    description: 'Få kostnadsfri juridisk rådgivning direkt från våra experter inom skadeståndsrätt.'
  },
  {
    id: 'secure',
    icon: <ShieldIcon size={24} />,
    title: 'Trygga Processer',
    description: 'Vi hanterar allt pappersarbete och ser till att din process blir enkel och transparent.'
  },
  {
    id: 'guarantee',
    icon: <CheckCircleIcon size={24} />,
    title: 'Garantier',
    description: 'Du betalar ingenting förrän vi vinner ditt ärende. No win, no fee.'
  }
];

<ProcessSection 
  title="Så här enkelt fungerar det"
  subtitle="Tre enkla steg till din ersättning. Vi hanterar allt åt dig så att du kan fokusera på det som är viktigt."
  buttonText="Starta din bedömning"
  buttonHref="#contact"
  cards={exampleCards}
  spacing="lg"
/>
*/
