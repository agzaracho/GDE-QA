import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTestRun, getTestCases } from '../utils/localStorage';
import { TestCase } from '../types';

interface CreateTestRunProps {
  selectedModule: string;
}

const CreateTestRun: React.FC<CreateTestRunProps> = ({ selectedModule }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);
  const [status, setStatus] = useState<'not started' | 'in progress' | 'completed'>('not started');
  const [platform, setPlatform] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const allTestCases = getTestCases();
    const filteredTestCases = allTestCases.filter(tc => tc.module === selectedModule);
    setAvailableTestCases(filteredTestCases);
  }, [selectedModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestRun = {
      id: Date.now().toString(),
      title,
      description,
      testCases: selectedTestCases,
      status,
      assignedTo: 'currentUser', // Replace with actual user ID
      createdBy: 'currentUser', // Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      module: selectedModule,
      platform,
    };
    addTestRun(newTestRun);
    navigate('/test-runs');
  };

  const handleTestCaseToggle = (testCaseId: string) => {
    setSelectedTestCases(prev =>
      prev.includes(testCaseId)
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  const handleCancel = () => {
    navigate('/test-runs');
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Create New Test Run for {selectedModule}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1 text-gray-700 dark:text-gray-300">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'not started' | 'in progress' | 'completed')}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="platform" className="block mb-1 text-gray-700 dark:text-gray-300">Platform</label>
          <input
            type="text"
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Test Cases</label>
          {availableTestCases.map(testCase => (
            <div key={testCase.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`testCase-${testCase.id}`}
                checked={selectedTestCases.includes(testCase.id)}
                onChange={() => handleTestCaseToggle(testCase.id)}
                className="mr-2"
              />
              <label htmlFor={`testCase-${testCase.id}`} className="text-gray-800 dark:text-white">{testCase.title}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Create Test Run
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestRun;