import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Shield, Zap } from 'lucide-react';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">v2.0 Now Live</div>
          <h1 className="hero-title">
            The Ultimate <span className="gradient-text">CI/CD Knowledge</span> Platform
          </h1>
          <p className="hero-description">
            Explore hundreds of pre-configured workflows, deployment pipelines, and infrastructure as code templates. Build better, deploy faster.
          </p>
          <div className="hero-actions">
            <Link to="/workflows" className="btn-primary">
              Explore Workflows <ArrowRight size={18} />
            </Link>
            <Link to="/search" className="btn-secondary">
              Search Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Lightning Fast</h3>
            <p>Access hundreds of configurations instantly with our optimized search engine.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Box size={24} /></div>
            <h3>Pre-configured Templates</h3>
            <p>Ready to use templates for Docker, Kubernetes, Terraform, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Enterprise Grade</h3>
            <p>Built with security and scalability in mind for modern teams.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
