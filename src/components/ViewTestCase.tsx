import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { TestCase, User } from '../types';
import { getTestCases, getUsers } from '../utils/localStorage';

const ViewTestCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [creatorName, setCreatorName] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isFromRepository = location.state?.from === 'repository';

  useEffect(() => {
    const testCases = getTestCases();
    const users = getUsers();
    const foundTestCase = testCases.find(tc => tc.id === id);
    if (foundTestCase) {
      setTestCase(foundTestCase);
      const creator = users.find(u => u.id === foundTestCase.createdBy);
      setCreatorName(creator ? creator.username : 'Unknown');
    }

    // Get current user
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
      navigate('/test-cases');
    }
  };

  if (!testCase) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const canEdit = currentUser && currentUser.role !== 'tester';

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">{testCase.title}</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Description:</strong> <span className="text-gray-800 dark:text-white">{testCase.description}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Type:</strong> <span className="text-gray-800 dark:text-white">{testCase.type}</span></p>
        <div className="mb-4">
          <strong className="text-gray-700 dark:text-gray-300">Steps:</strong>
          <ol className="list-decimal list-inside text-gray-800 dark:text-white">
            {testCase.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Expected Result:</strong> <span className="text-gray-800 dark:text-white">{testCase.expectedResult}</span></p>
        <p className="mb-4"><strong className="text-gray-700 dark:text-gray-300">Created By:</strong> <span className="text-gray-800 dark:text-white">{creatorName}</span></p>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        {canEdit && (
          <button 
            onClick={() => navigate(`/edit-test-case/${testCase.id}`, { state: { from: isFromRepository ? 'repository' : 'test-cases' } })}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Edit
          </button>
        )}
        <button 
          onClick={handleBackClick}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
        >
          {isFromRepository ? "Back to Repository" : "Back to Test Cases"}
        </button>
      </div>
    </div>
  );
};

export default ViewTestCase;