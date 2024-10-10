import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../utils/localStorage';
import { User } from '../types';

const CreateUser: React.FC = () => {
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUserWithId: User = {
      ...newUser,
      id: Date.now().toString(),
      role: newUser.role as 'admin' | 'tester' | 'user'
    };
    addUser(newUserWithId);
    navigate('/admin');
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create New User</h2>
      <form onSubmit={handleAddUser} className="space-y-4 mb-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleNewUserChange}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleNewUserChange}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Role</label>
          <select
            id="role"
            name="role"
            value={newUser.role}
            onChange={handleNewUserChange}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            required
          >
            <option value="user">User</option>
            <option value="tester">Tester</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create User
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;