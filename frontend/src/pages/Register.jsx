// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // create this for any styling you want

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // read the API base from your env (ensure you set REACT_APP_API_BASE_URL before build)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // basic client-side check
    if (password !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }
    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        // Registration succeeded; redirect to login page (or auto-login)
        navigate('/login');
      } else {
        // Show error returned from backend
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <input
            id="reg-confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="link" onClick={() => navigate('/login')}>
          Log in
        </span>
      </p>
    </div>
  );
}