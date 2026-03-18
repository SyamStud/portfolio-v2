export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your portfolio CMS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Projects</h3>
          <div className="text-4xl font-extrabold text-blue-600 mt-2">Manage</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Experience</h3>
          <div className="text-4xl font-extrabold text-purple-600 mt-2">Update</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Deployments</h3>
          <div className="text-4xl font-extrabold text-green-600 mt-2">Active</div>
        </div>
      </div>
      
      <div className="bg-blue-50 text-blue-800 p-6 rounded-xl border border-blue-100">
        <h2 className="text-lg font-bold mb-2">Getting Started</h2>
        <p className="text-blue-700">Use the sidebar to navigate through the CMS. You can add new projects, update your work timeline, or change your profile biodata. All changes will be immediately reflected on your public portfolio.</p>
      </div>
    </div>
  );
}
