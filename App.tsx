import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { IssuesList } from './pages/IssuesList';
import { IssueDetail } from './pages/IssueDetail';
import { NewIssue } from './pages/NewIssue';
import { User, Issue } from './types';
import { api } from './services/mockService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);

  // Load user from session storage for simple persistence across refreshes
  useEffect(() => {
    const saved = sessionStorage.getItem('obrasync_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Fetch issues when user is logged in
  const refreshIssues = async () => {
    if (!user) return;
    setLoadingIssues(true);
    try {
      const data = await api.getIssues();
      setIssues(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    refreshIssues();
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    sessionStorage.setItem('obrasync_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('obrasync_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard issues={issues} />} />
          <Route path="/issues" element={<IssuesList issues={issues} user={user} />} />
          <Route path="/issues/new" element={<NewIssue />} />
          <Route path="/issues/:id" element={<IssueDetail user={user} onUpdate={refreshIssues} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;