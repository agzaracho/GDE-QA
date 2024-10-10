import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestCase } from '../types';
import { getTestCases, setTestCases } from '../utils/localStorage';
import Modal from './Modal';

const EditTestCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const testCases = getTestCases();
    const foundTestCase = testCases.find(tc => tc.id === id);
    if (foundTestCase) {
      setTestCase(foundTestCase);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCase) {
      const testCases = getTestCases();
      const updatedTestCases = testCases.map(tc => 
        tc.id === testCase.id ? { ...testCase, updatedAt: new Date().toISOString() } : tc
      );
      setTestCases(updatedTestCases);
      navigate('/test-cases');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (testCase) {
      setTestCase({ ...testCase, [e.target.name]: e.target.value });
    }
  };

  const handleStepChange = (index: number, value: string) => {
    if (testCase) {
      const newSteps = [...testCase.steps];
      newSteps[index] = value;
      setTestCase({ ...testCase, steps: newSteps });
    }
  };

  const handleAddStep = () => {
    if (testCase) {
      setTestCase({ ...testCase, steps: [...testCase.steps, ''] });
    }
  };

  const handleCancel = () => {
    navigate('/test-cases');
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const testCases = getTestCases();
    const updatedTestCases = testCases.filter(tc => tc.id !== id);
    setTestCases(updatedTestCases);
    navigate('/test-cases');
  };

  if (!testCase) {
    return <div className="text-center mt-10 text-gray-800 dark:text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Edit Test Case</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={testCase.title}
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
            value={testCase.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Steps</label>
          {testCase.steps.map((step, index) => (
            <input
              key={index}
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
              placeholder={`Step ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={handleAddStep}
            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors duration-200"
          >
            Add Step
          </button>
        </div>
        <div>
          <label htmlFor="expectedResult" className="block mb-1 text-gray-700 dark:text-gray-300">Expected Result</label>
          <textarea
            id="expectedResult"
            name="expectedResult"
            value={testCase.expectedResult}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            rows={2}
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block mb-1 text-gray-700 dark:text-gray-300">Type</label>
          <select
            id="type"
            name="type"
            value={testCase.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          >
            <option value="manual">Manual</option>
            <option value="automated">Automated</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Update Test Case
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
        message={`Are you sure you want to delete the test case "${testCase.title}"?`}
      />
    </div>
  );
};

export default EditTestCase;