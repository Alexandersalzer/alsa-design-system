'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

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
      {/* About Section */}
      <Section 
        id={id} 
        className={className}
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-16)',
          paddingBottom: 'var(--foundation-space-16)'
        }}
      >
        <Container maxWidth="xl" align="center">
          <div style={{ maxWidth: 'var(--size-page-content-max-width)', width: '100%' }}>
            <Stack spacing="lg" align="center">
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
                  fontSize: 'clamp(1.1rem, 2vw, 1.2rem)'
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>
        </Container>
      </Section>

      {/* Statistics Section */}
      <Section 
        id="stats"
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-16)',
          paddingBottom: 'var(--foundation-space-40)'
        }}
      >
        <Container maxWidth="xl" align="center">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--foundation-space-8)',
              textAlign: 'center'
            }}
          >
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                style={{
                  textAlign: 'center',
                  padding: 'var(--foundation-space-4)'
                }}
              >
                <Typography 
                  variant="h2" 
                  weight="bold" 
                  color="heading"
                  style={{
                    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                    lineHeight: 'var(--foundation-typography-line-height-tight)',
                    marginBottom: 'var(--foundation-space-2)'
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="h5" 
                  weight="semibold" 
                  color="heading"
                  style={{
                    marginBottom: 'var(--foundation-space-2)'
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="body-md" 
                  color="secondary"
                  style={{
                    lineHeight: 'var(--foundation-typography-line-height-normal)'
                  }}
                >
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export { AboutWithStats };
