'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Star, Calendar, Plus, CheckCircle } from 'lucide-react';

const ACTIVITY_TYPES = ['EVENT', 'WORKSHOP', 'ACHIEVEMENT', 'CERTIFICATION', 'OTHER'];

export default function ActivitiesCMSPage() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    type: 'EVENT',
    description: '',
    content: '',
    featured: false,
    order: 0,
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('date', form.date);
    formData.append('type', form.type);
    formData.append('description', form.description);
    formData.append('content', form.content);
    formData.append('featured', form.featured);
    formData.append('order', form.order);

    if (image) {
      formData.append('image', image);
    } else if (existingImage) {
      formData.append('existingImage', existingImage);
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/activities/${editingId}` : '/api/activities';

    await fetch(url, { method, body: formData });

    showToast(editingId ? 'Activity updated!' : 'Activity published!');
    resetForm();
    fetchActivities();
  };

  const handleEdit = (act) => {
    setForm({
      title: act.title,
      date: act.date ? new Date(act.date).toISOString().split('T')[0] : '',
      type: act.type || 'EVENT',
      description: act.description,
      content: act.content || '',
      featured: act.featured || false,
      order: act.order || 0,
    });
    setExistingImage(act.image || '');
    setImage(null);
    setEditingId(act._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    showToast('Activity deleted.');
    fetchActivities();
  };

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      type: 'EVENT',
      description: '',
      content: '',
      featured: false,
      order: 0,
    });
    setImage(null);
    setExistingImage('');
    setEditingId(null);
    setLoading(false);
  };

  const typeColors = {
    EVENT: 'bg-stone-100 text-stone-700',
    WORKSHOP: 'bg-amber-50 text-amber-700 border-amber-100',
    ACHIEVEMENT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    CERTIFICATION: 'bg-sky-50 text-sky-700 border-sky-100',
    OTHER: 'bg-stone-100 text-stone-500',
  };

  const inputClasses = "w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 text-[14px] focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all duration-200 placeholder:text-stone-300";
  const labelClasses = "block text-[12px] font-semibold tracking-[0.06em] uppercase text-stone-500 mb-2";

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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Activities</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Manage your events, workshops, achievements, and certifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
              <div className="w-4 h-px bg-stone-200" />
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">All Activities</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{activities.length}</span>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-4 rounded-xl border border-stone-100">
                    <div className="h-4 bg-stone-100 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-stone-100 rounded w-full mb-2" />
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <p className="text-stone-400 text-center py-12 text-[14px]">No activities added yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map(act => (
                  <div key={act._id} className="group flex flex-col p-4 border border-stone-100 rounded-xl hover:border-stone-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-semibold text-stone-900 text-[14px] leading-snug truncate">{act.title}</h4>
                        {act.featured && <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />}
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEdit(act)} className="p-1.5 text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleDelete(act._id)} className="p-1.5 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <p className="text-[13px] text-stone-500 mb-2.5 line-clamp-2 leading-relaxed">{act.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {act.date ? new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${typeColors[act.type] || typeColors.OTHER}`}>
                        {act.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                <Plus size={14} className="text-stone-600" />
              </div>
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit' : 'New'} Activity</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelClasses}>Activity Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputClasses} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={`${inputClasses} bg-white`}>
                    {ACTIVITY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className={inputClasses} />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Short Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputClasses} resize-y`} />
              </div>

              <div>
                <label className={labelClasses}>Full Content (Markdown)</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className={`${inputClasses} resize-y font-mono text-[13px]`} />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none hover:border-stone-300 transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-300"
                />
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-stone-600">
                  <Star size={14} className="text-amber-500" />
                  Mark as Featured
                </div>
              </label>

              {/* Cover Image */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
                <label className="text-[12px] font-bold tracking-[0.06em] uppercase text-stone-700 mb-3 block">Cover Image</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 transition-all cursor-pointer" />

                {existingImage && !image && (
                  <div className="mt-4 border-t border-stone-200 pt-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-2">Current Image</p>
                    <div className="relative w-28 aspect-video rounded-xl overflow-hidden border border-stone-200">
                      <img src={existingImage} alt="Current" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 disabled:opacity-50">
                  {loading ? 'Uploading & Saving...' : (editingId ? 'Update Activity' : 'Publish Activity')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-stone-50 text-stone-600 border border-stone-200 text-[13px] font-medium rounded-xl hover:bg-stone-100 transition-colors">
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
