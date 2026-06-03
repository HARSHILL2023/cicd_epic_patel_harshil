import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'sans-serif' }}>
            <h1>Welcome to CICD Epic Frontend</h1>
            <p>
              <Link to="/login" style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
            </p>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
