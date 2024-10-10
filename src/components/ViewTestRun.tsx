import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { TestRun, TestCase, TestResult, User } from '../types';
import { getTestRuns, getTestCases, getTestResults, setTestResults, getUsers } from '../utils/localStorage';

const ViewTestRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [testRun, setTestRun] = useState<TestRun | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResultsState] = useState<TestResult[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isFromRepository = location.state?.from === 'repository';

  useEffect(() => {
    const fetchData = async () => {
      const allTestRuns = getTestRuns();
      const foundTestRun = allTestRuns.find(tr => tr.id === id);
      if (foundTestRun) {
        setTestRun(foundTestRun);
        const allTestCases = getTestCases();
        const relatedTestCases = allTestCases.filter(tc => foundTestRun.testCases.includes(tc.id));
        setTestCases(relatedTestCases);
        const allTestResults = getTestResults();
        const relatedTestResults = allTestResults.filter(tr => tr.testRunId === id);
        setTestResultsState(relatedTestResults);
      }

      const users = getUsers();
      const storedUserId = localStorage.getItem('currentUserId');
      if (storedUserId) {
        const user = users.find(u => u.id === storedUserId);
        setCurrentUser(user || null);
      }
    };

    fetchData();
  }, [id]);

  const handleResultChange = (testCaseId: string, status: string) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      testRunId: id!,
      testCaseId,
      status,
      notes: '',
      executedBy: currentUser?.id || '',
      executedAt: new Date().toISOString(),
    };

    const updatedResults = [...testResults.filter(r => r.testCaseId !== testCaseId), newResult];
    setTestResultsState(updatedResults);
    setTestResults(updatedResults);
  };

  const handleBackClick = () => {
    if (isFromRepository) {
      navigate('/admin', { state: { activeTab: 'repository' } });
    } else {
      navigate('/test-runs');
    }
  };

  if (!testRun) {
    return <div className="text-center mt-10 text-gray-800 dark:text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">{testRun.title}</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Description:</strong> <span className="text-gray-800 dark:text-white">{testRun.description}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Status:</strong> <span className="text-gray-800 dark:text-white">{testRun.status}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Assigned To:</strong> <span className="text-gray-800 dark:text-white">{testRun.assignedTo}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Platform:</strong> <span className="text-gray-800 dark:text-white">{testRun.platform}</span></p>
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Test Cases:</h3>
        <ul className="list-disc list-inside">
          {testCases.map(testCase => {
            const result = testResults.find(r => r.testCaseId === testCase.id);
            return (
              <li key={testCase.id} className="mb-4">
                <span className="text-gray-800 dark:text-white">{testCase.title}</span>
                <div className="ml-4 mt-2">
                  <select
                    value={result?.status || ''}
                    onChange={(e) => handleResultChange(testCase.id, e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-2 py-1"
                  >
                    <option value="">Select status</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={handleBackClick}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
        >
          {isFromRepository ? "Back to Repository" : "Back to Test Runs"}
        </button>
      </div>
    </div>
  );
};

export default ViewTestRun;