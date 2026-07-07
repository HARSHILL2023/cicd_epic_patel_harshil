import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, LogOut, User } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">CD</div>
          <span>CI/CD Platform</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only">
          <Link to="/workflows" className="nav-link">Workflows</Link>
          <Link to="/search" className="nav-link">Explore</Link>
          
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <Link to="/dashboard" className="nav-link dashboard-link">Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <button onClick={handleLogout} className="logout-btn-nav">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Log In</Link>
              <Link to="/register" className="register-btn">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <Link to="/workflows" className="mobile-link" onClick={() => setIsOpen(false)}>Workflows</Link>
          <Link to="/search" className="mobile-link" onClick={() => setIsOpen(false)}>Explore</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="mobile-link" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="mobile-link logout-text">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>Log In</Link>
              <Link to="/register" className="mobile-link" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
