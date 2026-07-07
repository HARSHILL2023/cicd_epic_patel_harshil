import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkflowList from './pages/WorkflowList';
import SearchPage from './pages/SearchPage';
import WorkflowDetails from './pages/WorkflowDetails';

// Admin Route
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';

// Global Styles
import './App.css';

const App = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes with DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows" element={<WorkflowList />} />
          <Route path="/workflows/:id" element={<WorkflowDetails />} />
          <Route path="/search" element={<SearchPage />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="/notifications" element={<Notifications />} /> */}
        </Route>
      </Route>

      {/* Admin Routes with DashboardLayout */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      
      {/* Fallback 404 Route */}
      <Route path="*" element={
        <MainLayout>
          <div className="page-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1 style={{ fontSize: '4rem', color: '#f8fafc' }}>404</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Page not found.</p>
          </div>
        </MainLayout>
      } />
    </Routes>
  );
};

export default App;
