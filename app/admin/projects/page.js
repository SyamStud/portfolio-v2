'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Image as ImageIcon, Plus, X, Lock, CheckCircle, Film, Link2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0, proprietary: false, youtubeUrl: '' });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideo, setExistingVideo] = useState('');
  const [removeVideo, setRemoveVideo] = useState(false);
  const [techStack, setTechStack] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setFetching(false); })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
    fetch('/api/techs')
      .then(res => res.json())
      .then(data => setAvailableTechs(data))
      .catch(console.error);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('content', form.content);
    formData.append('demoUrl', form.demoUrl);
    formData.append('repoUrl', form.repoUrl);
    formData.append('order', form.order);
    formData.append('proprietary', form.proprietary);
    formData.append('youtubeUrl', form.youtubeUrl);

    if (videoFile) formData.append('videoFile', videoFile);
    if (removeVideo) formData.append('removeVideo', 'true');

    Array.from(images).forEach(file => {
      formData.append('images', file);
    });

    existingImages.forEach(img => {
      formData.append('existingImages', img);
    });

    formData.append('techStackData', JSON.stringify(techStack));

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';

    await fetch(url, { method, body: formData });

    showToast(editingId ? 'Project updated!' : 'Project published!');
    resetForm();
    fetchProjects();
  };

  const handleEdit = (proj) => {
    setForm({
      title: proj.title,
      description: proj.description,
      content: proj.content || '',
      demoUrl: proj.demoUrl || '',
      repoUrl: proj.repoUrl || '',
      order: proj.order || 0,
      proprietary: proj.proprietary || false,
      youtubeUrl: proj.youtubeUrl || ''
    });
    setExistingImages(proj.images || []);
    setExistingVideo(proj.videoUrl || '');
    setVideoFile(null);
    setRemoveVideo(false);
    setTechStack(proj.techStack || []);
    setImages([]);
    setEditingId(proj._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    showToast('Project deleted.');
    fetchProjects();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0, proprietary: false, youtubeUrl: '' });
    setImages([]);
    setExistingImages([]);
    setVideoFile(null);
    setExistingVideo('');
    setRemoveVideo(false);
    setTechStack([]);
    setEditingId(null);
    setLoading(false);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const toggleTech = (tech) => {
    const exists = techStack.find(t => t.name === tech.name);
    if (exists) {
      setTechStack(prev => prev.filter(t => t.name !== tech.name));
    } else {
      setTechStack(prev => [...prev, { name: tech.name, logo: tech.logo }]);
    }
  };

  const removeTechItem = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Projects Portfolio</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Manage your creative work, case studies, and image galleries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400">01</span>
              <div className="w-4 h-px bg-stone-200" />
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">Projects</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{projects.length}</span>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-4 rounded-xl border border-stone-100">
                    <div className="h-4 bg-stone-100 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-stone-100 rounded w-full mb-2" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-stone-100 rounded w-16" />
                      <div className="h-5 bg-stone-100 rounded w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-stone-400 text-center py-12 text-[14px]">No projects added yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map(proj => (
                  <div key={proj._id} className="group flex flex-col p-4 border border-stone-100 rounded-xl hover:border-stone-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-stone-900 text-[14px] leading-snug pr-2">{proj.title}</h4>
                        <span className="text-[11px] text-stone-400">Order: {proj.order || 0}</span>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEdit(proj)} className="p-1.5 text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleDelete(proj._id)} className="p-1.5 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <p className="text-[13px] text-stone-500 mb-3 line-clamp-2 leading-relaxed">{proj.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center text-[11px] text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                        <ImageIcon size={11} className="mr-1" /> {proj.images?.length || 0}
                      </div>
                      {proj.techStack?.length > 0 && (
                        <div className="text-[11px] text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                          {proj.techStack.length} Tech
                        </div>
                      )}
                      {proj.proprietary && (
                        <div className="flex items-center text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <Lock size={10} className="mr-1" /> Private
                        </div>
                      )}
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
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit' : 'New'} Project</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelClasses}>Project Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Short Description</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Full Content / Case Study</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className={`${inputClasses} resize-y font-mono text-[13px]`}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Live Demo URL</label>
                  <input type="url" value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>GitHub Repo</label>
                  <input type="url" value={form.repoUrl} onChange={e => setForm({...form, repoUrl: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} className={inputClasses} />
                </div>
              </div>

              {/* Proprietary toggle */}
              <label className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none hover:border-stone-300 transition-colors">
                <input
                  type="checkbox"
                  checked={form.proprietary}
                  onChange={e => setForm({...form, proprietary: e.target.checked})}
                  className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-300"
                />
                <div className="flex items-center gap-2 text-[13px] font-medium text-stone-600">
                  <Lock size={14} className="text-amber-600" />
                  Proprietary project (source code not public)
                </div>
              </label>

              {/* Video & Media */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <Film size={15} className="text-stone-500" />
                  <label className="text-[12px] font-bold tracking-[0.06em] uppercase text-stone-700">Video & Media</label>
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>YouTube Embed URL</label>
                  <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} className={inputClasses} />
                  <p className="text-[11px] text-stone-400 mt-1">If provided, YouTube video will be embedded as main media.</p>
                </div>

                <div>
                  <label className={labelClasses}>Upload Video File</label>
                  <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 transition-all cursor-pointer" />

                  {existingVideo && !removeVideo && (
                    <div className="mt-3 bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3">
                      <video src={existingVideo} className="h-16 rounded-lg bg-black" />
                      <div className="flex flex-col flex-1">
                        <span className="text-[13px] font-medium text-stone-700">Existing Video</span>
                        <button type="button" onClick={() => setRemoveVideo(true)} className="text-[12px] text-red-500 hover:text-red-700 text-left mt-1">Remove video</button>
                      </div>
                    </div>
                  )}
                  {removeVideo && existingVideo && (
                    <p className="text-[12px] text-amber-600 font-medium mt-2">Video will be removed on save.</p>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon size={15} className="text-stone-500" />
                  <label className="text-[12px] font-bold tracking-[0.06em] uppercase text-stone-700">Image Gallery</label>
                </div>
                <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 transition-all cursor-pointer mb-4" />

                {existingImages.length > 0 && (
                  <div className="mt-3 border-t border-stone-200 pt-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-3">Current Images (click to remove)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {existingImages.map((src, i) => (
                        <div key={i} className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden border border-stone-200" onClick={() => removeExistingImage(i)}>
                          <img src={src} alt="Project" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-[11px] font-bold">Remove</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 size={15} className="text-stone-500" />
                  <label className="text-[12px] font-bold tracking-[0.06em] uppercase text-stone-700">Tech Stack</label>
                </div>
                <p className="text-[12px] text-stone-400 mb-4">Click technologies to toggle selection.</p>

                {techStack.length > 0 && (
                  <div className="mb-4 p-3 bg-white rounded-xl border border-stone-200 flex flex-wrap gap-2">
                    <span className="w-full text-[10px] font-semibold tracking-[0.15em] text-stone-400 uppercase mb-1">Selected:</span>
                    {techStack.map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-900 text-white text-[11px] font-medium rounded-lg">
                        {t.logo && <img src={t.logo} alt={t.name} className="w-3.5 h-3.5 object-contain brightness-0 invert" />}
                        {t.name}
                        <button type="button" onClick={() => removeTechItem(i)} className="ml-1 text-stone-400 hover:text-red-400"><X size={11} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                  {availableTechs.length === 0 ? (
                    <p className="col-span-full text-[13px] text-stone-400 text-center py-4">No Tech Stack registered yet.</p>
                  ) : (
                    availableTechs.map((tech) => (
                      <button
                        type="button"
                        key={tech._id}
                        onClick={() => toggleTech(tech)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl transition-all duration-200 ${
                          techStack.some(t => t.name === tech.name)
                            ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        {tech.logo && (
                          <img
                            src={tech.logo}
                            alt={tech.name}
                            className={`w-5 h-5 object-contain rounded-sm ${techStack.some(t => t.name === tech.name) ? 'brightness-0 invert' : ''}`}
                          />
                        )}
                        <span className="text-[12px] font-medium truncate">{tech.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 disabled:opacity-50">
                  {loading ? 'Uploading & Saving...' : (editingId ? 'Update Project' : 'Publish Project')}
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
