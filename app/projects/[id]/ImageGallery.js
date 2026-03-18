'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, title }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const trackRef = useRef(null);

    // Sync dots on scroll
    useEffect(() => {
        const track = trackRef.current;
        if (!track || images.length <= 1) return;

        const slides = track.querySelectorAll('.gallery-slide');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Array.from(slides).indexOf(entry.target);
                        if (idx !== -1) setActiveIndex(idx);
                    }
                });
            },
            { root: track, threshold: 0.6 }
        );

        slides.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, [images.length]);

    // Keyboard navigation for lightbox
    const handleKeyDown = useCallback(
        (e) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowLeft') setLightboxIndex((p) => (p - 1 + images.length) % images.length);
            if (e.key === 'ArrowRight') setLightboxIndex((p) => (p + 1) % images.length);
        },
        [lightboxOpen, images.length]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const scrollToSlide = (index) => {
        const track = trackRef.current;
        if (!track) return;
        track.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };

    if (images.length === 0) return null;

    return (
        <>
            <style>{`
        .gallery-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .gallery-track::-webkit-scrollbar { display: none; }
        .gallery-slide {
          flex: 0 0 100%;
          scroll-snap-align: start;
          border-radius: 16px;
          overflow: hidden;
          cursor: zoom-in;
          background: #e7e5e4;
        }
        .gallery-slide img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .gallery-slide:hover img { transform: scale(1.02); }
        .gallery-dot {
          width: 6px; height: 6px;
          border-radius: 9999px;
          background: #d6d3d1;
          transition: all 0.25s ease;
          flex-shrink: 0;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .gallery-dot.active { width: 20px; background: #292524; }
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(12,12,10,0.93);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
          animation: lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .lightbox-img {
          max-width: min(90vw, 1100px);
          max-height: 85vh;
          border-radius: 12px;
          object-fit: contain;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }
        .lb-btn {
          position: absolute;
          width: 44px; height: 44px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          backdrop-filter: blur(4px);
        }
        .lb-btn:hover { background: rgba(255,255,255,0.18); }
      `}</style>

            {/* ── Swipe Track ── */}
            <section className="py-8">
                <div className="gallery-track" ref={trackRef}>
                    {images.map((img, i) => (
                        <div key={i} className="gallery-slide" onClick={() => openLightbox(i)}>
                            <img src={img} alt={`${title} screenshot ${i + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Dots */}
                {images.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`gallery-dot${i === activeIndex ? ' active' : ''}`}
                                onClick={() => scrollToSlide(i)}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className="lightbox-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
                >
                    {/* Close */}
                    <button
                        className="lb-btn"
                        style={{ top: 20, right: 20 }}
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close lightbox"
                    >
                        <X size={18} />
                    </button>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p - 1 + images.length) % images.length)}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <img
                        src={images[lightboxIndex]}
                        alt={`${title} preview ${lightboxIndex + 1}`}
                        className="lightbox-img"
                    />

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p + 1) % images.length)}
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {/* Counter */}
                    {images.length > 1 && (
                        <span style={{
                            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                            fontSize: 13, color: 'rgba(255,255,255,0.45)',
                            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em',
                        }}>
                            {lightboxIndex + 1} / {images.length}
                        </span>
                    )}
                </div>
            )}
        </>
    );
}