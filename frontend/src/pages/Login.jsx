import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Send credentials to backend
    // const res = await fetch('http://localhost:5000/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password })
    // });

    // if (res.ok) {
    //   // Optional: Save auth token, etc.
    //   navigate('/dashboard');
    // } else {
    //   alert('Invalid credentials');
    // }

    // no backend yet
    if (username === 'Yuwei' && password === 'woaini') {
      // Simulate successful login
      navigate('/yuwei-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <>
        <h1>Did Micah Tam Send You?</h1>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        </form>
    </>
    
  );
}

export default Login;