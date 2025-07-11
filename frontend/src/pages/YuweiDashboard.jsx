import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './YuweiDashboard.css';
import month1 from './images/month1.jpg';
import month2 from './images/month2.jpg';
import month3 from './images/month3.jpg';
import month4 from './images/month4.PNG';
import month5 from './images/month5.jpg';
import letters from './letters';

export default function YuweiDashboard() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedImg, setExpandedImg] = useState(null);

  const images = [
    { src: month1, label: "1 Month", letter: letters.month1 },
    { src: month2, label: "2 Months", letter: letters.month2 },
    { src: month3, label: "3 Months", letter: letters.month3 },
    { src: month4, label: "4 Months", letter: letters.month4 },
    { src: month5, label: "5 Months", letter: letters.month5, objectPosition: "center 20%" }
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
              <h3>Happy 5 Months</h3>
              <p>
                Oh my gosh we’re back to physical :) Well well well, 5 months. 5 months spent with my favorite person in the world. 5 months getting to know your highs, lows, and everything in between. And call me greedy, but I want more. I want to keep learning more about you, more about your goals, your dreams, and all your beautiful little idiosyncrasies. Like the way you describe exactly how you like to do something, or how you’re so particular with picking out each individual kernel of corn, it makes me fall more in love with you every day. And when you say “I don’t know how you can find this cute”, I can’t help but just stare into your eyes wishing you knew what it was like to look at the most beautiful girl in the world. They say real love is when distance makes the heart grow fonder, and I must admit I’m falling quite hard over you. An ocean and a continent between us, and my heart still flutters at the thought of you. You’re truly one of a kind yuwei. The way you carry yourself, your fearlessness and tenacity, it’s truly quite impressive :) And that’s another reason why I love you. Because you don’t need me yuwei, you are already so impressive on your own. Yet despite all of my quirks and little things, you chose me. And what an honor and privilege it is to live life beside you. Our time together has been the happiest I’ve ever felt, and I don’t say that just to say, I truly mean that only you have made me feel this way. So thank you :) Thank you for sticking by my side, thank you for all the laughs we’ve shared and all the adventures we’ve gone on together. You really do make the world better just by being in it my love. I only ask if I could have the pleasure of walking this life with you—after all, you need someone to hold your map. Wherever this journey takes us, know I love you yuwei ❤️
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