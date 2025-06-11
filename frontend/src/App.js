// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import YuweiDashboard from './pages/YuweiDashboard';
import Register from './pages/Register';

// A helper “ProtectedRoute” to guard routes based on JWT presence or role
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwtToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* General dashboard (any logged-in user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Only yuwei sees this route */}
        <Route
          path="/yuwei-dashboard"
          element={
            <ProtectedRoute>
              <YuweiDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown path to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;