import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface Platform {
  id: string;
  name: string;
}

const PlatformsManagement: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [platformToDelete, setPlatformToDelete] = useState<string | null>(null);

  useEffect(() => {
    const storedPlatforms = localStorage.getItem('platforms');
    if (storedPlatforms) {
      setPlatforms(JSON.parse(storedPlatforms));
    }
  }, []);

  const savePlatforms = (updatedPlatforms: Platform[]) => {
    localStorage.setItem('platforms', JSON.stringify(updatedPlatforms));
    setPlatforms(updatedPlatforms);
  };

  const handleAddPlatform = () => {
    if (newPlatform && !platforms.some(p => p.name === newPlatform)) {
      const updatedPlatforms = [...platforms, { id: Date.now().toString(), name: newPlatform }];
      savePlatforms(updatedPlatforms);
      setNewPlatform('');
    }
  };

  const handleEditPlatform = (platform: Platform) => {
    setEditingPlatform(platform);
  };

  const handleUpdatePlatform = () => {
    if (editingPlatform && editingPlatform.name && !platforms.some(p => p.name === editingPlatform.name && p.id !== editingPlatform.id)) {
      const updatedPlatforms = platforms.map(p => p.id === editingPlatform.id ? editingPlatform : p);
      savePlatforms(updatedPlatforms);
      setEditingPlatform(null);
    }
  };

  const handleDeletePlatform = (id: string) => {
    setPlatformToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeletePlatform = () => {
    if (platformToDelete) {
      const updatedPlatforms = platforms.filter(p => p.id !== platformToDelete);
      savePlatforms(updatedPlatforms);
      setShowDeleteModal(false);
      setPlatformToDelete(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Platforms Management</h3>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          placeholder="New platform name"
        />
        <button
          onClick={handleAddPlatform}
          className="bg-green-500 text-white py-2 px-4 rounded-r hover:bg-green-600 transition-colors duration-200"
        >
          Add Platform
        </button>
      </div>
      <ul className="space-y-2">
        {platforms.map((platform) => (
          <li key={platform.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
            {editingPlatform && editingPlatform.id === platform.id ? (
              <>
                <input
                  type="text"
                  value={editingPlatform.name}
                  onChange={(e) => setEditingPlatform({ ...editingPlatform, name: e.target.value })}
                  className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <button
                    onClick={handleUpdatePlatform}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-200 mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingPlatform(null)}
                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-gray-800 dark:text-white">{platform.name}</span>
                <div>
                  <button
                    onClick={() => handleEditPlatform(platform)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-colors duration-200 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlatform(platform.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePlatform}
        title="Confirm Platform Deletion"
        message={`Are you sure you want to delete this platform? This action cannot be undone.`}
      />
    </div>
  );
};

export default PlatformsManagement;