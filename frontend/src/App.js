import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import YuweiDashboard from './pages/YuweiDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/yuwei-dashboard" element={<YuweiDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;