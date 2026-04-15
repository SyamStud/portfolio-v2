'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', email: '', github: '', linkedin: '', resumeLink: '', skills: '', image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setProfile({
            ...data,
            skills: data.skills ? data.skills.join(', ') : ''
          });
          if (data.image) setImagePreview(data.image);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('title', profile.title);
      formData.append('bio', profile.bio);
      formData.append('email', profile.email || '');
      formData.append('github', profile.github || '');
      formData.append('linkedin', profile.linkedin || '');
      formData.append('resumeLink', profile.resumeLink || '');
      formData.append('skills', JSON.stringify(profile.skills.split(',').map(s => s.trim()).filter(s => s)));
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (profile.image) {
        formData.append('existingImage', profile.image);
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showToast('Profile saved successfully!');
      } else {
        showToast('Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-8 md:pt-0">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded-lg w-48" />
          <div className="h-4 bg-stone-100 rounded w-64" />
          <div className="bg-white rounded-2xl border border-stone-200/80 p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-10 bg-stone-100 rounded-lg" />
              <div className="h-10 bg-stone-100 rounded-lg" />
            </div>
            <div className="h-24 bg-stone-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";
  const labelClasses = "block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2";

  return (
    <div className="max-w-4xl mx-auto pt-8 md:pt-0">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl shadow-lg animate-[fadeIn_0.3s_ease]">
          <CheckCircle size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-stone-400" />
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-400">Settings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Profile Settings</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Update your personal information and social links.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8">
        {/* Basic info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
            <div className="w-6 h-px bg-stone-200" />
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-stone-500">Personal Info</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClasses}>Display Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Job Title / Headline</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={e => setProfile({...profile, title: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClasses}>Profile Photo</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-stone-200" />
              ) : (
                <div className="w-20 h-20 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400 text-[10px] uppercase font-semibold">No Photo</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Short Bio</label>
            <textarea
              rows="4"
              required
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className={`${inputClasses} resize-y`}
            ></textarea>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">02</span>
            <div className="w-6 h-px bg-stone-200" />
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-stone-500">Contact & Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Resume URL</label>
              <input
                type="url"
                value={profile.resumeLink}
                onChange={e => setProfile({...profile, resumeLink: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>GitHub Profile URL</label>
              <input
                type="url"
                value={profile.github}
                onChange={e => setProfile({...profile, github: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>LinkedIn Profile URL</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={e => setProfile({...profile, linkedin: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-6 border-t border-stone-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 hover:-translate-y-0.5 shadow-sm disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
