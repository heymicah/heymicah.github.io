// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ensure this is set before building (e.g. via .env.production or CI)
  // const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
  const API_BASE = "https://heymicah-github-io.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      // 1) Attempt to log in and get JWT
      const loginRes = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok || !loginData.access_token) {
        setError(loginData.error || 'Invalid credentials');
        return;
      }

      // 2) Store the token (so we can call protected endpoints)
      const token = loginData.access_token;
      localStorage.setItem('jwtToken', token);

      // 3) Call the protected /dashboard route to get user info
      const dashRes = await fetch(`${API_BASE}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!dashRes.ok) {
        // If the token is invalid or expired, you may want to log out / clear storage
        setError('Failed to retrieve dashboard info');
        return;
      }

      const userInfo = await dashRes.json();
      // userInfo should look like: { id: "...", username: "...", ... }

      // 4) Check if this logged-in user is the “specific” user (e.g. "micah")
      if (userInfo.username === 'yuwei') {
        navigate('/yuwei-dashboard'); // route only for "yuwei"
      } else {
        // Otherwise, send them to a general dashboard or show an “unauthorized” message
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Did Micah Tam Send You?</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}