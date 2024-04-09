// PeoplePool.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PeoplePool = () => {
  const [people, setPeople] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      const peopleCollection = collection(db, "people");
      const peopleSnapshot = await getDocs(peopleCollection);
      setPeople(peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPeople();
  }, []);

  const handlePersonClick = (personId) => {
    setSelectedPersonId(personId);
  };

  const renderSelectedPerson = () => {
    if (!selectedPersonId) return null;

    const person = people.find(p => p.id === selectedPersonId);
    return (
      <div>
        <h3>{person.person_name}</h3>
        <p>Email: {person.e_mail}</p>
        <p>Description: {person.person_description}</p>
        {/* Render additional information here */}
      </div>
    );
  };

return (
    <div style={{ display: 'flex', flexDirection: 'row', padding:'20px',backgroundColor:'white', borderRadius:'15px' }}>
        <div style={{ width: '200px'}}>
            <div style={{marginBottom:'10px'}}>
            <text style={{ fontWeight: 'bold', fontSize:'16px' }}>People</text>
            </div>
            {people.map((person) => (
                <div key={person.id} style={{borderBottom: '1px solid #ccc', marginTop:'5px', marginBottom:'5px' }} onClick={() => handlePersonClick(person.id)}>
                    {person.person_name}
                </div>
            ))}
        </div>
        <div style={{ flex: 1, marginLeft:'15px'}}>
            {renderSelectedPerson()}
        </div>
    </div>
);
};

export default PeoplePool;
