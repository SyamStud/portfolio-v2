'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit, Plus, CheckCircle, GripVertical, Image as ImageIcon } from 'lucide-react';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title_en: '', title_id: '',
    description_en: '', description_id: '',
    content_en: '', content_id: '',
    demoUrl: '', repoUrl: '',
    youtubeUrl: '', order: 0, proprietary: false
  });
  
  // Tech Stack Handlers
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [availableTechs, setAvailableTechs] = useState([]);
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);

  // Thumbnail
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Files
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [removeVideo, setRemoveVideo] = useState(false);

  // Drag & Drop state
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  const fetchTechs = () => {
    fetch('/api/techs')
      .then(res => res.json())
      .then(data => setAvailableTechs(data))
      .catch(console.error);
  };

  useEffect(() => { 
    fetchProjects(); 
    fetchTechs();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleTechAdd = (techName) => {
    const name = techName.trim();
    if (!name) return;
    
    if (techStack.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      setTechInput('');
      setIsTechDropdownOpen(false);
      return; 
    }

    const matchedTech = availableTechs.find(t => t.name.toLowerCase() === name.toLowerCase());
    const newTech = matchedTech ? { name: matchedTech.name, logo: matchedTech.logo } : { name, logo: '' };

    setTechStack([...techStack, newTech]);
    setTechInput('');
    setIsTechDropdownOpen(false);
  };

  const handleTechRemove = (indexToRemove) => {
    setTechStack(techStack.filter((_, idx) => idx !== indexToRemove));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Drag & Drop handlers for existing images
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...existingImages];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setExistingImages(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', JSON.stringify({ en: form.title_en, id: form.title_id }));
    formData.append('description', JSON.stringify({ en: form.description_en, id: form.description_id }));
    formData.append('content', JSON.stringify({ en: form.content_en, id: form.content_id }));
    formData.append('demoUrl', form.demoUrl);
    formData.append('repoUrl', form.repoUrl);
    formData.append('youtubeUrl', form.youtubeUrl);
    formData.append('order', form.order);
    formData.append('proprietary', form.proprietary);
    formData.append('techStackData', JSON.stringify(techStack));

    // Thumbnail
    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile);
    } else if (editingId && thumbnailPreview) {
      formData.append('existingThumbnail', thumbnailPreview);
    }

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
    
    if (editingId) {
      // Send ordered images as JSON
      formData.append('existingImagesJson', JSON.stringify(existingImages));
      if (removeVideo) formData.append('removeVideo', 'true');
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error('Failed to save');
      showToast(editingId ? 'Project updated!' : 'Project created!');
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      showToast('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    const titleBi = extractBilingual(project.title);
    const descBi = extractBilingual(project.description);
    const contentBi = extractBilingual(project.content);

    setForm({
      title_en: titleBi.en,
      title_id: titleBi.id,
      description_en: descBi.en,
      description_id: descBi.id,
      content_en: contentBi.en,
      content_id: contentBi.id,
      demoUrl: project.demoUrl || '',
      repoUrl: project.repoUrl || '',
      youtubeUrl: project.youtubeUrl || '',
      order: project.order || 0,
      proprietary: project.proprietary || false,
    });
    setTechStack(project.techStack || []);
    setThumbnailFile(null);
    setThumbnailPreview(project.thumbnail || '');
    setExistingImages(project.images || []);
    setImageFiles([]);
    setExistingVideoUrl(project.videoUrl || '');
    setVideoFile(null);
    setRemoveVideo(false);
    setEditingId(project._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    showToast('Project deleted.');
    fetchProjects();
  };

  const resetForm = () => {
    setForm({
      title_en: '', title_id: '',
      description_en: '', description_id: '',
      content_en: '', content_id: '',
      demoUrl: '', repoUrl: '', youtubeUrl: '', order: 0, proprietary: false
    });
    setTechStack([]);
    setThumbnailFile(null);
    setThumbnailPreview('');
    setImageFiles([]);
    setExistingImages([]);
    setVideoFile(null);
    setExistingVideoUrl('');
    setRemoveVideo(false);
    setEditingId(null);
  };

  const removeExistingImage = (idx) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-stone-900">Projects</h1>
        <p className="text-[14px] text-stone-500 mt-1.5">Manage your portfolio projects and case studies.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Form Section */}
        <div className="order-2 xl:order-1">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                <Plus size={16} className="text-stone-600" />
              </div>
              <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase text-stone-600">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <BilingualInput
                  label="Project Title"
                  valueEn={form.title_en}
                  valueId={form.title_id}
                  onChangeEn={v => setForm({...form, title_en: v})}
                  onChangeId={v => setForm({...form, title_id: v})}
                  required
                />
                
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
                  label="Full Case Study"
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

              {/* Links & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Live Demo URL</label>
                  <input type="url" value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} className={inputClasses} placeholder="https://" />
                </div>
                <div>
                  <label className={labelClasses}>Repository URL</label>
                  <input type="url" value={form.repoUrl} onChange={e => setForm({...form, repoUrl: e.target.value})} className={inputClasses} placeholder="https://" />
                </div>
                <div>
                  <label className={labelClasses}>YouTube Video URL</label>
                  <input type="url" value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} className={inputClasses} placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label className={labelClasses}>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} className={inputClasses} />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className={labelClasses}>Tech Stack</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={techInput}
                    onChange={(e) => {
                      setTechInput(e.target.value);
                      setIsTechDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTechAdd(techInput);
                      }
                    }}
                    placeholder="Type tech name and press Enter..." 
                    className={inputClasses} 
                  />
                  
                  {isTechDropdownOpen && techInput && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {availableTechs
                        .filter(t => t.name.toLowerCase().includes(techInput.toLowerCase()))
                        .map((t, idx) => (
                          <div 
                            key={idx} 
                            className="px-4 py-2 hover:bg-stone-50 cursor-pointer text-sm text-stone-700 flex items-center gap-2"
                            onClick={() => handleTechAdd(t.name)}
                          >
                            {t.logo && <img src={t.logo} alt={t.name} className="w-4 h-4 object-contain" />}
                            {t.name}
                          </div>
                      ))}
                      <div 
                        className="px-4 py-2 border-t border-stone-100 text-sm text-stone-500 hover:bg-stone-50 cursor-pointer italic"
                        onClick={() => handleTechAdd(techInput)}
                      >
                        Add &quot;{techInput}&quot; as custom tech
                      </div>
                    </div>
                  )}
                </div>
                
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-[12px] font-medium text-stone-700">
                        {tech.logo && <img src={tech.logo} alt={tech.name} className="w-3.5 h-3.5 object-contain" />}
                        {tech.name}
                        <button type="button" onClick={() => handleTechRemove(idx)} className="ml-1 text-stone-400 hover:text-red-500">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <label className="flex items-center gap-3 cursor-pointer select-none p-4 rounded-xl border border-stone-200/60 bg-stone-50">
                <input type="checkbox" checked={form.proprietary} onChange={e => setForm({...form, proprietary: e.target.checked})} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-stone-900">Proprietary / Closed Source</span>
                  <span className="text-[11px] text-stone-500">Hide source code links and add a badge</span>
                </div>
              </label>

              <hr className="border-stone-100" />

              {/* Thumbnail */}
              <div>
                <label className={labelClasses}>Thumbnail Image</label>
                <p className="text-[11px] text-stone-400 mb-3">Displayed on cards in home page & project list. Separate from gallery images.</p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-40 aspect-video rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-stone-300">
                        <ImageIcon size={20} className="mb-1" />
                        <span className="text-[9px] font-semibold uppercase tracking-wider">No Thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 transition-all cursor-pointer" />
                    {thumbnailPreview && (
                      <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(''); }} className="text-[11px] text-red-500 font-medium mt-2 hover:underline">
                        Remove thumbnail
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Images with Drag & Drop */}
              <div>
                <label className={labelClasses}>Gallery Images</label>
                <p className="text-[11px] text-stone-400 mb-3">Drag to reorder. These appear in the project detail gallery.</p>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                    {existingImages.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative rounded-lg overflow-hidden border-2 group cursor-grab active:cursor-grabbing transition-all duration-200 ${
                          dragIndex === idx ? 'opacity-40 scale-95' : 'opacity-100'
                        } ${
                          dragOverIndex === idx ? 'border-stone-900 shadow-lg scale-105' : 'border-stone-200'
                        }`}
                      >
                        <img src={src} alt={`Image ${idx + 1}`} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                            <div className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center">
                              <GripVertical size={14} className="text-stone-600" />
                            </div>
                            <button type="button" onClick={() => removeExistingImage(idx)} className="w-7 h-7 bg-red-500 rounded-md text-white flex items-center justify-center hover:bg-red-600">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 transition-all cursor-pointer" />
                {imageFiles.length > 0 && <p className="text-[11px] text-stone-500 mt-2">{imageFiles.length} new image(s) selected.</p>}
              </div>

              <div>
                <label className={labelClasses}>Project Video (Local Upload)</label>
                {existingVideoUrl && !removeVideo && (
                  <div className="mb-3 flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-stone-50">
                    <span className="text-[12px] text-stone-600 truncate">Video currently uploaded</span>
                    <button type="button" onClick={() => setRemoveVideo(true)} className="text-[11px] text-red-500 font-medium px-2 py-1 hover:bg-red-50 rounded">Remove Video</button>
                  </div>
                )}
                {removeVideo && (
                  <p className="text-[12px] text-amber-600 mb-3 font-medium">Video will be removed on save.</p>
                )}
                <input type="file" accept="video/mp4,video/webm" onChange={e => setVideoFile(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 transition-all cursor-pointer" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-stone-100 mt-2">
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-stone-50 text-stone-600 border border-stone-200 text-[13px] font-semibold rounded-xl hover:bg-stone-100 transition-colors">
                  Clear
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-all duration-200 shadow-sm disabled:opacity-50">
                  {loading ? 'Saving Project...' : (editingId ? 'Update Project' : 'Publish Project')}
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
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-stone-600">Published Projects</h3>
              <span className="ml-auto text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">{projects.length}</span>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center p-3 rounded-xl border border-stone-100">
                    <div className="w-16 h-12 bg-stone-200 rounded-lg mr-4 shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-stone-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-stone-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-stone-400 text-center py-12 text-[14px]">No projects found.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {projects.map(proj => (
                  <div key={proj._id} className={`group flex items-center p-3 border rounded-xl transition-all duration-200 ${editingId === proj._id ? 'border-stone-400 bg-stone-50 shadow-sm' : 'border-stone-100 hover:border-stone-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white'}`}>
                    
                    <div className="w-16 h-12 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 mr-4">
                      {(proj.thumbnail || (proj.images && proj.images.length > 0)) ? (
                        <img src={proj.thumbnail || proj.images[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-400 uppercase font-bold">No Img</div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-stone-900 text-[14px] truncate pb-0.5">{displayTitle(proj.title)}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">Order: {proj.order || 0}</span>
                        {proj.proprietary && <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Proprietary</span>}
                      </div>
                    </div>
                    
                    <div className="flex gap-1.5 shrink-0 ml-3">
                      <button onClick={() => handleEdit(proj)} className={`p-2 rounded-lg transition-colors ${editingId === proj._id ? 'bg-stone-900 text-white' : 'text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100'}`}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(proj._id)} className="p-2 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
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
