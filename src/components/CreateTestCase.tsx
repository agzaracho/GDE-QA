import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTestCase } from '../utils/localStorage';

interface CreateTestCaseProps {
  selectedModule: string;
}

const CreateTestCase: React.FC<CreateTestCaseProps> = ({ selectedModule }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);
  const [expectedResult, setExpectedResult] = useState('');
  const [type, setType] = useState<'manual' | 'automated'>('manual');
  
  const navigate = useNavigate();

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestCase = {
      id: Date.now().toString(),
      title,
      description,
      steps,
      expectedResult,
      type,
      createdBy: 'currentUser', // Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      module: selectedModule,
    };
    addTestCase(newTestCase);
    navigate('/test-cases');
  };

  const handleCancel = () => {
    navigate('/test-cases');
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Create New Test Case for {selectedModule}</h2>
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
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Steps</label>
          {steps.map((step, index) => (
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
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            rows={2}
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block mb-1 text-gray-700 dark:text-gray-300">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'manual' | 'automated')}
            className="w-full px-3 py-2 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
            required
          >
            <option value="manual">Manual</option>
            <option value="automated">Automated</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Create Test Case
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestCase;