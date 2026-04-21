'use client';

import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageGallery from './ImageGallery';
import TechStackMarquee from '@/components/TechStackMarquee';
import { useLanguage } from '@/components/LanguageContext';
import { getLocalized } from '@/lib/localize';

export default function ProjectDetailClient({ project, prevProject, nextProject }) {
  const { language, t } = useLanguage();

  if (!project) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4">404</p>
          <h2 className="text-2xl font-semibold text-stone-900 tracking-[-0.02em] mb-6">{t('project_not_found')}</h2>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 transition-all">
            <ArrowLeft size={14} /> {t('return_home')}
          </Link>
        </div>
      </div>
    );
  }

  const localizedTitle = getLocalized(project.title, language);
  const localizedDesc = getLocalized(project.description, language);
  const localizedContent = getLocalized(project.content, language);
  const images = project.images ?? [];
  const techStack = project.techStack ?? [];

  const prevTitle = prevProject ? getLocalized(prevProject.title, language) : '';
  const nextTitle = nextProject ? getLocalized(nextProject.title, language) : '';

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        /* ── Markdown prose ── */
        .md-content { color: #57534e; font-size: 16px; line-height: 1.85; }
        .md-content h1 { font-size: 1.75rem; font-weight: 600; color: #1c1917; letter-spacing: -0.03em; margin: 2.5rem 0 1rem; }
        .md-content h2 { font-size: 1.35rem; font-weight: 600; color: #1c1917; letter-spacing: -0.02em; margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e7e5e4; }
        .md-content h3 { font-size: 1.05rem; font-weight: 600; color: #292524; letter-spacing: -0.01em; margin: 1.5rem 0 0.5rem; }
        .md-content h4 { font-size: 0.95rem; font-weight: 600; color: #44403c; margin: 1.25rem 0 0.4rem; }
        .md-content p { margin: 0 0 1.25rem; }
        .md-content a { color: #1c1917; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #d6d3d1; transition: text-decoration-color 0.2s; }
        .md-content a:hover { text-decoration-color: #57534e; }
        .md-content strong { color: #292524; font-weight: 600; }
        .md-content em { font-style: italic; }
        .md-content ul { list-style: disc; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content ol { list-style: decimal; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content li { margin-bottom: 0.35rem; }
        .md-content li > ul, .md-content li > ol { margin-top: 0.35rem; margin-bottom: 0; }
        .md-content blockquote {
          border-left: 3px solid #d6d3d1;
          padding: 0.5rem 0 0.5rem 1.25rem;
          margin: 1.5rem 0;
          color: #78716c;
          font-style: italic;
        }
        .md-content blockquote p { margin: 0; }
        .md-content code {
          font-family: 'DM Mono', 'Fira Code', monospace;
          font-size: 0.85em;
          background: #f5f5f4;
          border: 1px solid #e7e5e4;
          border-radius: 5px;
          padding: 0.15em 0.4em;
          color: #292524;
        }
        .md-content pre {
          background: #1c1917;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .md-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #d6d3d1;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .md-content hr { border: none; border-top: 1px solid #e7e5e4; margin: 2.5rem 0; }
        .md-content img { width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e7e5e4; }
        .md-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .md-content th { text-align: left; font-weight: 600; color: #292524; padding: 0.6rem 0.875rem; border-bottom: 2px solid #e7e5e4; }
        .md-content td { padding: 0.6rem 0.875rem; border-bottom: 1px solid #f5f5f4; }
        .md-content tr:last-child td { border-bottom: none; }
        .md-content tr:hover td { background: #fafaf8; }

        /* ── Prev/Next nav ── */
        .proj-nav-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .proj-nav-card {
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          border-radius: 14px;
          border: 1px solid #e7e5e4;
          background: white;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .proj-nav-card:hover {
          border-color: #d6d3d1;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
        .proj-nav-card .nav-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8a29e;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .proj-nav-card .nav-title {
          font-size: 15px;
          font-weight: 600;
          color: #1c1917;
          line-height: 1.4;
        }
        .proj-nav-card.prev { text-align: left; }
        .proj-nav-card.next { text-align: right; }
        .proj-nav-card.next .nav-label { justify-content: flex-end; }

        /* ── Project links row ── */
        .proj-detail-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={15} />
            {t('back_to_projects')}
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-5xl mx-auto px-8 pt-16">

          {/* ── Header ── */}
          <section className="pt-20 pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">{t('case_study')}</span>
            </div>

            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-6">
              {localizedTitle}
            </h1>

            <p className="text-[17px] text-stone-500 leading-relaxed text-justify">
              {localizedDesc}
            </p>
          </section>

          {/* ── Gallery ── */}
          {(images.length > 0 || project.youtubeUrl || project.videoUrl) && (
            <ImageGallery
              images={images}
              title={localizedTitle}
              youtubeUrl={project.youtubeUrl}
              videoUrl={project.videoUrl}
            />
          )}

          {/* ── Tech Stack ── */}
          {techStack.length > 0 && (
            <TechStackMarquee techStack={techStack} />
          )}

          {/* ── Status & Links (below tech stack, matching pill style) ── */}
          {(project.demoUrl || project.repoUrl || project.proprietary) && (
            <div style={{ paddingTop: 8, paddingBottom: 8 }}>
              <div className="ts-header" style={{ marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: '#d6d3d1' }} />
                <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a29e' }}>Links & Status</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#1c1917', border: '1px solid #1c1917', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s ease' }}
                  >
                    <ExternalLink size={15} /> {t('live_demo')}
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'white', border: '1px solid #e7e5e4', borderRadius: 10, color: '#44403c', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s ease' }}
                  >
                    <Github size={15} /> {t('source_code')}
                  </a>
                )}
                {project.proprietary && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, color: '#b45309', fontSize: 13, fontWeight: 600 }}>
                    <Lock size={14} /> {t('proprietary_project')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Markdown Content ── */}
          {localizedContent && (
            <section className="py-12">
              <div className="md-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {localizedContent}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* ── Prev / Next Navigation ── */}
          <footer className="py-16 mt-8 border-t border-stone-200">
            <div className="proj-nav-footer">
              {prevProject ? (
                <Link href={`/projects/${prevProject._id}`} className="proj-nav-card prev">
                  <span className="nav-label">
                    <ChevronLeft size={14} />
                    {t('prev_project') || 'Previous'}
                  </span>
                  <span className="nav-title">{prevTitle}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link href={`/projects/${nextProject._id}`} className="proj-nav-card next">
                  <span className="nav-label">
                    {t('next_project') || 'Next'}
                    <ChevronRight size={14} />
                  </span>
                  <span className="nav-title">{nextTitle}</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </footer>
        </main>
      </FadeIn>
    </div>
  );
}
