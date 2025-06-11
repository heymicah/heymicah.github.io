import React, { useEffect, useState } from 'react';

export default function YuweiDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    // Fetch the same /dashboard to get user info (or the backend could expose a separate /me endpoint)
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
      .then((data) => {
        if (data.username !== 'yuwei') {
          // If somehow someone manually navigated here but isn't “yuwei”, redirect away
          window.location.href = '#/dashboard';
        } else {
          setUserData(data);
        }
      })
      .catch(() => {
        window.location.href = '#/login';
      });
  }, []);

  if (!userData) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <h2>Protected Dashboard for Yuwei</h2>
      <p>Welcome back, {userData.username}!</p>
      {/* …other protected content… */}
    </div>
  );
}