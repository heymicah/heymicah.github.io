import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './YuweiDashboard.css';
import month1 from './images/month1.jpg';
import month2 from './images/month2.jpg';
import month3 from './images/month3.jpg';
import month4 from './images/month4.PNG';
import month5 from './images/month5.jpg';
import month6 from './images/month6.jpeg';
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
    { src: month6, label: "6 Months", letter: letters.month6 }
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
              <h3>Happy 6 Months</h3>
              <p>
                Half a year—6 months—26 weeks—181 days—4,344 hours—260,640 minutes—15,638,400 seconds loving you. To think just 6 months ago my life was completely different is insane to me because you feel so much like home. The comfort of simply being with you is so familiar, so homey that it feels like I’ve known you all my life. Maybe it’s the way you say my name or how you always show up for me, but these past 6 months I’ve noticed I’ve smiled more, laughed harder, and been happier than ever. You have changed my life more than you know, and I’m just so grateful our paths crossed when they did. I still remember that first conversation when you listed all your ‘warnings’, and I couldn’t help but laugh because even then I think I knew exactly who I was falling in love with. These aren’t warnings, but features that I’d soon get to love about you, because I was falling for all of you, not just what you wanted to show me on the surface. You were so stressed during that conversation, I could hear it in your voice, but I’ve never told you how anxious I was. The butterflies I felt that night, I’ve never felt anything quite the same. Because to me you were always so perfect, so smart, so funny, so beautiful, so far out of my atmosphere, and yet out of everyone, you chose me. How lucky am I to call you mine, and how proud I am to call you my girlfriend. Ever since we started dating my mindset about life and purpose really did change. No longer was it an “I” thing, but rather—we. I don’t want to build my future, I want to build ours. And while I know it might not always be smooth sailing, and storms will inevitably arise, there’s no one I’d rather navigate rough waters with than you yuwei. So unfortunately, the option of me having second thoughts and falling out of love is off the table. Six months have flown by, and I have a feeling we’re only getting started. Yuwei, I truly love you from the bottom of my heart and I can’t wait for what these next six months have in store for us ❤️
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