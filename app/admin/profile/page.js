'use client';

import { useState, useEffect } from 'react';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', email: '', github: '', linkedin: '', resumeLink: '', skills: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setProfile({
            ...data,
            skills: data.skills ? data.skills.join(', ') : ''
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              type="text" 
              required
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title / Headline</label>
            <input 
              type="text" 
              required
              value={profile.title} 
              onChange={e => setProfile({...profile, title: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
          <textarea 
            rows="4" 
            required
            value={profile.bio} 
            onChange={e => setProfile({...profile, bio: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
          ></textarea>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-6 pb-2 border-b border-gray-100">Contact & Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={e => setProfile({...profile, email: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
            <input 
              type="url" 
              value={profile.resumeLink} 
              onChange={e => setProfile({...profile, resumeLink: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile URL</label>
            <input 
              type="url" 
              value={profile.github} 
              onChange={e => setProfile({...profile, github: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
            <input 
              type="url" 
              value={profile.linkedin} 
              onChange={e => setProfile({...profile, linkedin: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
