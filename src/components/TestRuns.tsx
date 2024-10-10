import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TestRun, User } from '../types';
import { getTestRuns, getUsers } from '../utils/localStorage';

interface TestRunsProps {
  selectedModule: string;
}

const TestRuns: React.FC<TestRunsProps> = ({ selectedModule }) => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const allTestRuns = getTestRuns();
    const filteredTestRuns = allTestRuns.filter(tr => tr.module === selectedModule);
    setTestRuns(filteredTestRuns);

    // Get current user
    const users = getUsers();
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const user = users.find(u => u.id === storedUserId);
      setCurrentUser(user || null);
    }
  }, [selectedModule]);

  const canEdit = currentUser && currentUser.role !== 'tester';

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedModule} Test Runs</h2>
        <div className="flex space-x-2">
          <Link to="/create-test-run" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Create New Test Run
          </Link>
          <Link to="/dashboard" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200">
            Back
          </Link>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {testRuns.map((testRun) => (
              <tr key={testRun.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{testRun.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{testRun.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{testRun.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{testRun.platform}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/test-run/${testRun.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">View</Link>
                  {canEdit && (
                    <Link to={`/edit-test-run/${testRun.id}`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Edit</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestRuns;