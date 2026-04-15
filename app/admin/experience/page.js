'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, CheckCircle } from 'lucide-react';

function BilingualInput({ label, valueEn, valueId, onChangeEn, onChangeId, required = false, type = 'text', rows, hint }) {
  const [activeLang, setActiveLang] = useState('en');
  const isTextarea = type === 'textarea';
  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500">
          {label}
          {hint && <span className="text-[10px] font-normal text-stone-300 ml-2 normal-case tracking-normal">{hint}</span>}
        </label>
        <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50 overflow-hidden text-[10px] font-bold tracking-wider uppercase">
          <button type="button" onClick={() => setActiveLang('en')} className={`px-2.5 py-1 transition-all ${activeLang === 'en' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}>EN</button>
          <button type="button" onClick={() => setActiveLang('id')} className={`px-2.5 py-1 transition-all ${activeLang === 'id' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}>ID</button>
        </div>
      </div>
      {isTextarea ? (
        <textarea rows={rows || 4} required={required && activeLang === 'en'} value={activeLang === 'en' ? valueEn : valueId} onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)} placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'} className={`${inputClasses} resize-y`} />
      ) : (
        <input type={type} required={required && activeLang === 'en'} value={activeLang === 'en' ? valueEn : valueId} onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)} placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'} className={inputClasses} />
      )}
      {activeLang === 'en' && valueId && <p className="text-[10px] text-emerald-500 mt-1">✓ ID version filled</p>}
      {activeLang === 'id' && valueEn && <p className="text-[10px] text-emerald-500 mt-1">✓ EN version filled</p>}
    </div>
  );
}

function extractBilingual(field) {
  if (!field) return { en: '', id: '' };
  if (typeof field === 'string') return { en: field, id: '' };
  return { en: field.en || '', id: field.id || '' };
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({
    company: '', role_en: '', role_id: '', startDate: '', endDate: '',
    description_en: '', description_id: '', current: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

  const fetchExperiences = () => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => { setExperiences(data); setFetching(false); })
      .catch(console.error);
  };

  useEffect(() => { fetchExperiences(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/experience/${editingId}` : '/api/experience';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: form.company,
        role: { en: form.role_en, id: form.role_id },
        startDate: form.startDate,
        endDate: form.endDate,
        description: { en: form.description_en, id: form.description_id },
        current: form.current
      })
    });

    showToast(editingId ? 'Experience updated!' : 'Experience added!');
    setForm({ company: '', role_en: '', role_id: '', startDate: '', endDate: '', description_en: '', description_id: '', current: false });
    setEditingId(null);
    setLoading(false);
    fetchExperiences();
  };

  const handleEdit = (exp) => {
    const roleBi = extractBilingual(exp.role);
    const descBi = extractBilingual(exp.description);
    setForm({
      company: exp.company,
      role_en: roleBi.en,
      role_id: roleBi.id,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      description_en: descBi.en,
      description_id: descBi.id,
      current: exp.current
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    showToast('Experience deleted.');
    fetchExperiences();
  };

  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";
  const labelClasses = "block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2";

  // Helper to display role (handles legacy string and bilingual object)
  const displayRole = (role) => {
    if (!role) return '';
    if (typeof role === 'string') return role;
    return role.en || role.id || '';
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 md:pt-0">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl shadow-lg">
          <CheckCircle size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-stone-400" />
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-400">Manage</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Work Experience</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Manage your career history timeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
              <div className="w-4 h-px bg-stone-200" />
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">Timeline</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{experiences.length}</span>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-5 rounded-xl border border-stone-100">
                    <div className="h-5 bg-stone-100 rounded w-2/3 mb-3" />
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : experiences.length === 0 ? (
              <p className="text-stone-400 text-center py-12 text-[14px]">No experience added yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {experiences.map(exp => (
                  <div key={exp._id} className="group flex justify-between items-start p-5 border border-stone-100 rounded-xl hover:border-stone-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-stone-900 text-[15px] leading-snug">{displayRole(exp.role)}</h4>
                      <p className="text-[13px] font-medium text-amber-600 mt-0.5">{exp.company}</p>
                      <p className="text-[12px] font-medium text-stone-400 mt-2 tracking-wide">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => handleEdit(exp)} className="p-2 text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(exp._id)} className="p-2 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                <Plus size={14} className="text-stone-600" />
              </div>
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit' : 'Add'} Experience</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className={labelClasses}>Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required className={inputClasses} />
              </div>

              <BilingualInput
                label="Role / Title"
                valueEn={form.role_en}
                valueId={form.role_id}
                onChangeEn={v => setForm({...form, role_en: v})}
                onChangeId={v => setForm({...form, role_id: v})}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} disabled={form.current} className={`${inputClasses} disabled:bg-stone-50 disabled:text-stone-300`} />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" id="current" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300" />
                <span className="text-[13px] font-medium text-stone-600">I currently work here</span>
              </label>

              <BilingualInput
                label="Responsibilities & Achievements"
                hint="(Use '-' for bullet points)"
                type="textarea"
                rows={5}
                valueEn={form.description_en}
                valueId={form.description_id}
                onChangeEn={v => setForm({...form, description_en: v})}
                onChangeId={v => setForm({...form, description_id: v})}
                required
              />

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 disabled:opacity-50">
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Experience')}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ company: '', role_en: '', role_id: '', startDate: '', endDate: '', description_en: '', description_id: '', current: false }); }} className="px-5 py-2.5 bg-stone-50 text-stone-600 border border-stone-200 text-[13px] font-medium rounded-xl hover:bg-stone-100 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
