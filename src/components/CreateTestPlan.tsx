import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTestPlan, getTestRuns } from '../utils/localStorage';
import { TestRun } from '../types';

interface CreateTestPlanProps {
  selectedModule: string;
}

const CreateTestPlan: React.FC<CreateTestPlanProps> = ({ selectedModule }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTestRuns, setSelectedTestRuns] = useState<string[]>([]);
  const [availableTestRuns, setAvailableTestRuns] = useState<TestRun[]>([]);
  const [status, setStatus] = useState<'draft' | 'active' | 'completed'>('draft');
  const navigate = useNavigate();

  useEffect(() => {
    const allTestRuns = getTestRuns();
    const filteredTestRuns = allTestRuns.filter(tr => tr.module === selectedModule);
    setAvailableTestRuns(filteredTestRuns);
  }, [selectedModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestPlan = {
      id: Date.now().toString(),
      title,
      description,
      testRuns: selectedTestRuns,
      status,
      createdBy: 'currentUser', // Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      module: selectedModule,
    };
    addTestPlan(newTestPlan);
    navigate('/test-plans');
  };

  const handleTestRunToggle = (testRunId: string) => {
    setSelectedTestRuns(prev =>
      prev.includes(testRunId)
        ? prev.filter(id => id !== testRunId)
        : [...prev, testRunId]
    );
  };

  const handleCancel = () => {
    navigate('/test-plans');
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Create New Test Plan for {selectedModule}</h2>
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
            onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'completed')}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Test Runs</label>
          {availableTestRuns.map(testRun => (
            <div key={testRun.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`testRun-${testRun.id}`}
                checked={selectedTestRuns.includes(testRun.id)}
                onChange={() => handleTestRunToggle(testRun.id)}
                className="mr-2"
              />
              <label htmlFor={`testRun-${testRun.id}`} className="text-gray-800 dark:text-white">{testRun.title}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Create Test Plan
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestPlan;