'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, CheckCircle, Image as ImageIcon } from 'lucide-react';

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
        <>
          <textarea rows={rows || 4} required={required && activeLang === 'en'} value={activeLang === 'en' ? valueEn : valueId} onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)} placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'} className={`${inputClasses} resize-y font-mono text-[13px]`} />
          <div className="flex items-center justify-between mt-1">
            {activeLang === 'en' && valueId ? <p className="text-[10px] text-emerald-500">✓ ID version filled</p> : <div/>}
            {activeLang === 'id' && valueEn ? <p className="text-[10px] text-emerald-500">✓ EN version filled</p> : <div/>}
            {hint === "(Markdown supported)" && <p className="text-[10px] text-stone-400 font-mono">* Markdown syntax active</p>}
          </div>
        </>
      ) : (
        <>
          <input type={type} required={required && activeLang === 'en'} value={activeLang === 'en' ? valueEn : valueId} onChange={e => activeLang === 'en' ? onChangeEn(e.target.value) : onChangeId(e.target.value)} placeholder={activeLang === 'en' ? 'English version' : 'Versi Bahasa Indonesia'} className={inputClasses} />
          {activeLang === 'en' && valueId && <p className="text-[10px] text-emerald-500 mt-1">✓ ID version filled</p>}
          {activeLang === 'id' && valueEn && <p className="text-[10px] text-emerald-500 mt-1">✓ EN version filled</p>}
        </>
      )}
    </div>
  );
}

function extractBilingual(field) {
  if (!field) return { en: '', id: '' };
  if (typeof field === 'string') return { en: field, id: '' };
  return { en: field.en || '', id: field.id || '' };
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    title_en: '', title_id: '',
    date: '', type: 'EVENT',
    description_en: '', description_id: '',
    content_en: '', content_id: '',
    featured: false, order: 0
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

  const TYPES = ['EVENT', 'WORKSHOP', 'CERTIFICATION', 'AWARD', 'PUBLICATION', 'OTHER'];

  const fetchActivities = () => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => { setActivities(data); setFetching(false); })
      .catch(console.error);
  };

  useEffect(() => { fetchActivities(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', JSON.stringify({ en: form.title_en, id: form.title_id }));
    formData.append('date', form.date);
    formData.append('type', form.type);
    formData.append('description', JSON.stringify({ en: form.description_en, id: form.description_id }));
    formData.append('content', JSON.stringify({ en: form.content_en, id: form.content_id }));
    formData.append('featured', form.featured);
    formData.append('order', form.order);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editingId && imagePreview) {
      formData.append('existingImage', imagePreview);
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/activities/${editingId}` : '/api/activities';

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error('Failed to save');
      showToast(editingId ? 'Activity updated!' : 'Activity published!');
      resetForm();
      fetchActivities();
    } catch (err) {
      console.error(err);
      showToast('Error saving activity');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    const titleBi = extractBilingual(activity.title);
    const descBi = extractBilingual(activity.description);
    const contentBi = extractBilingual(activity.content);

    setForm({
      title_en: titleBi.en,
      title_id: titleBi.id,
      date: activity.date ? activity.date.split('T')[0] : '',
      type: activity.type || 'EVENT',
      description_en: descBi.en,
      description_id: descBi.id,
      content_en: contentBi.en,
      content_id: contentBi.id,
      featured: activity.featured || false,
      order: activity.order || 0
    });
    setImagePreview(activity.image || '');
    setImageFile(null);
    setEditingId(activity._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity?')) return;
    await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    showToast('Activity deleted.');
    fetchActivities();
  };

  const resetForm = () => {
    setForm({
      title_en: '', title_id: '', date: '', type: 'EVENT',
      description_en: '', description_id: '', content_en: '', content_id: '',
      featured: false, order: 0
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  };

  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";
  const labelClasses = "block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2";

  const displayTitle = (title) => {
    if (!title) return '';
    if (typeof title === 'string') return title;
    return title.en || title.id || '';
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 md:pt-0 pb-12">
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Activities</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Log your events, workshops, and certifications.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        
        {/* Form Section */}
        <div className="order-2 xl:order-1">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                <Plus size={16} className="text-stone-600" />
              </div>
              <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit Activity' : 'Log New Activity'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <BilingualInput
                  label="Activity / Event Name"
                  valueEn={form.title_en}
                  valueId={form.title_id}
                  onChangeEn={v => setForm({...form, title_en: v})}
                  onChangeId={v => setForm({...form, title_id: v})}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Type / Category</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={inputClasses}>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                
                <BilingualInput
                  label="Short Description"
                  type="textarea"
                  rows={2}
                  valueEn={form.description_en}
                  valueId={form.description_id}
                  onChangeEn={v => setForm({...form, description_en: v})}
                  onChangeId={v => setForm({...form, description_id: v})}
                  required
                  hint="(Used in cards)"
                />

                <BilingualInput
                  label="Full Details"
                  type="textarea"
                  rows={8}
                  valueEn={form.content_en}
                  valueId={form.content_id}
                  onChangeEn={v => setForm({...form, content_en: v})}
                  onChangeId={v => setForm({...form, content_id: v})}
                  hint="(Markdown supported)"
                />
              </div>

              <hr className="border-stone-100" />

              {/* Cover Image */}
              <div>
                <label className={labelClasses}>Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-full sm:w-48 aspect-video rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-stone-300">
                        <ImageIcon size={24} className="mb-2" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full pt-1">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 transition-all cursor-pointer" />
                    <p className="text-[12px] text-stone-500 mt-3 leading-relaxed">Recommended size: 1200x630px.<br/>This image will be used as the thumbnail.</p>
                  </div>
                </div>
              </div>

              <hr className="border-stone-100" />

              {/* Options */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} className={inputClasses} />
                  <p className="text-[10px] text-stone-400 mt-1">Lower numbers appear first</p>
                </div>
                <div className="pt-[28px]">
                  <label className="flex items-center gap-3 cursor-pointer select-none p-3.5 rounded-xl border border-amber-200/60 bg-amber-50">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded border-amber-300 text-amber-500 focus:ring-amber-500" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-amber-900">Featured Activity</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-stone-100 mt-2">
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-stone-50 text-stone-600 border border-stone-200 text-[13px] font-semibold rounded-xl hover:bg-stone-100 transition-colors">
                  Clear
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 shadow-sm disabled:opacity-50">
                  {loading ? 'Saving Activity...' : (editingId ? 'Update Activity' : 'Publish Activity')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="order-1 xl:order-2">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
              <div className="w-4 h-px bg-stone-200" />
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">Activity Log</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{activities.length}</span>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex gap-4 p-4 rounded-xl border border-stone-100">
                    <div className="w-16 h-16 bg-stone-100 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-3 bg-stone-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-stone-300">📅</span>
                </div>
                <p className="text-stone-400 text-[14px]">Log your first activity.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {activities.map(act => (
                  <div key={act._id} className={`group flex flex-col p-4 border rounded-xl transition-all duration-200 ${editingId === act._id ? 'border-stone-400 bg-stone-50 shadow-sm' : 'border-stone-100 hover:border-stone-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white'}`}>
                    
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">{act.type}</span>
                          {act.featured && <span className="text-[9px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">Featured</span>}
                        </div>
                        <h4 className="font-semibold text-stone-900 text-[14px] leading-tight line-clamp-2">{displayTitle(act.title)}</h4>
                      </div>
                      
                      {act.image ? (
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                          <img src={act.image} alt="Thumb" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 shrink-0 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center">
                          <ImageIcon size={14} className="text-stone-300" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <span className="text-[11px] font-medium text-stone-500">
                        {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      
                      <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEdit(act)} className={`p-1.5 rounded-lg transition-colors ${editingId === act._id ? 'bg-stone-900 text-white' : 'text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100'}`}>
                          <Edit size={13} />
                        </button>
                        <button onClick={() => handleDelete(act._id)} className="p-1.5 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 4px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d6d3d1; }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
