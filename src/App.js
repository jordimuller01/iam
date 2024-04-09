import React, { useEffect, useState, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MainDashboard from './MainDashboard';
import DataPool from './DataPool';
import Navigation from './Navigation';
import Login from './Login';
import { app } from './firebase';
import UserPrompt from './userPrompt'; // Make sure the import is correct
import Notes from './pages/Notes';
import Highlights from './pages/Highlights'

export const AuthContext = createContext(null);

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isUserPromptVisible, setIsUserPromptVisible] = useState(false); // State to manage UserPrompt visibility
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    // Function to close the UserPrompt
    const closeUserPrompt = () => {
        setIsUserPromptVisible(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const tagName = event.target.tagName.toLowerCase();
            const isEditable = event.target.isContentEditable;

            if (tagName !== 'input' && tagName !== 'textarea' && !isEditable) {
                if (event.key === 'a' || event.key === 'A') {
                    event.preventDefault(); // Prevent the default 'a' from typing
                    setIsUserPromptVisible(prevState => !prevState); // Toggle visibility
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            <Router>
                <div></div>
                <div style={{ display: 'flex', height: '100vh' }}>
                    {currentUser && <Navigation />}
                    <div style={{ flex: 1, backgroundColor:'#FFFFF' }}>
                        <Routes>
                            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
                            <Route path="/notes" element={currentUser ? <Notes /> : <Navigate to="/login" />} />
                            <Route path="/highlights" element={currentUser ? <Highlights /> : <Navigate to="/login" />} />
                            <Route path="/" element={currentUser ? <DataPool /> : <Navigate to="/login" />} />
                            <Route path="/people" element={currentUser ? <MainDashboard /> : <Navigate to="/login" />} />
                            {/* Add more routes as needed */}
                        </Routes>
                        {isUserPromptVisible && (
                            <div style={{
                                position: 'fixed', // Overlay covers the whole screen
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex', // Use flexbox for centering
                                justifyContent: 'center', // Center horizontally
                                alignItems: 'flex-end', // Center vertically
                                marginBottom:'15px'
                            }}>
                                <UserPrompt onClose={closeUserPrompt} />
                            </div>
                        )}
                    </div>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
