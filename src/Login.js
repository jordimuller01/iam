import React, { useEffect, useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Spline from '@splinetool/react-spline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const lyrics = [
    "Don’t wanna go ever (Kisab nukho, nukho)",
    "I Don’t wanna go ever (Kisab nukho, nukho)",
    "You’re my imbaba"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((current) => (current + 1) % lyrics.length);
    }, 2000); // Change highlighted line every 2 seconds

    return () => clearInterval(interval);
  }, [lyrics.length]);

  const auth = getAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Failed to log in:', error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered and logged in successfully');
    } catch (error) {
      console.error('Failed to register:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white', fontFamily: 'Inter' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ color: 'rgba(0, 0, 0, 0.77)', fontSize: 35, fontFamily: 'Inter', fontWeight: '700' }}>Your life in one place.</div>
          
          <div style={{ color: '#CFCFCF', fontSize: 35, fontFamily: 'Inter', fontWeight: '700' }}>But fun</div>
        </div>
        <form onSubmit={registering ? handleRegister : handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail"
              style={{ width: 333, height: 60, padding: '0 10px', background: 'rgba(207, 207, 207, 0.25)', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.15) inset', borderRadius: 8, border: '1px solid #E2E2E2', fontSize: 14, fontFamily: 'Inter', fontWeight: '700' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: 333, height: 60, padding: '0 10px', background: 'rgba(207, 207, 207, 0.25)', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.15) inset', borderRadius: 8, border: '1px solid #E2E2E2', fontSize: 14, fontFamily: 'Inter', fontWeight: '600' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: 94, height: 47, background: '#121212', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.15) inset', borderRadius: 8, border: '1px solid #F1D8D0', color: 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: '700' }}
          >
            Log In
          </button>
        </form>
      </div>

      {/* Right container for the Spline scene */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor:'black', }}>
        {/* Lyrics Text */}
        <div style={{
          flex: 0, // This ensures that the text container does not grow
          color: 'black',
          fontSize: 25,
          fontFamily: 'Inter',
          fontWeight: '700',
          lineHeight: '45px',
          textAlign: 'left',
          backgroundColor:'#657B7B',
          padding: '20px', // Adjust this to control the space above the spline scene
           // Gives background to the lyrics, remove if you want transparency
        }}>
          {lyrics.map((line, index) => (
            <span key={index} style={{ 
              opacity: index === highlightIndex ? 1 : 0.2,
              transition: 'opacity 0.5s'
            }}>
              {line}<br />
            </span>
          ))}
        </div>

        {/* Spline Scene */}
        <div style={{ flex: 1, backgroundColor:'black' }}> {/* This container will grow to fill remaining space */}
          <Spline scene="https://prod.spline.design/aTEhNdk2PV76ZlE9/scene.splinecode" />
        </div>
      </div>
    </div>
  );
}

export default Login;
