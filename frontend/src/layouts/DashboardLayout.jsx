import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, LayoutDashboard, List, Search, Settings, ShieldAlert, Bell, Menu, X } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="logo-section">
          <div className="logo-icon">CD</div>
          <span className="logo-text">CI/CD Platform</span>
        </div>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header desktop-only">
          <div className="logo-section">
            <div className="logo-icon">CD</div>
            <span className="logo-text">CI/CD Platform</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-group-title">Main</p>
            <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/workflows" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <List size={20} />
              <span>Workflows</span>
            </NavLink>
            <NavLink to="/search" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Search size={20} />
              <span>Explore</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-title">User</p>
            <NavLink to="/notifications" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Bell size={20} />
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </div>

          {user?.role === 'admin' && (
            <div className="nav-group">
              <p className="nav-group-title">Admin</p>
              <NavLink to="/admin" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <ShieldAlert size={20} />
                <span>Admin Panel</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'user'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
