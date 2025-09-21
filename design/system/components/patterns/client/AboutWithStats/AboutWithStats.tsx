'use client';

import './AboutWithStats.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';

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
      <Section id={id} className={`about-section ${className || ''}`}>
        <div className="about-container">
          <div className="about-content">
            <Typography variant="h2" weight="bold" color="heading" className="about-title">
              {title.split(' ').map((word, index) => {
                if (titleAccent && word === titleAccent) {
                  return (
                    <span key={index} className="about-title-accent">
                      {word}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </Typography>
            
            <Typography variant="body-xl" color="secondary" className="about-subtitle">
              {subtitle}
            </Typography>
          </div>
        </div>
      </Section>

      {/* Statistics Section */}
      <Section id="stats" className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-item">
                <Typography variant="h2" weight="bold" color="heading" className="stat-value">
                  {stat.value}
                </Typography>
                <Typography variant="h5" weight="semibold" color="heading" className="stat-title">
                  {stat.title}
                </Typography>
                <Typography variant="body-md" color="secondary" className="stat-description">
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
