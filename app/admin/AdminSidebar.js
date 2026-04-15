'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Calendar, Cpu, Menu, X, ExternalLink } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Projects', href: '/admin/projects', icon: FileText },
    { label: 'Activities', href: '/admin/activities', icon: Calendar },
    { label: 'Tech Stack', href: '/admin/techs', icon: Cpu },
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.08em] uppercase text-white">Portfolio</div>
            <div className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-500">Content Manager</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-5 px-3 flex flex-col gap-1">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-600">Menu</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="transition-all" />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/[0.08] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-medium rounded-xl text-stone-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
        >
          <ExternalLink size={14} />
          View Portfolio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-semibold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-stone-900 text-white shadow-lg hover:bg-stone-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-[260px] bg-stone-900 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] bg-stone-900 flex-col sticky top-0 h-screen shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
