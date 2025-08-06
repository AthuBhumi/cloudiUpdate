import React from 'react';

const AdminPanel: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <p className="text-xl text-gray-600 mb-8">Internal team access only</p>
      </div>
    </div>
  );
};

export default AdminPanel;
