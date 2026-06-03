import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Welcome to CICD Epic Frontend</h1>
      <Routes>
        <Route path="/" element={<p>Home Page</p>} />
      </Routes>
    </div>
  );
}

export default App;
