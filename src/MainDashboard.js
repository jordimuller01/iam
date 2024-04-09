import React, { useState, useEffect } from 'react';

function MainDashboard() {
    const [currentTime, setCurrentTime] = useState(getFormattedTime());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getFormattedTime());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    function getFormattedTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '26px' }}>
            <div style={{ width: '162px', height: '230px', backgroundColor: 'lightgray', borderRadius: '50%', borderRadius: '60px' }}></div>
            <div style={{ marginLeft: '20px', fontSize: '80px', fontFamily: 'Train One', color: '#FFAE00' }}>
                {currentTime}
            </div>
        </div>
    );
}

export default MainDashboard;
