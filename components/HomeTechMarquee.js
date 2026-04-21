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

export default function HomeTechMarquee({ techs }) {
  if (!techs || techs.length === 0) return null;

  const row1 = techs;
  const row2 = [...techs].reverse();

  return (
    <>
      <style>{`
        .htm-marquee-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 10px 0;
        }
        /* Prevent child transitions from interfering with marquee transform */
        .htm-marquee-container .rfm-marquee-container {
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .htm-tech {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 28px;
          flex-shrink: 0;
          cursor: default;
          /* Remove transition on the item itself to prevent jank */
        }
        .htm-tech:hover .htm-icon img {
          transform: scale(1.12);
        }
        .htm-tech:hover .htm-label {
          color: #44403c;
        }
        .htm-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .htm-icon img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          transition: transform 0.3s ease;
          /* Hardware acceleration for smooth rendering */
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .htm-label {
          font-size: 12px;
          font-weight: 500;
          color: #78716c;
          white-space: nowrap;
          text-align: center;
          transition: color 0.3s ease;
        }
        .htm-fallback {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e7e5e4, #d6d3d1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #78716c;
          font-size: 20px;
          font-weight: 700;
        }
      `}</style>

      <div className="htm-marquee-container">
        {/* Row 1 → scrolls left */}
        <Marquee speed={30} gradient={true} gradientColor="#FAFAF8" gradientWidth={100} pauseOnHover={false}>
          {row1.map((tech, i) => (
            <div key={`r1-${i}`} className="htm-tech">
              <div className="htm-icon">
                {tech.logo ? (
                  <img src={getCleanUrl(tech.logo)} alt={tech.name} loading="lazy" />
                ) : (
                  <div className="htm-fallback">
                    {tech.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="htm-label">{tech.name}</span>
            </div>
          ))}
        </Marquee>

        {/* Row 2 → scrolls right (opposite direction) */}
        <Marquee speed={25} gradient={true} gradientColor="#FAFAF8" gradientWidth={100} pauseOnHover={false} direction="right">
          {row2.map((tech, i) => (
            <div key={`r2-${i}`} className="htm-tech">
              <div className="htm-icon">
                {tech.logo ? (
                  <img src={getCleanUrl(tech.logo)} alt={tech.name} loading="lazy" />
                ) : (
                  <div className="htm-fallback">
                    {tech.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="htm-label">{tech.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
}
