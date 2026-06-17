import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-container-inline">
      <div className="spinner-small"></div>
    </div>
  );
};

export default LoadingSpinner;
