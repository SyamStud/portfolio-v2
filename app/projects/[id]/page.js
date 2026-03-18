import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import ImageGallery from './ImageGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  return {
    title: project ? `${project.title} - Portfolio` : 'Project Not Found',
  };
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();

  if (!project) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4">404</p>
          <h2 className="text-2xl font-semibold text-stone-900 tracking-[-0.02em] mb-6">Project Not Found</h2>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 transition-all">
            <ArrowLeft size={14} /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images ?? [];

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={15} />
            Back to Projects
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-5xl mx-auto px-8 pt-16">

          {/* ── Header ── */}
          <section className="pt-20 pb-12 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">Case Study</span>
            </div>

            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-6">
              {project.title}
            </h1>

            <p className="text-[17px] text-stone-500 leading-relaxed" style={{ textAlign: 'justify' }}>
              {project.description}
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 mt-8">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-0.5"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all hover:-translate-y-0.5"
                >
                  <Github size={14} /> Source Code
                </a>
              )}
            </div>
          </section>

          {/* ── Gallery ── */}
          {images.length > 0 && (
            <ImageGallery images={images} title={project.title} />
          )}

          {/* ── Content ── */}
          {project.content && (
            <section className="py-12 max-w-3xl">
              <div
                className="text-[16px] leading-[1.85] text-stone-600 space-y-6
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:tracking-[-0.02em] [&_h2]:mt-10 [&_h2]:mb-3
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-stone-800 [&_h3]:mt-8 [&_h3]:mb-2
                  [&_a]:text-stone-900 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-stone-300 hover:[&_a]:decoration-stone-700
                  [&_strong]:text-stone-800 [&_strong]:font-semibold
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                  [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-4 [&_blockquote]:text-stone-500 [&_blockquote]:italic"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </section>
          )}

          {/* ── Footer ── */}
          <footer className="py-16 mt-8 border-t border-stone-200">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all"
            >
              <ArrowLeft size={14} /> Browse more projects
            </Link>
          </footer>
        </main>
      </FadeIn>
    </div>
  );
}