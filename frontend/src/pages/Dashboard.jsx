// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = '#/login';
      return;
    }

    fetch(`https://heymicah-github-io.onrender.com/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch(() => {
        window.location.href = '#/login';
      });
  }, []);

  if (!userData) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {userData.username}!</p>
      {/* …general dashboard content… */}
    </div>
  );
}