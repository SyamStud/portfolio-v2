'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

function BilingualInput({ label, valueEn, valueId, onChangeEn, onChangeId, required = false, type = 'text', rows }) {
  const [activeLang, setActiveLang] = useState('en');
  const isTextarea = type === 'textarea';
  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500">{label}</label>
        <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50 overflow-hidden text-[10px] font-bold tracking-wider uppercase">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-2.5 py-1 transition-all ${activeLang === 'en' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}
          >EN</button>
          <button
            type="button"
            onClick={() => setActiveLang('id')}
            className={`px-2.5 py-1 transition-all ${activeLang === 'id' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}
          >ID</button>
        </div>
      </div>
      {isTextarea ? (
        <>
          <textarea
            rows={rows || 4}
            required={required && activeLang === 'en'}
            value={activeLang === 'en' ? valueEn : valueId}
            onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)}
            placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'}
            className={`${inputClasses} resize-y`}
          />
          {activeLang === 'en' && valueId && <p className="text-[10px] text-emerald-500 mt-1">✓ ID version filled</p>}
          {activeLang === 'id' && valueEn && <p className="text-[10px] text-emerald-500 mt-1">✓ EN version filled</p>}
        </>
      ) : (
        <>
          <input
            type={type}
            required={required && activeLang === 'en'}
            value={activeLang === 'en' ? valueEn : valueId}
            onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)}
            placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'}
            className={inputClasses}
          />
          {activeLang === 'en' && valueId && <p className="text-[10px] text-emerald-500 mt-1">✓ ID version filled</p>}
          {activeLang === 'id' && valueEn && <p className="text-[10px] text-emerald-500 mt-1">✓ EN version filled</p>}
        </>
      )}
    </div>
  );
}

// Helper to extract en/id from a field (supports legacy string)
function extractBilingual(field) {
  if (!field) return { en: '', id: '' };
  if (typeof field === 'string') return { en: field, id: '' };
  return { en: field.en || '', id: field.id || '' };
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '', title_en: '', title_id: '', bio_en: '', bio_id: '', email: '', github: '', linkedin: '', resumeLink: '', skills: '', image: ''
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
          const titleBi = extractBilingual(data.title);
          const bioBi = extractBilingual(data.bio);
          setProfile({
            ...data,
            title_en: titleBi.en,
            title_id: titleBi.id,
            bio_en: bioBi.en,
            bio_id: bioBi.id,
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
      formData.append('title', JSON.stringify({ en: profile.title_en, id: profile.title_id }));
      formData.append('bio', JSON.stringify({ en: profile.bio_en, id: profile.bio_id }));
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
            <BilingualInput
              label="Job Title / Headline"
              valueEn={profile.title_en}
              valueId={profile.title_id}
              onChangeEn={v => setProfile({...profile, title_en: v})}
              onChangeId={v => setProfile({...profile, title_id: v})}
              required
            />
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

          <BilingualInput
            label="Short Bio"
            type="textarea"
            rows={4}
            valueEn={profile.bio_en}
            valueId={profile.bio_id}
            onChangeEn={v => setProfile({...profile, bio_en: v})}
            onChangeId={v => setProfile({...profile, bio_id: v})}
            required
          />
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
