import React, { useEffect, useState } from 'react';
import './YuweiDashboard.css';
import month1 from '/images/month1.png';
import month2 from '/images/month2.png';
import month3 from '/images/month3.png';
import month4 from '/images/month4.png';

export default function YuweiDashboard() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    <div className="yuwei-dashboard-container">
      <h2>Yuwei's Super Secret Page</h2>
      <p>Hey my love :)</p>
      <div className="image-grid">
        <div className="image-item">
          <img src={month1} alt="1" />
          <div className="image-label">Month 1</div>
        </div>
        <div className="image-item">
          <img src={month2} alt="2" />
          <div className="image-label">Month 2</div>
        </div>
        <div className="image-item">
          <img src={month3} alt="3" />
          <div className="image-label">Month 3</div>
        </div>
        <div className="image-item">
          <img src={month4} alt="4" />
          <div className="image-label">Month 4</div>
        </div>
      </div>
      <button className="button" onClick={() => setShowModal(true)}>Tap to reveal letter</button>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h3>Happy 4 Months</h3>
            <p>
              Hey my love :)<br /><br />
              I know this is a bit of a different medium. I know it's not handwritten,<br />
              but this also took much longer than any handwritten card so hopefully you<br />
              like it lol. Four big ones, seems like 3 months was so long ago since so <br />
              much has happened and changed in our lives since we were last together.<br />
              However, the one thing that has remained constant has been my love for you :)<br />
              You've made waking up at 7am something I look forward to, and I don't know how<br />
              sustainable that is for you with your scheudule, but this past month you've done<br />
              more for me than you know :) and from the moment I say goodnight to you, I am<br />
              counting the hours until I can see you again. Truly, the sound of your voice is <br />
              a melody I could listen to all day. Believe me when I say no one has ever made <br />
              me feel the way you make me feel. Your presence alone gives me so much comfort <br />
              and warmth, and I really just feel like I can be myself around you. I hope you <br />
              find the same comfort with me too :) Whether you're in the best mood or tired and <br />
              worn down, you can always come to me as you are, and while I might not have all <br />
              the solutions, I will always be there for you :) It really does feel so long ago <br />
              when we barely knew each other, and I still can't believe how effortlessly this <br />
              friendship bloomed. From long nights to even longer nights to random adventures <br />
              and quests, there's no one else I'd rather be with to experience life. I just hope <br />
              one day we can take our adventures out of Florida lol. You deserve the world my <br />
              love, and I will do everything I can to give it to you. I love you yuwei ❤️<br />
            </p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}