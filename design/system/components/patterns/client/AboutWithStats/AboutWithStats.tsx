'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../layout/frames/section/Section';
import { Container } from '../../../layout/frames/container/Container';
import { VStack } from '../../../layout/utilities/vStack/VStack';

export interface AboutStatItem {
  id: string;
  value: string;
  title: string;
  description: string;
}

export interface AboutWithStatsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  stats: AboutStatItem[];
}

export interface AboutWithStatsProps {
  id?: string;
  content: AboutWithStatsContent;
  className?: string;
}

const AboutWithStats = ({ id = "om-oss", content, className }: AboutWithStatsProps) => {
  const { title, titleAccent, subtitle, stats } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 640px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
              gap: var(--foundation-space-4) !important;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (min-width: 1025px) {
            .stats-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
        `
      }} />
      {/* About Section */}
      <Section 
        id={id} 
        className={className}
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-24)',
          paddingBottom: 'var(--foundation-space-16)'
        }}
      >
        <Container maxWidth="xl" align="center">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <VStack spacing="lg" align="center">
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
                style={{
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                  textAlign: 'center'
                }}
              >
                {subtitle}
              </Typography>
            </VStack>
          </div>
        </div>
      </Section>

      {/* Statistics Section */}
      <Section 
        id="stats"
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-16)',
          paddingBottom: 'var(--foundation-space-32)'
        }}
      >
        <div style={{ 
          maxWidth: 'var(--size-page-max-width)',
          margin: '0 auto',
          padding: '0 var(--foundation-space-6)'
        }}>
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--foundation-space-6)',
              textAlign: 'center',
              maxWidth: 'var(--size-page-max-width)',
              width: '100%'
            }}
          >
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                style={{
                  textAlign: 'center',
                  padding: 'var(--foundation-space-6)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--foundation-radius-xl)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Typography 
                  variant="h1" 
                  weight="bold" 
                  color="inverse"
                  style={{
                    fontSize: 'clamp(3rem, 5vw, 4rem)',
                    lineHeight: 'var(--foundation-typography-line-height-tight)',
                    marginBottom: 'var(--foundation-space-3)',
                    color: 'var(--text-primary)',
                    background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="h4" 
                  weight="semibold" 
                  color="inverse"
                  style={{
                    marginBottom: 'var(--foundation-space-2)',
                    color: 'var(--text-primary)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.25rem)'
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="body-sm" 
                  color="inverse"
                  style={{
                    lineHeight: 'var(--foundation-typography-line-height-normal)',
                    color: 'var(--text-primary)',
                    opacity: 0.8,
                    fontSize: '0.9rem'
                  }}
                >
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export { AboutWithStats };
