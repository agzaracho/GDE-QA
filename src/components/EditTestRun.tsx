import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestRun, TestCase } from '../types';
import { getTestRuns, setTestRuns, getTestCases } from '../utils/localStorage';
import Modal from './Modal';

const EditTestRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState<TestRun | null>(null);
  const [allTestCases, setAllTestCases] = useState<TestCase[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const testRuns = getTestRuns();
    const foundTestRun = testRuns.find(tr => tr.id === id);
    if (foundTestRun) {
      setTestRun(foundTestRun);
      const testCases = getTestCases().filter(tc => tc.module === foundTestRun.module);
      setAllTestCases(testCases);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testRun) {
      const testRuns = getTestRuns();
      const updatedTestRuns = testRuns.map(tr => 
        tr.id === testRun.id ? { ...testRun, updatedAt: new Date().toISOString() } : tr
      );
      setTestRuns(updatedTestRuns);
      navigate('/test-runs');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (testRun) {
      setTestRun({ ...testRun, [e.target.name]: e.target.value });
    }
  };

  const handleTestCaseToggle = (testCaseId: string) => {
    if (testRun) {
      const updatedTestCases = testRun.testCases.includes(testCaseId)
        ? testRun.testCases.filter(id => id !== testCaseId)
        : [...testRun.testCases, testCaseId];
      setTestRun({ ...testRun, testCases: updatedTestCases });
    }
  };

  const handleCancel = () => {
    navigate('/test-runs');
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const testRuns = getTestRuns();
    const updatedTestRuns = testRuns.filter(tr => tr.id !== id);
    setTestRuns(updatedTestRuns);
    navigate('/test-runs');
  };

  if (!testRun) {
    return <div className="text-center mt-10 text-gray-800 dark:text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Edit Test Run</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={testRun.title}
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
            value={testRun.description}
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
            value={testRun.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Test Cases</label>
          {allTestCases.map(testCase => (
            <div key={testCase.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`testCase-${testCase.id}`}
                checked={testRun.testCases.includes(testCase.id)}
                onChange={() => handleTestCaseToggle(testCase.id)}
                className="mr-2"
              />
              <label htmlFor={`testCase-${testCase.id}`} className="text-gray-800 dark:text-white">{testCase.title}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Update Test Run
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
        message={`Are you sure you want to delete the test run "${testRun.title}"?`}
      />
    </div>
  );
};

export default EditTestRun;