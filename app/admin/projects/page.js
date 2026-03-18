'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0 });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
    
    // Append new image files
    Array.from(images).forEach(file => {
      formData.append('images', file);
    });

    // Append existing images if editing
    existingImages.forEach(img => {
      formData.append('existingImages', img);
    });

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    
    await fetch(url, {
      method,
      body: formData // No Content-Type header so browser sets multipart boundary
    });
    
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
      order: proj.order || 0
    });
    setExistingImages(proj.images || []);
    setImages([]);
    setEditingId(proj._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0 });
    setImages([]);
    setExistingImages([]);
    setEditingId(null);
    setLoading(false);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Portfolio</h1>
          <p className="text-gray-500 mt-1">Manage your creative work, case studies, and image galleries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Existing Projects</h3>
          {projects.length === 0 && <p className="text-gray-500 text-center py-8">No projects added yet.</p>}
          <div className="flex flex-col gap-4">
            {projects.map(proj => (
              <div key={proj._id} className="flex flex-col p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 pr-2">{proj.title}</h4>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleEdit(proj)} className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded lg transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(proj._id)} className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{proj.description}</p>
                <div className="flex items-center text-xs text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded inline-flex w-fit border border-blue-100">
                  <ImageIcon size={12} className="mr-1.5" /> {proj.images?.length || 0} Images
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">{editingId ? 'Edit' : 'Add New'} Project</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (1-2 sentences)</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content / Case Study (Markdown Supported)</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y font-mono text-sm"></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                  <input type="url" value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repo URL</label>
                  <input type="url" value={form.repoUrl} onChange={e => setForm({...form, repoUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Image Gallery</label>
                <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer mb-4" />
                
                {existingImages.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Current Images (Click to remove)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {existingImages.map((src, i) => (
                        <div key={i} className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm" onClick={() => removeExistingImage(i)}>
                          <img src={src} alt="Project existing" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold shadow-sm">Remove</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                  {loading ? 'Uploading & Saving...' : (editingId ? 'Update Project' : 'Publish Project')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors">
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
