export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'tester' | 'user';
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  type: 'manual' | 'automated';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  module: string;
}

export interface TestRun {
  id: string;
  title: string;
  description: string;
  testCases: string[];
  status: 'not started' | 'in progress' | 'completed';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  module: string;
  platform: string;
}

export interface TestPlan {
  id: string;
  title: string;
  description: string;
  testRuns: string[];
  status: 'draft' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  module: string;
}

export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  status: string;
  notes: string;
  executedBy: string;
  executedAt: string;
}