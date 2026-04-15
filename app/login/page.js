'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';
import '@/app/globals.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div className="max-w-sm w-full">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center mx-auto mb-5">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900 mb-2">Welcome back</h2>
          <p className="text-[14px] text-stone-500">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200/80 p-7 shadow-sm">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3.5 rounded-xl text-[13px] border border-red-100 font-medium mb-5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 bg-stone-50/50 focus:bg-white placeholder:text-stone-300"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 bg-stone-50/50 focus:bg-white placeholder:text-stone-300"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-stone-900 text-white text-[14px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 hover:-translate-y-0.5 shadow-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-[12px] text-stone-400 mt-6">
          Portfolio Content Management System
        </p>
      </div>
    </div>
  );
}
