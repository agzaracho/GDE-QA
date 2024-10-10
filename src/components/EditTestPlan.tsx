import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TestPlan, TestRun } from '../types';
import { getTestPlans, setTestPlans, getTestRuns } from '../utils/localStorage';
import Modal from './Modal';

const EditTestPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [availableTestRuns, setAvailableTestRuns] = useState<TestRun[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const location = useLocation();
  const isFromRepository = location.state?.from === 'repository';

  useEffect(() => {
    const testPlans = getTestPlans();
    const foundTestPlan = testPlans.find(tp => tp.id === id);
    if (foundTestPlan) {
      setTestPlan(foundTestPlan);
      const allTestRuns = getTestRuns();
      const filteredTestRuns = allTestRuns.filter(tr => tr.module === foundTestPlan.module);
      setAvailableTestRuns(filteredTestRuns);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testPlan) {
      const testPlans = getTestPlans();
      const updatedTestPlans = testPlans.map(tp => 
        tp.id === testPlan.id ? { ...testPlan, updatedAt: new Date().toISOString() } : tp
      );
      setTestPlans(updatedTestPlans);
      if (isFromRepository) {
        navigate('/admin', { state: { activeTab: 'repository' } });
      } else {
        navigate('/test-plans');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (testPlan) {
      setTestPlan({ ...testPlan, [e.target.name]: e.target.value });
    }
  };

  const handleTestRunToggle = (testRunId: string) => {
    if (testPlan) {
      const updatedTestRuns = testPlan.testRuns.includes(testRunId)
        ? testPlan.testRuns.filter(id => id !== testRunId)
        : [...testPlan.testRuns, testRunId];
      setTestPlan({ ...testPlan, testRuns: updatedTestRuns });
    }
  };

  const handleCancel = () => {
    if (isFromRepository) {
      navigate('/admin', { state: { activeTab: 'repository' } });
    } else {
      navigate('/test-plans');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const testPlans = getTestPlans();
    const updatedTestPlans = testPlans.filter(tp => tp.id !== id);
    setTestPlans(updatedTestPlans);
    if (isFromRepository) {
      navigate('/admin', { state: { activeTab: 'repository' } });
    } else {
      navigate('/test-plans');
    }
  };

  if (!testPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Edit Test Plan - {testPlan.module}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={testPlan.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            value={testPlan.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1 text-gray-700 dark:text-gray-300">Status</label>
          <select
            id="status"
            name="status"
            value={testPlan.status}
            onChange={handleInputChange}
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
                checked={testPlan.testRuns.includes(testRun.id)}
                onChange={() => handleTestRunToggle(testRun.id)}
                className="mr-2"
              />
              <label htmlFor={`testRun-${testRun.id}`} className="text-gray-800 dark:text-white">{testRun.title}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Update Test Plan
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200">
            Delete
          </button>
        </div>
      </form>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the test plan "${testPlan.title}"?`}
      />
    </div>
  );
};

export default EditTestPlan;