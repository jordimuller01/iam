import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust this import according to your firebase config file's location
import styles from '../styling/commonStyles.module.css';
import TitleBar from '../TitleBar';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false); // State to track "add note" mode
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      }));
      setNotes(notesList);
    };

    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: newNoteTitle,
        content: newNoteContent,
        timestamp: new Date()
      });
      const newNote = { id: docRef.id, title: newNoteTitle, content: newNoteContent, timestamp: new Date() };
      setNotes(prevNotes => [...prevNotes, newNote]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsAddingNote(false); // Exit "add note" mode
      setSelectedNote(newNote); // Optionally select the newly added note
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  return (
    <div>
      <TitleBar />
      <div className={styles.headerDiv}>
        <h1 className={styles.heading}>Knowledge House</h1>
        <p className={styles.subHeading}>Add notes easily and quickly, store interesting things. They will be smartly sorted into categories and used as context across the app.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
        <div style={{ width: '250px', marginRight: '20px' }}>
          <button onClick={() => setIsAddingNote(true)}>Add Note</button>
          <div style={{ marginTop: '20px' }}>
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => { setSelectedNote(note); setIsAddingNote(false); }}
                style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px', cursor: 'pointer' }}
              >
                <p><strong>{note.title}</strong></p>
                <p>{note.content.split("\n")[0]}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: '0 20px' }}>
          {isAddingNote ? (
            <div>
              <h2>Add a New Note</h2>
              <input
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title..."
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your note here..."
                rows="10"
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <button onClick={handleAddNote}>Save Note</button>
            </div>
          ) : selectedNote && (
            <div>
              <h2>{selectedNote.title}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{selectedNote.content}</p>
              <span style={{ color: 'gray', fontSize: '12px' }}>
                {selectedNote.timestamp.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
