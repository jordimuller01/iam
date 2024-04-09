import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import './TextMarquee.css';
import { db } from './firebase'; // Ensure you have this Firebase setup
import { addDoc, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const UserPrompt = ({ onClose }) => {
    const [userInput, setUserInput] = useState('');
    const [serverResponse, setServerResponse] = useState('');
    const inputRef = useRef(null);
    const promptRef = useRef(null);

    const marqueeText = "| Add birthdays | Add time sensitive notes | Add normal notes | Add birthdays | ...";
    const animationProps = useSpring({ from: { transform: 'scale(0.9)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 }, config: { tension: 170, friction: 18 } });

    useEffect(() => {
        inputRef.current?.focus();

        const q = query(collection(db, "responses"), orderBy("timestamp", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    setServerResponse(prev => `${prev}\n${data.message}`);
                }
            });
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (promptRef.current && !promptRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const processUserInput = async (event) => {
        event.preventDefault();
        await addDoc(collection(db, "userInputs"), {
            userInput,
            timestamp: new Date()
        });
        setUserInput('');
    };

    return (
        <animated.div style={{ ...animationProps, width: '462px', height: '250px', position: 'relative', background: 'white', boxShadow: '0px 0px 26px 5px rgba(0, 0, 0, 0.25)', borderRadius: '15px', overflow: 'hidden' }} ref={promptRef}>
            <div style={{ width: '100%', minHeight: '40%', background: 'white', borderRadius: '8px', padding: '10px', whiteSpace: 'pre-wrap', overflowY: 'auto' }}>
                <div style={{ textAlign: 'left', color: 'blue' }}>{userInput}</div>
                <div style={{ textAlign: 'right', color: 'green' }}>{serverResponse}</div>
            </div>
            <div style={{ height: '80px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#C1C1C1', width: '22px', height: '22px', marginRight: '4px', borderRadius: '10px' }}></div>
                <div style={{ backgroundColor: '#C1C1C1', width: '3px', height: '15px', marginRight: '4px', borderRadius: '10px' }}></div>
                <form onSubmit={processUserInput}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter your input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        style={{ width: '379px', height: '25px', background: '#F7F7F7', borderRadius: '8px', border: 'none', padding: '10px', outline: 'none' }}
                    />
                </form>
            </div>
            <div className="marquee">
                <div className="marquee-content">
                    <span>{marqueeText}</span>
                    <span>{marqueeText}</span> {/* Second copy for seamless looping */}
                    <span>{marqueeText}</span> {/* Third copy */}
                </div>
            </div>
        </animated.div>
    );
};

export default UserPrompt;

