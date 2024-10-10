import { User, TestCase, TestRun, TestPlan, TestResult } from '../types';

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const setUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

// Test Case functions
export const getTestCases = (): TestCase[] => {
  const testCases = localStorage.getItem('testCases');
  return testCases ? JSON.parse(testCases) : [];
};

export const setTestCases = (testCases: TestCase[]) => {
  localStorage.setItem('testCases', JSON.stringify(testCases));
};

export const addTestCase = (testCase: TestCase) => {
  const testCases = getTestCases();
  testCases.push(testCase);
  setTestCases(testCases);
};

// Test Run functions
export const getTestRuns = (): TestRun[] => {
  const testRuns = localStorage.getItem('testRuns');
  return testRuns ? JSON.parse(testRuns) : [];
};

export const setTestRuns = (testRuns: TestRun[]) => {
  localStorage.setItem('testRuns', JSON.stringify(testRuns));
};

export const addTestRun = (testRun: TestRun) => {
  const testRuns = getTestRuns();
  testRuns.push(testRun);
  setTestRuns(testRuns);
};

// Test Plan functions
export const getTestPlans = (): TestPlan[] => {
  const testPlans = localStorage.getItem('testPlans');
  return testPlans ? JSON.parse(testPlans) : [];
};

export const setTestPlans = (testPlans: TestPlan[]) => {
  localStorage.setItem('testPlans', JSON.stringify(testPlans));
};

export const addTestPlan = (testPlan: TestPlan) => {
  const testPlans = getTestPlans();
  testPlans.push(testPlan);
  setTestPlans(testPlans);
};

// Test Result functions
export const getTestResults = (): TestResult[] => {
  const testResults = localStorage.getItem('testResults');
  return testResults ? JSON.parse(testResults) : [];
};

export const setTestResults = (testResults: TestResult[]) => {
  localStorage.setItem('testResults', JSON.stringify(testResults));
};

export const addTestResult = (testResult: TestResult) => {
  const testResults = getTestResults();
  testResults.push(testResult);
  setTestResults(testResults);
};

// Module functions
export const getModules = (): string[] => {
  const modules = localStorage.getItem('modules');
  return modules ? JSON.parse(modules) : ['ACCESO', 'EU', 'GEDO', 'CCOO', 'EE'];
};

export const setModules = (modules: string[]) => {
  localStorage.setItem('modules', JSON.stringify(modules));
};

// Initialize demo data
export const initializeDemoData = () => {
  console.log("Initializing demo data...");
  let users = getUsers();
  console.log("Existing users:", users);

  if (users.length === 0) {
    users = [
      { id: '1', username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { id: '2', username: 'tester', email: 'tester@example.com', password: 'tester123', role: 'tester' },
      { id: '3', username: 'user', email: 'user@example.com', password: 'user123', role: 'user' },
    ];
    setUsers(users);
  }

  const modules = getModules();

  if (getTestCases().length === 0) {
    modules.forEach((module, index) => {
      for (let i = 1; i <= 5; i++) {
        addTestCase({
          id: `${module}-${i}`,
          title: `${module} Test Case ${i}`,
          description: `Description for ${module} Test Case ${i}`,
          steps: [`Step 1 for ${module} ${i}`, `Step 2 for ${module} ${i}`, `Step 3 for ${module} ${i}`],
          expectedResult: `Expected result for ${module} Test Case ${i}`,
          type: i % 2 === 0 ? 'manual' : 'automated',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          module: module
        });
      }
    });
  }

  if (getTestRuns().length === 0) {
    modules.forEach((module, index) => {
      const testRunCount = 2 + index; // Different number of test runs for each module
      for (let i = 1; i <= testRunCount; i++) {
        addTestRun({
          id: `${module}-run-${i}`,
          title: `${module} Test Run ${i}`,
          description: `Description for ${module} Test Run ${i}`,
          testCases: [`${module}-1`, `${module}-2`],
          status: i % 2 === 0 ? 'in progress' : 'completed',
          assignedTo: '2',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          module: module,
          platform: i % 2 === 0 ? 'TST' : 'HML'
        });
      }
    });
  }

  if (getTestPlans().length === 0) {
    modules.forEach((module, index) => {
      for (let i = 1; i <= 2; i++) {
        addTestPlan({
          id: `${module}-plan-${i}`,
          title: `${module} Test Plan ${i}`,
          description: `Description for ${module} Test Plan ${i}`,
          testRuns: [`${module}-run-1`, `${module}-run-2`],
          status: i % 2 === 0 ? 'active' : 'draft',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          module: module
        });
      }
    });
  }

  console.log("Demo data initialized");
};