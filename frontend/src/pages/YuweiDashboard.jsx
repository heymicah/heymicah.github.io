import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './YuweiDashboard.css';
import month1 from './images/month1.jpg';
import month2 from './images/month2.jpg';
import month3 from './images/month3.jpg';
import month4 from './images/month4.PNG';
import month5 from './images/month5.jpg';
import month6 from './images/month6.jpeg';
import month7 from './images/month7.jpg';
import birthday20 from './images/birthday20.jpg';
import letters from './letters';

export default function YuweiDashboard() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedImg, setExpandedImg] = useState(null);
  const [keySequence, setKeySequence] = useState('');

  const images = [
    { src: month1, label: "1 Month", letter: letters.month1 },
    { src: month2, label: "2 Months", letter: letters.month2 },
    { src: month3, label: "3 Months", letter: letters.month3 },
    { src: month4, label: "4 Months", letter: letters.month4 },
    { src: month5, label: "5 Months", letter: letters.month5, objectPosition: "center 20%" },
    { src: month6, label: "6 Months", letter: letters.month6 },
    { src: month7, label: "7 Months", letter: letters.month7 },
    { src: birthday20, label: "20th Birthday!", letter: letters.birthday20 },
  ];

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

  // Get window size for confetti
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard listener for "valentine's day"
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newSequence = (keySequence + e.key.toLowerCase()).slice(-20); // Keep last 20 chars to be safe
      setKeySequence(newSequence);
      
      if (newSequence.includes("valentine's day")) {
        window.open('https://youtu.be/nHFCB22JDFg', '_blank');
        setKeySequence('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence]);

  if (!userData) {
    return <div>Loading…</div>;
  }

  return (
    <div className="yuwei-dashboard-container">
      <h2>Yuwei's Super Secret Page</h2>
      <p>Hey my love :)</p>
      <div className="image-grid">
        {images.map((img, idx) => (
          <div className="image-item" key={idx}>
            <img
              src={img.src}
              alt={img.label}
              onClick={() => setExpandedImg(img)}
              style={{
                cursor: "pointer",
                objectFit: "cover",
                objectPosition: img.objectPosition || "center center"
              }}
            />
            <div className="image-label">{img.label}</div>
          </div>
        ))}
      </div>
      <button className="button" onClick={() => setShowModal(true)}>Tap to reveal letter</button>

      {showModal && (
        <>
          <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={500} recycle={false} />
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <h3>Happy Birthday My Love!</h3>
              <p>
                  Happy birthday sweetheart :) you have made it! The big two oh, two decades of experience right here! I just first want to say how lucky I am to get to see you grow and tackle new experiences with such elegance and grace. I’m genuinely so proud of you and the person you’re growing up to be. And yet, I still love being silly with you :) in fact you’re my favorite person to be silly with, and I hope no matter our age we’ll still have that sense of whimsy. Truly your smile and your laugh are a match made in heaven, and through the years I will try my very best to keep you both laughing at and with me. Keep being you my love, and I cannot wait for what this year has in store for you. Happy birthday, I love you yuwei ❤️
              </p>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </>
      )}

      {expandedImg && (
        <div className="modal-overlay" onClick={() => setExpandedImg(null)}>
          <div
            className="modal-content expanded-image-modal"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={expandedImg.src}
              alt={expandedImg.label}
              className="expanded-image"
            />
            <div className="image-label" style={{ margin: "1rem 0 0 0" }}>
              {expandedImg.label}
            </div>
            <div className="image-letter" style={{ margin: "1rem 0" }}>
              {expandedImg.letter}
            </div>
            <button onClick={() => setExpandedImg(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}