'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { getLocalized } from '@/lib/localize';

export default function ActivitiesCarousel({ activities }) {
  const { language, t } = useLanguage();
  const dateLocale = t('date_locale');

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  const total = activities.length;

  const goTo = useCallback((index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeIndex, isAnimating]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 500);
  }, [total, isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 500);
  }, [total, isAnimating]);

  // Auto-scroll every 5s
  useEffect(() => {
    if (isPaused || total <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next, total]);

  if (total === 0) return null;

  const current = activities[activeIndex];
  const dateStr = new Date(current.date).toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dateUpperStr = new Date(current.date).toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const postOfText = t('post_of', { current: activeIndex + 1, total });

  // Calculate card positions — stacking deck effect
  const getCardStyle = (index) => {
    let diff = index - activeIndex;
    // Wrap around for circular navigation
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    const absOffset = Math.abs(diff);

    if (absOffset > 2) {
      return {
        transform: `translateX(${diff < 0 ? '-40' : '40'}%) scale(0.7)`,
        opacity: 0,
        zIndex: 0,
        filter: 'grayscale(100%) brightness(0.5)',
        pointerEvents: 'none',
      };
    }

    // Active card
    if (isActive) {
      return {
        transform: 'translateX(0%) scale(1)',
        opacity: 1,
        zIndex: 10,
        filter: 'none',
        pointerEvents: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      };
    }

    // Cards behind — offset left/right, scaled down, grayscale
    const translateX = diff * 15; // percentage offset per position
    const scale = 1 - absOffset * 0.1;
    const opacity = 1 - absOffset * 0.25;

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity: Math.max(opacity, 0.3),
      zIndex: 10 - absOffset,
      filter: `grayscale(80%) brightness(0.6)`,
      pointerEvents: absOffset === 1 ? 'auto' : 'none',
      cursor: absOffset === 1 ? 'pointer' : 'default',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    };
  };

  return (
    <>
      <style>{`
        .act-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: stretch;
        }
        @media (min-width: 768px) {
          .act-wrapper {
            grid-template-columns: 1.15fr 1fr;
            gap: 28px;
          }
        }

        /* ── Stacking Slider ── */
        .act-stack-slider {
          position: relative;
          height: 220px;
          overflow: visible;
        }
        @media (min-width: 768px) {
          .act-stack-slider {
            height: 300px;
          }
        }

        .act-card {
          position: absolute;
          top: 0;
          left: 12.5%;
          width: 75%;
          height: 100%;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity, filter;
        }

        .act-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Overlay at bottom of active card */
        .act-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px;
          background: linear-gradient(transparent 0%, rgba(0,0,0,0.75) 100%);
          z-index: 2;
          pointer-events: none;
        }

        .act-card-title {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 3px;
          line-height: 1.3;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .act-card-date {
          color: rgba(255,255,255,0.65);
          font-size: 12px;
        }

        /* Featured star badge */
        .act-star-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(245,158,11,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(245,158,11,0.4);
        }

        /* ── Detail Card ── */
        .act-detail {
          border-radius: 18px;
          border: 1px solid #e7e5e4;
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #fafaf9;
          height: 220px;
        }
        @media (min-width: 768px) {
          .act-detail {
            padding: 30px 36px 28px;
            height: 300px;
          }
        }

        .act-detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .act-detail-date-text {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #78716c;
        }

        .act-badge {
          display: inline-flex;
          padding: 4px 14px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #1e3a5f;
          color: white;
        }

        .act-detail-title {
          font-size: 20px;
          font-weight: 700;
          color: #1c1917;
          line-height: 1.3;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .act-detail-title {
            font-size: 24px;
          }
        }

        .act-detail-desc {
          color: #78716c;
          font-size: 14px;
          line-height: 1.6;
          flex-grow: 1;
          text-align: justify;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .act-detail-desc {
            font-size: 15px;
            -webkit-line-clamp: 4;
          }
        }

        .act-detail-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #e7e5e4;
        }

        .act-counter {
          font-size: 13px;
          color: #a8a29e;
        }

        .act-read-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #1c1917;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .act-read-link:hover {
          gap: 10px;
        }

        /* ── Dots ── */
        .act-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          grid-column: 1 / -1;
        }
        @media (min-width: 768px) {
          .act-dots {
            grid-column: 1 / 2;
            margin-top: 12px;
          }
        }
        .act-dot-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d6d3d1;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .act-dot-btn.active {
          background: #1e3a5f;
          width: 22px;
          border-radius: 10px;
        }

        /* Animate detail content on change */
        .act-detail-content {
          animation: actDetailSlideIn 0.4s ease-out;
        }
        @keyframes actDetailSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="act-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Stacking card slider */}
        <div className="act-stack-slider">
          {activities.map((act, i) => {
            const style = getCardStyle(i);
            const isActive = i === activeIndex;
            const diff = (() => {
              let d = i - activeIndex;
              if (d > total / 2) d -= total;
              if (d < -total / 2) d += total;
              return d;
            })();

            return (
              <div
                key={act._id}
                className="act-card"
                style={style}
                onClick={() => {
                  if (diff === -1) prev();
                  else if (diff === 1) next();
                }}
              >
                <img
                  src={act.thumbnail || (act.images && act.images.length > 0 ? act.images[0] : act.image) || '/placeholder.jpg'}
                  alt={getLocalized(act.title, language)}
                />
                {/* Only show overlay on the active card */}
                {isActive && (
                  <div className="act-card-overlay">
                    <div className="act-card-title">
                      {getLocalized(act.title, language)}
                    </div>
                    <div className="act-card-date">
                      {new Date(act.date).toLocaleDateString(dateLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
                {isActive && act.featured && (
                  <div className="act-star-badge">
                    <Star size={13} fill="white" color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail card */}
        <div className="act-detail">
          <div className="act-detail-content" key={activeIndex}>
            <div className="act-detail-header">
              <span className="act-detail-date-text">{dateUpperStr}</span>
              <span className="act-badge">{current.type}</span>
            </div>

            <h3 className="act-detail-title">
              {getLocalized(current.title, language)}
            </h3>

            <p className="act-detail-desc">
              {getLocalized(current.description, language)}
            </p>

            <div className="act-detail-footer">
              <span className="act-counter">{postOfText}</span>
              <Link href={`/activities/${current._id}`} className="act-read-link">
                {t('read_full_post')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="act-dots">
            {activities.map((_, i) => (
              <button
                key={i}
                className={`act-dot-btn${i === activeIndex ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to activity ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}