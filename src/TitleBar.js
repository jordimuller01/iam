import React from 'react';

const TitleBar = () => {
    return (
        <div style={{height: '52px', width: '100%', paddingLeft: '20px', marginTop: '8px', borderBottom: '2px solid #D4D4D4', display: 'flex', alignItems: 'center'}}>
        <text style={{
            color: '#515151',
            fontSize: 14,
            fontFamily: 'Roboto',
            fontWeight: '700',
            lineHeight: 20,
            letterSpacing: 0.10,
            wordWrap: 'break-word'
            }}>Jordi Muller - 19:32 - sunny</text>
    </div>
    );
};

export default TitleBar;