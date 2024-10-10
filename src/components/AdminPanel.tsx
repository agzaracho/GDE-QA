import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { getUsers, setUsers } from '../utils/localStorage';
import Modal from './Modal';
import Repository from './Repository';
import ModulesManagement from './ModulesManagement';
import PlatformsManagement from './PlatformsManagement';

const AdminPanel: React.FC = () => {
  const [users, setUsersState] = useState<User[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'repository' | 'modules' | 'platforms'>('users');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchedUsers = getUsers();
    setUsersState(fetchedUsers);

    // Check if there's an activeTab in the location state
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const handleRoleChange = (userId: string, newRole: 'admin' | 'tester' | 'user') => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsersState(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(user => user.id !== userToDelete);
      setUsersState(updatedUsers);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        <Link to="/dashboard" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
          Back to Dashboard
        </Link>
      </div>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 mr-2 ${
            activeTab === 'users'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('repository')}
          className={`py-2 px-4 mr-2 ${
            activeTab === 'repository'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          Repository
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`py-2 px-4 mr-2 ${
            activeTab === 'modules'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={`py-2 px-4 ${
            activeTab === 'platforms'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          Platforms
        </button>
      </div>
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">User Management</h3>
            <button
              onClick={() => navigate('/create-user')}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200"
            >
              Create User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'tester' | 'user')}
                        className="mr-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded px-2 py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="tester">Tester</option>
                        <option value="user">User</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'repository' && <Repository />}
      {activeTab === 'modules' && <ModulesManagement />}
      {activeTab === 'platforms' && <PlatformsManagement />}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        title="Confirm User Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default AdminPanel;