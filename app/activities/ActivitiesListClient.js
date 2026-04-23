'use client';

import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useLanguage } from '@/components/LanguageContext';
import { getLocalized } from '@/lib/localize';

export default function ActivitiesListClient({ activities }) {
  const { language, t } = useLanguage();
  const dateLocale = t('date_locale');

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <Link
            href="/#activities"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={15} />
            {t('back_to_home')}
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-6xl mx-auto px-5 md:px-8 pt-16">
          <section className="pt-20 pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">{t('section_activities')}</span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-4">
              {t('all_activities')}
            </h1>
            <p className="text-[15px] md:text-[17px] text-stone-500 leading-relaxed max-w-2xl">
              {t('activities_desc')}
            </p>
          </section>

          {activities.length === 0 ? (
            <p className="text-stone-400 text-center py-16">{t('no_activities')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-16">
              {activities.map((act) => {
                const dateStr = new Date(act.date).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                return (
                  <Link
                    key={act._id}
                    href={`/activities/${act._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-stone-100">
                      {(act.thumbnail || (act.images && act.images.length > 0) || act.image) ? (
                        <img
                          src={act.thumbnail || (act.images && act.images.length > 0 ? act.images[0] : act.image)}
                          alt={getLocalized(act.title, language)}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200" />
                      )}
                      {act.featured && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-500/90 flex items-center justify-center shadow-md">
                          <Star size={14} fill="white" color="white" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase bg-[#1e3a5f] text-white">
                          {act.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-600 mb-2">
                        {dateStr}
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-stone-900 leading-snug tracking-[-0.02em] mb-2">
                        {getLocalized(act.title, language)}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed flex-grow line-clamp-3">
                        {getLocalized(act.description, language)}
                      </p>
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 group-hover:text-stone-700 transition-colors">
                          {t('read_more')}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </FadeIn>
    </div>
  );
}
