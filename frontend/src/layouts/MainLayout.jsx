import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} CI/CD Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
