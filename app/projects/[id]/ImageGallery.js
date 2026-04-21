'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images = [], title, youtubeUrl, videoUrl }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const media = [];
    if (youtubeUrl || videoUrl) {
        if (youtubeUrl) {
            const ytId = getYouTubeId(youtubeUrl);
            media.push({ 
                type: 'youtube', 
                src: ytId ? `https://www.youtube.com/embed/${ytId}` : youtubeUrl, 
                thumb: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '' 
            });
        } else {
            const thumb = videoUrl.replace(/\.[^/.]+$/, ".jpg");
            media.push({ type: 'video', src: videoUrl, thumb });
        }
    }

    images.forEach(img => {
        media.push({ type: 'image', src: img, thumb: img });
    });

    // Keyboard for lightbox
    const handleKeyDown = useCallback(
        (e) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowLeft') setLightboxIndex((p) => (p - 1 + media.length) % media.length);
            if (e.key === 'ArrowRight') setLightboxIndex((p) => (p + 1) % media.length);
        },
        [lightboxOpen, media.length]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (media.length === 0) return null;

    // For the grid layout: main image (index 0), second image (index 1), remaining count
    const mainMedia = media[0];
    const secondMedia = media.length > 1 ? media[1] : null;
    const remainingCount = media.length - 2; // How many beyond the 2 shown on right

    const renderMediaItem = (item, index, className = '') => {
        if (item.type === 'image') {
            return (
                <img
                    src={item.src}
                    alt={`${title} view ${index + 1}`}
                    className={className}
                    onClick={() => openLightbox(index)}
                    style={{ cursor: 'zoom-in' }}
                />
            );
        } else if (item.type === 'youtube') {
            return (
                <div className={`ig-video-wrapper ${className}`} onClick={() => openLightbox(index)}>
                    <img src={item.thumb} alt={`${title} video`} />
                    <div className="ig-play-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`ig-video-wrapper ${className}`} onClick={() => openLightbox(index)}>
                    <video src={item.src} className="w-full h-full object-cover" />
                    <div className="ig-play-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <style>{galleryStyles}</style>
            <section className="py-8">
                {media.length === 1 ? (
                    /* Single image — full width */
                    <div className="ig-single">
                        {renderMediaItem(mainMedia, 0, 'ig-single-img')}
                    </div>
                ) : (
                    /* Grid: big left, 2 stacked right */
                    <div className="ig-grid">
                        {/* Left — main large image */}
                        <div className="ig-grid-main">
                            {renderMediaItem(mainMedia, 0, 'ig-grid-main-img')}
                        </div>

                        {/* Right — 2 stacked */}
                        <div className="ig-grid-right">
                            {secondMedia && (
                                <div className="ig-grid-top">
                                    {renderMediaItem(secondMedia, 1, 'ig-grid-small-img')}
                                </div>
                            )}
                            <div
                                className="ig-grid-bottom"
                                onClick={() => openLightbox(media.length > 2 ? 2 : 1)}
                                style={{ cursor: 'pointer' }}
                            >
                                {media.length > 2 ? (
                                    <>
                                        <img
                                            src={media[2].thumb}
                                            alt={`${title} more`}
                                            className="ig-grid-small-img"
                                        />
                                        {remainingCount > 0 && (
                                            <div className="ig-grid-overlay">
                                                <span>+{remainingCount}</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Only 2 images — show second again with zoom hint */
                                    <>
                                        <img
                                            src={secondMedia?.thumb || mainMedia.thumb || mainMedia.src}
                                            alt={`${title} view`}
                                            className="ig-grid-small-img"
                                            style={{ filter: 'brightness(0.7)' }}
                                        />
                                        <div className="ig-grid-overlay">
                                            <span style={{ fontSize: 14 }}>View All</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav arrows below grid */}
                {media.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button className="ig-arrow" onClick={() => openLightbox(0)} aria-label="View gallery">
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#57534e' }}>
                                {media.length} photos
                            </span>
                        </button>
                    </div>
                )}
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="lightbox-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
                >
                    <button className="lb-btn" style={{ top: 20, right: 20 }} onClick={() => setLightboxOpen(false)} aria-label="Close">
                        <X size={18} />
                    </button>

                    {media.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p - 1 + media.length) % media.length)}
                            aria-label="Previous"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {media[lightboxIndex].type === 'image' ? (
                        <img src={media[lightboxIndex].src} alt={`${title} preview ${lightboxIndex + 1}`} className="lightbox-img" />
                    ) : media[lightboxIndex].type === 'youtube' ? (
                        <iframe
                            className="lightbox-vid"
                            src={media[lightboxIndex].src}
                            title="YouTube video player"
                            frameBorder="0"
                            allowFullScreen
                        />
                    ) : (
                        <video src={media[lightboxIndex].src} controls className="lightbox-vid" />
                    )}

                    {media.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p + 1) % media.length)}
                            aria-label="Next"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {media.length > 1 && (
                        <span style={{
                            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                            fontSize: 13, color: 'rgba(255,255,255,0.45)',
                            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em',
                        }}>
                            {lightboxIndex + 1} / {media.length}
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

const galleryStyles = `
  /* ── Single Image ── */
  .ig-single {
    border-radius: 16px;
    overflow: hidden;
    background: #e7e5e4;
  }
  .ig-single-img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
    cursor: zoom-in;
  }
  .ig-single:hover .ig-single-img { transform: scale(1.02); }

  /* ── Grid Layout ── */
  .ig-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    border-radius: 16px;
    overflow: hidden;
  }
  @media (min-width: 640px) {
    .ig-grid {
      grid-template-columns: 1.6fr 1fr;
    }
  }

  .ig-grid-main {
    position: relative;
    overflow: hidden;
    background: #e7e5e4;
    border-radius: 12px;
  }
  .ig-grid-main-img {
    width: 100%;
    height: 100%;
    min-height: 220px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
    cursor: zoom-in;
  }
  @media (min-width: 640px) {
    .ig-grid-main-img {
      min-height: 320px;
    }
  }
  .ig-grid-main:hover .ig-grid-main-img { transform: scale(1.02); }

  .ig-grid-right {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 8px;
  }

  .ig-grid-top {
    position: relative;
    overflow: hidden;
    background: #e7e5e4;
    border-radius: 12px;
  }
  .ig-grid-small-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
    cursor: zoom-in;
  }
  .ig-grid-top:hover .ig-grid-small-img { transform: scale(1.03); }

  .ig-grid-bottom {
    position: relative;
    overflow: hidden;
    background: #e7e5e4;
    border-radius: 12px;
  }
  .ig-grid-bottom:hover .ig-grid-small-img { transform: scale(1.03); }

  .ig-grid-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    transition: background 0.2s ease;
  }
  .ig-grid-bottom:hover .ig-grid-overlay {
    background: rgba(0,0,0,0.55);
  }
  .ig-grid-overlay span {
    color: white;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  /* ── Video wrapper ── */
  .ig-video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .ig-video-wrapper img, .ig-video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .ig-play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    backdrop-filter: blur(4px);
  }

  /* ── Arrow ── */
  .ig-arrow {
    padding: 8px 16px;
    border-radius: 9999px;
    background: white;
    border: 1px solid #e7e5e4;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ig-arrow:hover { background: #f5f5f4; border-color: #d6d3d1; }

  /* ── Lightbox ── */
  .lightbox-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(12,12,10,0.93);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
    animation: lbFadeIn 0.2s ease;
  }
  @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
  .lightbox-img, .lightbox-vid {
    width: 100%;
    max-width: min(90vw, 1100px);
    max-height: 85vh;
    border-radius: 12px;
    object-fit: contain;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
  }
  .lightbox-vid {
    aspect-ratio: 16/9;
    background: #000;
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
`;