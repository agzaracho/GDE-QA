import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { TestPlan, TestRun, User } from '../types';
import { getTestPlans, getTestRuns, getUsers } from '../utils/localStorage';

const ViewTestPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isFromRepository = location.state?.from === 'repository';

  useEffect(() => {
    const testPlans = getTestPlans();
    const foundTestPlan = testPlans.find(tp => tp.id === id);
    if (foundTestPlan) {
      setTestPlan(foundTestPlan);
      const allTestRuns = getTestRuns();
      const relatedTestRuns = allTestRuns.filter(tr => foundTestPlan.testRuns.includes(tr.id));
      setTestRuns(relatedTestRuns);
    }

    // Get current user
    const users = getUsers();
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const user = users.find(u => u.id === storedUserId);
      setCurrentUser(user || null);
    }
  }, [id]);

  const handleBackClick = () => {
    if (isFromRepository) {
      navigate('/admin', { state: { activeTab: 'repository' } });
    } else {
      navigate('/test-plans');
    }
  };

  if (!testPlan) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const canEdit = currentUser && currentUser.role !== 'tester';

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">{testPlan.title}</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Description:</strong> <span className="text-gray-800 dark:text-white">{testPlan.description}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Status:</strong> <span className="text-gray-800 dark:text-white">{testPlan.status}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Created By:</strong> <span className="text-gray-800 dark:text-white">{testPlan.createdBy}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Created At:</strong> <span className="text-gray-800 dark:text-white">{new Date(testPlan.createdAt).toLocaleString()}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Updated At:</strong> <span className="text-gray-800 dark:text-white">{new Date(testPlan.updatedAt).toLocaleString()}</span></p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Test Runs:</h3>
          <ul className="list-disc list-inside text-gray-800 dark:text-white">
            {testRuns.map(testRun => (
              <li key={testRun.id}>
                <Link to={`/test-run/${testRun.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                  {testRun.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        {canEdit && (
          <button 
            onClick={() => navigate(`/edit-test-plan/${testPlan.id}`, { state: { from: isFromRepository ? 'repository' : 'test-plans' } })}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Edit
          </button>
        )}
        <button 
          onClick={handleBackClick}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
        >
          {isFromRepository ? "Back to Repository" : "Back to Test Plans"}
        </button>
      </div>
    </div>
  );
};

export default ViewTestPlan;