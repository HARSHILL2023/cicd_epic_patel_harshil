import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, clearSuccess } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import './auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your CI/CD pipelines</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
