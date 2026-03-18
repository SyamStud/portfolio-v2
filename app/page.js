import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Experience from '@/models/Experience';
import Project from '@/models/Project';
import FadeIn from '@/components/FadeIn';
import { Github, Linkedin } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
  await connectToDatabase();

  const [profile, experiences, projects] = await Promise.all([
    Profile.findOne().lean(),
    Experience.find().sort({ startDate: -1 }).lean(),
    Project.find().sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  return {
    profile: profile || {
      name: 'Your Name',
      title: 'Your Job Title',
      bio: 'Your biography goes here. Tell the world what you do.',
    },
    experiences: experiences.map(doc => ({ ...doc, _id: doc._id.toString() })),
    projects: projects.map(doc => ({ ...doc, _id: doc._id.toString() })),
  };
}

export default async function Home() {
  const { profile, experiences, projects } = await getData();

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* DM Sans + DM Mono from Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-[0.1em] uppercase text-stone-900">
            {profile.name}
          </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 pr-6 border-r border-stone-200">
              <a href="#experience" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors tracking-wide">Experience</a>
              <a href="#projects" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors tracking-wide">Projects</a>
            </div>
            
            <div className="flex items-center gap-4">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors" title="GitHub">
                  <Github size={18} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
              )}
              {profile.resumeLink && (
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-[12px] font-semibold px-4 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all uppercase tracking-wider"
                >
                  Résumé
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 pt-16">

        {/* ─── Hero ─── */}
        <FadeIn direction="up" delay={0.1}>
          <section className="min-h-[92vh] flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">
                Portfolio
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.8rem,7.5vw,6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-stone-900 mb-8 max-w-4xl">
              {profile.title}
            </h1>

            {/* Bio */}
            <p className="text-[17px] text-stone-500 leading-relaxed max-w-2xl mb-8" style={{ textAlign: 'justify' }}>
              {profile.bio}
            </p>

            {/* CTA buttons — di bawah bio */}
            <div className="flex gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-0.5"
              >
                View Work
                <span className="opacity-50">↓</span>
              </a>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all hover:-translate-y-0.5"
                >
                  Get in Touch
                </a>
              )}
            </div>

            {/* Scroll nudge */}
            <div className="mt-16 flex items-center gap-3 text-stone-400">
              <div className="w-px h-10 bg-stone-300" />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase">Scroll</span>
            </div>
          </section>
        </FadeIn>

        {/* ─── Experience ─── */}
        {experiences.length > 0 && (
          <FadeIn direction="up" delay={0.2}>
            <section id="experience" className="py-28">
              {/* Section label */}
              <div className="flex items-center gap-4 mb-16">
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">02</span>
                <div className="w-12 h-px bg-stone-300" />
                <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">Work Experience</h2>
              </div>

              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div
                    key={exp._id}
                    className="group grid grid-cols-[1fr_2fr] gap-12 p-8 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all"
                  >
                    {/* Left col */}
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-3">
                        {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                      </div>
                      <div className="text-xl font-semibold text-stone-900 leading-snug mb-1 tracking-[-0.02em]">{exp.role}</div>
                      <div className="text-sm font-medium text-amber-600">{exp.company}</div>
                    </div>
                    {/* Right col */}
                    <div className="flex items-center">
                      <div className="text-stone-500 leading-relaxed text-[15px] w-full">
                        {exp.description.split('\n').some(line => line.trim().startsWith('-')) ? (
                          <ul className="space-y-2 list-none">
                            {exp.description.split('\n').map((line, idx) => {
                              const trimmed = line.trim();
                              if (trimmed.startsWith('-')) {
                                return (
                                  <li key={idx} className="flex gap-3 items-start">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                                    <span>{trimmed.substring(1).trim()}</span>
                                  </li>
                                );
                              }
                              return trimmed ? <p key={idx} className="mb-2">{trimmed}</p> : <br key={idx} />;
                            })}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* ─── Projects ─── */}
        {projects.length > 0 && (
          <FadeIn direction="up" delay={0.3}>
            <section id="projects" className="py-28">
              {/* Section label */}
              <div className="flex items-center gap-4 mb-16">
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">03</span>
                <div className="w-12 h-px bg-stone-300" />
                <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">Selected Projects</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj, i) => (
                  <Link
                    key={proj._id}
                    href={`/projects/${proj._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col"
                  >
                    {/* Image */}
                    <div className="overflow-hidden bg-stone-100">
                      {proj.images && proj.images.length > 0 ? (
                        <img
                          src={proj.images[0]}
                          alt={proj.title}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200" />
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-stone-900 leading-snug tracking-[-0.02em]">{proj.title}</h3>
                        <span className="flex-shrink-0 ml-4 mt-0.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-lg">↗</span>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed flex-grow">{proj.description}</p>
                      <div className="mt-6 pt-5 border-t border-stone-100 flex items-center">
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 group-hover:text-stone-700 transition-colors">Read case study</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-stone-200 mt-8 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-stone-400">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex gap-6">
            {profile.github && (
              <a href={profile.github} className="text-[13px] font-medium text-stone-400 hover:text-stone-900 transition-colors tracking-wide">
                GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} className="text-[13px] font-medium text-stone-400 hover:text-stone-900 transition-colors tracking-wide">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}