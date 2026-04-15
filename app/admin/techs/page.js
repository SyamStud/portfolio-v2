'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, CheckCircle } from 'lucide-react';

export default function TechCMSPage() {
  const [techs, setTechs] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '', order: 0 });
  const [logoFile, setLogoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

  const fetchTechs = () => {
    fetch('/api/techs')
      .then(res => res.json())
      .then(data => { setTechs(data); setFetching(false); })
      .catch(console.error);
  };

  useEffect(() => { fetchTechs(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/techs/${editingId}` : '/api/techs';

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('order', form.order);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    } else {
      formData.append('logo', form.logo);
    }

    await fetch(url, { method, body: formData });

    showToast(editingId ? 'Technology updated!' : 'Technology added!');
    resetForm();
    fetchTechs();
  };

  const handleEdit = (tech) => {
    setForm({ name: tech.name, logo: tech.logo || '', order: tech.order || 0 });
    setLogoFile(null);
    setEditingId(tech._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tech?')) return;
    await fetch(`/api/techs/${id}`, { method: 'DELETE' });
    showToast('Technology removed.');
    fetchTechs();
  };

  const resetForm = () => {
    setForm({ name: '', logo: '', order: 0 });
    setLogoFile(null);
    setEditingId(null);
    setLoading(false);
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Tech Stack</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Manage the technologies displayed on your homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Grid List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
              <div className="w-4 h-px bg-stone-200" />
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">All Technologies</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{techs.length}</span>
            </div>

            {fetching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse flex flex-col items-center p-4 rounded-xl border border-stone-100">
                    <div className="w-10 h-10 bg-stone-100 rounded-lg mb-2" />
                    <div className="h-3 bg-stone-100 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : techs.length === 0 ? (
              <p className="text-stone-400 text-center py-12 text-[14px]">No technologies added yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {techs.map(tech => (
                  <div key={tech._id} className="relative group flex flex-col items-center p-4 border border-stone-100 rounded-xl hover:border-stone-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 text-center">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => handleEdit(tech)} className="p-1 text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors"><Edit size={11} /></button>
                      <button onClick={() => handleDelete(tech._id)} className="p-1 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={11} /></button>
                    </div>
                    {tech.logo ? (
                      <img src={tech.logo} alt={tech.name} className="w-10 h-10 object-contain mb-2.5" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-2.5">
                        <span className="text-stone-400 text-lg font-bold">{tech.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-[12px] font-medium text-stone-700 truncate w-full">{tech.name}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">#{tech.order || 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                <Plus size={14} className="text-stone-600" />
              </div>
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit' : 'Add'} Technology</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelClasses}>Technology Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. React, Node.js, MongoDB"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Upload Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setLogoFile(e.target.files[0])}
                  className="w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 transition-all cursor-pointer border border-stone-200 rounded-xl bg-white mb-3 p-2"
                />

                <label className={labelClasses}>Or Logo URL</label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={e => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://cdn.jsdelivr.net/..."
                  className={inputClasses}
                  disabled={logoFile !== null}
                />
                {!logoFile && form.logo && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <img src={form.logo} alt="Preview" className="w-8 h-8 object-contain" />
                    <span className="text-[12px] text-stone-500">Preview</span>
                  </div>
                )}
                {logoFile && (
                  <div className="mt-2 text-[12px] text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    File selected: <span className="font-semibold">{logoFile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className={inputClasses}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 disabled:opacity-50">
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Technology')}
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
