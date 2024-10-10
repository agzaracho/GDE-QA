import React, { useState, useEffect } from 'react';
import { getModules, setModules } from '../utils/localStorage';
import Modal from './Modal';

const ModulesManagement: React.FC = () => {
  const [modules, setModulesState] = useState<string[]>([]);
  const [newModule, setNewModule] = useState('');
  const [editingModule, setEditingModule] = useState<{ index: number; name: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchedModules = getModules();
    setModulesState(fetchedModules);
  }, []);

  const handleAddModule = () => {
    if (newModule && !modules.includes(newModule)) {
      const updatedModules = [...modules, newModule];
      setModulesState(updatedModules);
      setModules(updatedModules);
      setNewModule('');
    }
  };

  const handleEditModule = (index: number) => {
    setEditingModule({ index, name: modules[index] });
  };

  const handleUpdateModule = () => {
    if (editingModule && editingModule.name && !modules.includes(editingModule.name)) {
      const updatedModules = [...modules];
      updatedModules[editingModule.index] = editingModule.name;
      setModulesState(updatedModules);
      setModules(updatedModules);
      setEditingModule(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  const handleDeleteModule = (index: number) => {
    setModuleToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteModule = () => {
    if (moduleToDelete !== null) {
      const updatedModules = modules.filter((_, index) => index !== moduleToDelete);
      setModulesState(updatedModules);
      setModules(updatedModules);
      setShowDeleteModal(false);
      setModuleToDelete(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Modules Management</h3>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          placeholder="New module name"
        />
        <button
          onClick={handleAddModule}
          className="bg-green-500 text-white py-2 px-4 rounded-r hover:bg-green-600 transition-colors duration-200"
        >
          Add Module
        </button>
      </div>
      <ul className="space-y-2">
        {modules.map((module, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
            {editingModule && editingModule.index === index ? (
              <>
                <input
                  type="text"
                  value={editingModule.name}
                  onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
                  className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <button
                    onClick={handleUpdateModule}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-200 mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-gray-800 dark:text-white">{module}</span>
                <div>
                  <button
                    onClick={() => handleEditModule(index)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-colors duration-200 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteModule(index)}
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
        onConfirm={confirmDeleteModule}
        title="Confirm Module Deletion"
        message={`Are you sure you want to delete the module "${modules[moduleToDelete || 0]}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ModulesManagement;