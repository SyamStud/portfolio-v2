'use client';

import Marquee from 'react-fast-marquee';

const getCleanUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('google.com') && urlObj.searchParams.has('imgurl')) {
      return urlObj.searchParams.get('imgurl');
    }
  } catch (e) {
    // Ignore invalid urls
  }
  return url;
};

const THRESHOLD = 8; // If <= this many techs, show static grid instead of marquee

export default function TechStackMarquee({ techStack }) {
  if (!techStack || techStack.length === 0) return null;

  const useMarquee = techStack.length > THRESHOLD;

  const renderItem = (tech, i, prefix = '') => (
    <div key={`${prefix}${tech.name}-${i}`} className="ts-item">
      {tech.logo && <img src={getCleanUrl(tech.logo)} alt={tech.name} loading="lazy" />}
      <span>{tech.name}</span>
    </div>
  );

  return (
    <>
      <style>{`
        .ts-section {
          padding: 20px 0;
        }
        .ts-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .ts-header-line {
          width: 24px;
          height: 1px;
          background: #d6d3d1;
        }
        .ts-header-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8a29e;
        }
        .ts-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          margin: 0 6px;
          background: white;
          border: 1px solid #e7e5e4;
          border-radius: 10px;
          white-space: nowrap;
          flex-shrink: 0;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .ts-item img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .ts-item span {
          font-size: 13px;
          font-weight: 500;
          color: #44403c;
        }
        /* Static grid when few items */
        .ts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ts-grid .ts-item {
          margin: 0;
        }
      `}</style>

      <section className="ts-section">
        <div className="ts-header">
          <div className="ts-header-line" />
          <h3 className="ts-header-text">Tech Stack</h3>
        </div>

        {useMarquee ? (
          <Marquee speed={25} gradient={true} gradientColor="#FAFAF8" gradientWidth={40} pauseOnHover={false}>
            {techStack.map((tech, i) => renderItem(tech, i, 'mq-'))}
          </Marquee>
        ) : (
          <div className="ts-grid">
            {techStack.map((tech, i) => renderItem(tech, i, 'st-'))}
          </div>
        )}
      </section>
    </>
  );
}
