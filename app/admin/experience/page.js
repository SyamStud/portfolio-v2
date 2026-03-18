'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({ company: '', role: '', startDate: '', endDate: '', description: '', current: false });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExperiences = () => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    setForm({ company: '', role: '', startDate: '', endDate: '', description: '', current: false });
    setEditingId(null);
    setLoading(false);
    fetchExperiences();
  };

  const handleEdit = (exp) => {
    setForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      description: exp.description,
      current: exp.current
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    fetchExperiences();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-gray-500 mt-1">Manage your career history timeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* List Section */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Existing Experience</h3>
          {experiences.length === 0 && <p className="text-gray-500 text-center py-8">No experience added yet.</p>}
          <div className="flex flex-col gap-4">
            {experiences.map(exp => (
              <div key={exp._id} className="flex justify-between items-center p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{exp.role} <span className="text-gray-500 font-normal text-base">at {exp.company}</span></h4>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {new Date(exp.startDate).toLocaleDateString()} — {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exp)} className="p-2 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(exp._id)} className="p-2 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">{editingId ? 'Edit' : 'Add New'} Experience</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title</label>
                <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} disabled={form.current} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-sm disabled:bg-gray-100 disabled:text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="current" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <label htmlFor="current" className="text-sm font-medium text-gray-700">I currently work here</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities & Achievements</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-y"></textarea>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Experience')}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setForm({ company: '', role: '', startDate: '', endDate: '', description: '', current: false })}} className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors">
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
