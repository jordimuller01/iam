import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path matches your Firebase config file
import styles from '../styling/highlightsStyles.module.css'; // Create and import your CSS module for styling

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    const fetchHighlights = async () => {
        const highlightsCollection = collection(db, "highlights");
        const highlightsSnapshot = await getDocs(highlightsCollection);
        const highlightsList = highlightsSnapshot.docs.map(doc => {
          const highlightData = doc.data();
          // Convert the Firestore Timestamp to a JavaScript Date object
          const date = highlightData.timestamp.toDate(); // This is where the conversion happens
          return { id: doc.id, ...highlightData, timestamp: date };
        });
        setHighlights(highlightsList);
      };
      

    fetchHighlights();
  }, []);

  const handleAddHighlight = async () => {
    if (!newHighlight.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "highlights"), {
        content: newHighlight,
        timestamp: new Date()
      });
      const newHighlightData = { id: docRef.id, content: newHighlight, timestamp: new Date() };
      setHighlights([...highlights, newHighlightData]);
      setNewHighlight('');
    } catch (error) {
      console.error("Error adding highlight: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <input
        value={newHighlight}
        onChange={(e) => setNewHighlight(e.target.value)}
        placeholder="Add a new highlight..."
        className={styles.input}
      />
      <button onClick={handleAddHighlight} className={styles.addButton}>Add Highlight</button>
      <div className={styles.tilesContainer}>
        {highlights.map((highlight) => (
          <div key={highlight.id} className={styles.tile}>
            <p>{highlight.content}</p>
            <span className={styles.timestamp}>{highlight.timestamp.toDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
