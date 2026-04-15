'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Briefcase, Calendar, Cpu, ArrowRight, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, experiences: 0, activities: 0, techs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/experience').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
      fetch('/api/techs').then(r => r.json()),
    ]).then(([projects, experiences, activities, techs]) => {
      setStats({
        projects: projects.length,
        experiences: experiences.length,
        activities: activities.length,
        techs: techs.length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Projects', count: stats.projects, icon: FileText, href: '/admin/projects', desc: 'Manage portfolio projects' },
    { label: 'Experience', count: stats.experiences, icon: Briefcase, href: '/admin/experience', desc: 'Update work timeline' },
    { label: 'Activities', count: stats.activities, icon: Calendar, href: '/admin/activities', desc: 'Events & achievements' },
    { label: 'Tech Stack', count: stats.techs, icon: Cpu, href: '/admin/techs', desc: 'Technologies you use' },
  ];

  return (
    <div className="max-w-5xl mx-auto pt-8 md:pt-0">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-stone-400" />
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-400">Dashboard</span>
        </div>
        <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em] text-stone-900">
          Welcome back
        </h1>
        <p className="text-[14px] md:text-[15px] text-stone-500 mt-2">
          Manage your portfolio content. All changes are reflected live.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </div>
                <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-600 transition-colors duration-300 group-hover:translate-x-0.5" />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1">
                {card.label}
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-stone-100 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold text-stone-900 tracking-tight">
                  {card.count}
                </div>
              )}
              <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed hidden md:block">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <Activity size={18} className="text-stone-600" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-900 mb-2">Getting Started</h2>
            <p className="text-[14px] text-stone-500 leading-relaxed">
              Use the sidebar to navigate through the CMS. You can add new projects, update your work timeline, or change your profile biodata. All changes will be immediately reflected on your public portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
