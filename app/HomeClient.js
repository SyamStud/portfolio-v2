'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import ActivitiesCarousel from '@/components/ActivitiesCarousel';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import HomeTechMarquee from '@/components/HomeTechMarquee';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageContext';
import { getLocalized } from '@/lib/localize';

export default function HomeClient({ profile, experiences, projects, activities, techs }) {
  const { language, t } = useLanguage();

  const firstName = profile.name?.split(' ')[0] ?? profile.name;
  const localizedTitle = getLocalized(profile.title, language);
  const localizedBio = getLocalized(profile.bio, language);

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">

          {/* Logo */}
          <span className="font-semibold text-sm tracking-[0.1em] uppercase text-stone-900">
            <span className="md:hidden">{firstName}</span>
            <span className="hidden md:inline">{profile.name}</span>
          </span>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-5 pr-5 border-r border-stone-200">
              <a href="#about" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">{t('nav_about')}</a>
              <a href="#projects" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">{t('nav_projects')}</a>
              <a href="#activities" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">{t('nav_activities')}</a>
              <a href="#experience" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">{t('nav_experience')}</a>
              <a href="#contact" className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors">{t('nav_contact')}</a>
            </div>

            <LanguageSwitcher />

            <div className="flex items-center gap-3 md:gap-4">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors" title="GitHub">
                  <Github size={17} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors" title="LinkedIn">
                  <Linkedin size={17} />
                </a>
              )}
              {profile.resumeLink && (
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  download="Resume.pdf"
                  className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all uppercase tracking-wider"
                >
                  {t('nav_resume')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex border-t border-stone-200/60">
          <a href="#projects" className="flex-1 text-center py-2.5 text-[12px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">{t('nav_projects')}</a>
          <div className="w-px bg-stone-200/60" />
          <a href="#activities" className="flex-1 text-center py-2.5 text-[12px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">{t('nav_activities')}</a>
          <div className="w-px bg-stone-200/60" />
          <a href="#experience" className="flex-1 text-center py-2.5 text-[12px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">{t('nav_experience')}</a>
          <div className="w-px bg-stone-200/60" />
          <a href="#contact" className="flex-1 text-center py-2.5 text-[12px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">{t('nav_contact')}</a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 md:px-8 pt-[110px] sm:pt-16">

        {/* ─── Hero ─── */}
        <FadeIn direction="up" delay={0.1}>
          <section id="about" className="min-h-[90vh] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-6 md:w-8 h-px bg-stone-400" />
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">
                {t('hero_label')}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
              <div className="flex-1">
                <h1 className="text-[clamp(2.2rem,7.5vw,6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-stone-900 mb-6 md:mb-8 max-w-4xl">
                  {localizedTitle}
                </h1>

                <p className="text-[15px] md:text-[17px] text-stone-500 leading-relaxed max-w-2xl mb-7 md:mb-8 text-justify">
                  {localizedBio}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-0.5"
                  >
                    {t('hero_view_work')}
                    <span className="opacity-50">↓</span>
                  </a>
                  {profile.resumeLink && (
                    <a
                      href={profile.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      download="Resume.pdf"
                      className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all hover:-translate-y-0.5"
                    >
                      <Download size={14} />
                      {t('nav_resume')}
                    </a>
                  )}
                </div>
              </div>

              {profile.image && (
                <div className="md:w-1/3 max-w-[280px] shrink-0 self-start md:self-auto ml-auto md:ml-0 mt-8 md:mt-0 relative group perspective-1000">
                  <div className="aspect-square w-full rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out md:rotate-3 md:group-hover:rotate-0 border-8 border-white bg-white">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-3xl border border-stone-200/50 pointer-events-none transition-all duration-500 md:rotate-3 md:group-hover:rotate-0" />
                </div>
              )}
            </div>
          </section>
        </FadeIn>

        {/* ─── Tech I Work With ─── */}
        {techs.length > 0 && (
          <FadeIn direction="up" delay={0.5}>
            <section id="techstack" className="py-16 md:py-28">
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.25em] uppercase text-stone-400 mb-2">
                  {t('section_tech')}
                </p>
                <div className="w-10 h-px bg-stone-300 mx-auto" />
              </div>

              <HomeTechMarquee techs={techs} />
            </section>
          </FadeIn>
        )}

        {/* ─── Projects ─── */}
        {projects.length > 0 && (
          <FadeIn direction="up" delay={0.2}>
            <section id="projects" className="py-16 md:py-28">
              <div className="flex items-center justify-between mb-10 md:mb-16">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">02</span>
                  <div className="w-8 md:w-12 h-px bg-stone-300" />
                  <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">{t('section_projects')}</h2>
                </div>
                <Link
                  href="/projects"
                  className="text-[12px] md:text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5"
                >
                  {t('view_all')} <span>→</span>
                </Link>
              </div>

              <ProjectsCarousel projects={projects} />
            </section>
          </FadeIn>
        )}

        {/* ─── Activities ─── */}
        {activities.length > 0 && (
          <FadeIn direction="up" delay={0.3}>
            <section id="activities" className="py-16 md:py-28">
              <div className="flex items-center justify-between mb-10 md:mb-16">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">03</span>
                  <div className="w-8 md:w-12 h-px bg-stone-300" />
                  <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">{t('section_activities')}</h2>
                </div>
                <Link
                  href="/activities"
                  className="text-[12px] md:text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5"
                >
                  {t('view_all')} <span>→</span>
                </Link>
              </div>

              <ActivitiesCarousel activities={activities} />
            </section>
          </FadeIn>
        )}

        {/* ─── Experience ─── */}
        {experiences.length > 0 && (
          <FadeIn direction="up" delay={0.4}>
            <section id="experience" className="py-16 md:py-28">
              <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-16">
                <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">04</span>
                <div className="w-8 md:w-12 h-px bg-stone-300" />
                <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">{t('section_experience')}</h2>
              </div>

              <div className="space-y-4 md:space-y-6">
                {experiences.map((exp) => {
                  const expRole = getLocalized(exp.role, language);
                  const expDesc = getLocalized(exp.description, language);
                  return (
                    <div
                      key={exp._id}
                      className="group p-5 md:p-8 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all"
                    >
                      <div className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-2.5">
                        {new Date(exp.startDate).getFullYear()} — {exp.current ? t('present') : new Date(exp.endDate).getFullYear()}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-4">
                        <div className="text-base md:text-xl font-semibold text-stone-900 leading-snug tracking-[-0.02em]">{expRole}</div>
                        <div className="text-sm font-medium text-amber-600 mt-0.5 sm:mt-0">{exp.company}</div>
                      </div>
                      <div className="text-stone-500 leading-relaxed text-[14px] md:text-[15px]">
                        {expDesc.split('\n').some(line => line.trim().startsWith('-')) ? (
                          <ul className="space-y-1.5 list-none">
                            {expDesc.split('\n').map((line, idx) => {
                              const trimmed = line.trim();
                              if (trimmed.startsWith('-')) {
                                return (
                                  <li key={idx} className="flex gap-2.5 items-start">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                                    <span>{trimmed.substring(1).trim()}</span>
                                  </li>
                                );
                              }
                              return trimmed ? <p key={idx} className="mb-1.5">{trimmed}</p> : null;
                            })}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-wrap">{expDesc}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeIn>
        )}



        {/* ─── Contact ─── */}
        <FadeIn direction="up" delay={0.6}>
          <section id="contact" className="py-16 md:py-28">
            <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-16">
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400">
                05
              </span>
              <div className="w-8 md:w-12 h-px bg-stone-300" />
              <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.15em] uppercase text-stone-500">{t('section_contact')}</h2>
            </div>

            <div className="max-w-2xl">
              <h3 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-stone-900 mb-6">
                {t('contact_title')}
              </h3>
              <p className="text-[15px] md:text-[17px] text-stone-500 leading-relaxed mb-8">
                {t('contact_desc')}
              </p>

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-full bg-stone-900 text-white text-sm md:text-base font-medium hover:bg-stone-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-stone-900/20"
                >
                  <Mail size={18} />
                  {profile.email}
                </a>
              )}
            </div>
          </section>
        </FadeIn>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-stone-200 mt-8 py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-[12px] md:text-[13px] text-stone-400">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex gap-5 md:gap-6">
            {profile.github && (
              <a href={profile.github} className="text-[12px] md:text-[13px] font-medium text-stone-400 hover:text-stone-900 transition-colors">
                GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} className="text-[12px] md:text-[13px] font-medium text-stone-400 hover:text-stone-900 transition-colors">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
