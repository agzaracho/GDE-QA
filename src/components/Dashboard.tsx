import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { getTestCases, getTestRuns, getTestPlans } from '../utils/localStorage';

interface DashboardProps {
  user: User;
  selectedModule: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, selectedModule }) => {
  const testCases = getTestCases().filter(tc => tc.module === selectedModule);
  const testRuns = getTestRuns().filter(tr => tr.module === selectedModule);
  const testPlans = getTestPlans().filter(tp => tp.module === selectedModule);

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-5 dark:text-white">Welcome to your Dashboard, {user.username}!</h2>
      <p className="mb-5 dark:text-gray-300">Module: {selectedModule}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Test Cases</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{testCases.length}</p>
          <Link to="/test-cases" className="text-blue-500 hover:underline dark:text-blue-400">View all</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Test Runs</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{testRuns.length}</p>
          <Link to="/test-runs" className="text-green-500 hover:underline dark:text-green-400">View all</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Test Plans</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{testPlans.length}</p>
          <Link to="/test-plans" className="text-purple-500 hover:underline dark:text-purple-400">View all</Link>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/create-test-case" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center transition-colors duration-200">
            Create Test Case
          </Link>
          <Link to="/create-test-run" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-center transition-colors duration-200">
            Create Test Run
          </Link>
          <Link to="/create-test-plan" className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 text-center transition-colors duration-200">
            Create Test Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;