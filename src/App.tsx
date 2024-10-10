import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import CreateUser from './components/CreateUser';
import TestCases from './components/TestCases';
import TestRuns from './components/TestRuns';
import TestPlans from './components/TestPlans';
import CreateTestCase from './components/CreateTestCase';
import CreateTestRun from './components/CreateTestRun';
import CreateTestPlan from './components/CreateTestPlan';
import ViewTestCase from './components/ViewTestCase';
import EditTestCase from './components/EditTestCase';
import ViewTestRun from './components/ViewTestRun';
import EditTestRun from './components/EditTestRun';
import ViewTestPlan from './components/ViewTestPlan';
import EditTestPlan from './components/EditTestPlan';
import ThemeToggle from './components/ThemeToggle';
import { User } from './types';
import { getUsers, initializeDemoData } from './utils/localStorage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedModule, setSelectedModule] = useState('ACCESO');

  useEffect(() => {
    initializeDemoData();
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const users = getUsers();
      const currentUser = users.find(u => u.id === storedUserId);
      if (currentUser) {
        setUser(currentUser);
      }
    }
    
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (userId: string) => {
    const users = getUsers();
    const loggedInUser = users.find(u => u.id === userId);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('currentUserId', userId);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleModuleChange = (module: string) => {
    setSelectedModule(module);
  };

  const AppContent = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
      <>
        {!isLoginPage && (
          <Header user={user} onLogout={handleLogout} onModuleChange={handleModuleChange} selectedModule={selectedModule}>
            <ThemeToggle isDark={isDarkTheme} toggleTheme={toggleTheme} />
          </Header>
        )}
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
            <Route path="/create-user" element={user && user.role === 'admin' ? <CreateUser /> : <Navigate to="/dashboard" />} />
            <Route path="/test-cases" element={user ? <TestCases selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/test-runs" element={user ? <TestRuns selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/test-plans" element={user ? <TestPlans selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/create-test-case" element={user ? <CreateTestCase selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/create-test-run" element={user ? <CreateTestRun selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/create-test-plan" element={user ? <CreateTestPlan selectedModule={selectedModule} /> : <Navigate to="/login" />} />
            <Route path="/test-case/:id" element={user ? <ViewTestCase /> : <Navigate to="/login" />} />
            <Route path="/edit-test-case/:id" element={user ? <EditTestCase /> : <Navigate to="/login" />} />
            <Route path="/test-run/:id" element={user ? <ViewTestRun /> : <Navigate to="/login" />} />
            <Route path="/edit-test-run/:id" element={user ? <EditTestRun /> : <Navigate to="/login" />} />
            <Route path="/test-plan/:id" element={user ? <ViewTestPlan /> : <Navigate to="/login" />} />
            <Route path="/edit-test-plan/:id" element={user ? <EditTestPlan /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;