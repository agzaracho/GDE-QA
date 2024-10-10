import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestCase, TestRun, TestPlan } from '../types';
import { getTestCases, getTestRuns, getTestPlans } from '../utils/localStorage';
import { FileText, Play, Clipboard, Eye, Edit } from 'lucide-react';

const Repository: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'runs' | 'plans'>('cases');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const navigate = useNavigate();

  const modules = ['All', 'ACCESO', 'EU', 'GEDO', 'CCOO', 'EE'];

  useEffect(() => {
    const allTestCases = getTestCases();
    const allTestRuns = getTestRuns();
    const allTestPlans = getTestPlans();

    setTestCases(allTestCases);
    setTestRuns(allTestRuns);
    setTestPlans(allTestPlans);
  }, []);

  const filteredItems = () => {
    const filterByModule = (items: (TestCase | TestRun | TestPlan)[]) =>
      selectedModule === 'All' ? items : items.filter(item => item.module === selectedModule);

    switch (activeTab) {
      case 'cases':
        return filterByModule(testCases);
      case 'runs':
        return filterByModule(testRuns);
      case 'plans':
        return filterByModule(testPlans);
      default:
        return [];
    }
  };

  const handleView = (id: string) => {
    switch (activeTab) {
      case 'cases':
        navigate(`/test-case/${id}`, { state: { from: 'repository' } });
        break;
      case 'runs':
        navigate(`/test-run/${id}`, { state: { from: 'repository' } });
        break;
      case 'plans':
        navigate(`/test-plan/${id}`, { state: { from: 'repository' } });
        break;
    }
  };

  const handleEdit = (id: string) => {
    switch (activeTab) {
      case 'cases':
        navigate(`/edit-test-case/${id}`, { state: { from: 'repository' } });
        break;
      case 'runs':
        navigate(`/edit-test-run/${id}`, { state: { from: 'repository' } });
        break;
      case 'plans':
        navigate(`/edit-test-plan/${id}`, { state: { from: 'repository' } });
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-6 transition-colors duration-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Repository</h3>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === 'cases'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="mr-2" size={18} />
            Test Cases
          </button>
          <button
            onClick={() => setActiveTab('runs')}
            className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === 'runs'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Play className="mr-2" size={18} />
            Test Runs
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === 'plans'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Clipboard className="mr-2" size={18} />
            Test Plans
          </button>
        </div>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {modules.map(module => (
            <option key={module} value={module}>{module}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Module</th>
              <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              {activeTab === 'runs' && <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>}
              {activeTab === 'plans' && <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>}
              <th className="p-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems().map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                <td className="p-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.module}</td>
                <td className="p-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(item.createdAt).toLocaleString()}</td>
                {activeTab === 'runs' && <td className="p-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(item as TestRun).status}</td>}
                {activeTab === 'plans' && <td className="p-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(item as TestPlan).status}</td>}
                <td className="p-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <button
                    onClick={() => handleView(item.id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Repository;