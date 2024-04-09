import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getAuth, signOut } from 'firebase/auth'; // Import signOut
import axios from 'axios';
import UserPrompt from './userPrompt';
import { useSpring, animated } from 'react-spring';


const Navigation = ({isUserPromptVisible}) => {
    const [activeField, setActiveField] = useState(0);
    const [hoverField, setHoverField] = useState(null);
    const [textInput, setTextInput] = useState('');
    const fields = ['D', 'M', 'N', 'H', '', '', 'S', ''];
    const navRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate
    const fieldNames = ['Data Pool', 'Main Dashboard', 'Log-Out', 'Notes', 'Highlights', 'Field 6', 'Field 7', 'Field 8'];
    const activeFieldName = fieldNames[activeField];
    const [isHovered, setIsHovered] = useState(false);

    const springProps = useSpring({
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        config: { tension: 200, friction: 15 }, // Adjust these values as needed
    });

    const sendDataToServer = async (data) => {
        try {
            const response = await axios.post('/api/process-user-input', data); // Point to Firebase Cloud Functions endpoint
            console.log(response.data);
        } catch (error) {
            console.error('Error sending data to server', error);
        }
    };

    // Call sendDataToServer whenever textInput changes
    useEffect(() => {
        sendDataToServer({ textInput });
    }, [textInput]);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('User signed out successfully');
            navigate('/login'); // Redirect to login page after logout
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    };

    const fieldName = fields[hoverField];
   
    const renderInnerContent = () => {
        if (hoverField === null) {
            return null;
        }
    
        // Get the name of the field
       
    
        return (
            <div
                style={{
                    position: 'absolute',
                    width: '40%', // Adjust as needed
                    height: '40%', // Adjust as needed
                    left: '50%', // Center horizontally
                    top: '50%', // Center vertically
                    transform: 'translate(-50%, -50%)', // Center the text
                    zIndex: 1, // Ensure the text is above other elements
                    display: 'flex', // Center the text within the div
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#989898', // Adjust as needed
                    fontWeight: 'bold', // Adjust as needed
                    fontFamily: 'Inter', // Adjust as needed
                    fontSize: '12px', // Adjust as needed
                }}
            >
                {fieldName}
            </div>
        );
    };
    
    const handleFieldClick = (fieldIndex) => {
        setActiveField(fieldIndex);
        console.log('Clicked field index:', fieldIndex);
    
        // Update navigation logic based on fieldIndex
        switch(fieldIndex) {
            case 0:
                navigate('/'); // Navigate to DataPool (root path) for field index 0
                break;
            case 1:
                navigate('/people'); // Navigate to MainDashboard for field index 1
                break;
            case 2:
                navigate('/notes'); // Navigate to MainDashboard for field index 1
                break;
                // Add more cases as needed for other fields
                case 3:
                    navigate('/highlights'); // Navigate to MainDashboard for field index 1
                    break;
                    // Add more cases as needed for other fields
            case 6:
                handleLogout(); // Navigate to MainDashboard for field index 1
                break;
            // Add more cases as needed for other fields
            default:
                // Optional: navigate to a default route or do nothing
                break;
        }
    };
    const renderSlices = () => {
            const colors = fields.map((_, index) =>
                index === activeField ? '#EAEAEA' : (index === hoverField ? '#f7f7f7' : '#FFFFFF')
            );
            const gradient = `conic-gradient(${colors.map((color, index) => `${color} ${index * 100 / fields.length}% ${(index + 1) * 100 / fields.length}%`).join(', ')})`;

            return (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: gradient,
                    }}
                />
            );
        };

        const renderTransparentSlices = () => {
            const rotationOffset = -Math.PI / 2.6; // 30 degrees rotation offset
        
            return fields.map((_, index) => {
                // Adjusting the starting angle for each slice to ensure correct mapping
                const startAngle = ((index - 0.5) / fields.length) * 2 * Math.PI + rotationOffset;
                const endAngle = ((index + 0.5) / fields.length) * 2 * Math.PI + rotationOffset;
        
                // Check if the index is even or odd
                const isEven = index % 2 === 0;
        
                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            clipPath: `polygon(50% 50%, ${50 + 60 * Math.cos(startAngle)}% ${50 + 60 * Math.sin(startAngle)}%, ${50 + 60 * Math.cos(endAngle)}% ${50 + 60 * Math.sin(endAngle)}%)`, // Increase the multiplier here
                            transition: 'background-color 0.6s cubic-bezier(.1, .7, .1, 1)', // Add a transition here
                        }}
                        onClick={() => handleFieldClick(index)}
                        onMouseEnter={() => setHoverField(index)}
                        onMouseLeave={() => setHoverField(null)}
                    />
                );
            });
        };

        const renderNumbers = () => {
            return fields.map((field, index) => {
                const angle = ((index - 1.5) / fields.length) * 2 * Math.PI; // Angle for the field number
                const x = 50 + 38 * Math.cos(angle); // Position for the field number
                const y = 50 + 38 * Math.sin(angle); // Position for the field number
        
                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%)`, // Remove the rotation
                            color: '#989898',
                            width: '10px',
                            height: '10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                            backgroundColor: '#DCDCDC',
                            
                            pointerEvents: 'none', // Add this line
                        }}
                    >
                        {field}
                    </div>
                );
            });
        };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '412px',
                backgroundColor: '#FAFAFA',     
                justifyContent: 'space-between', // Add this line to position the circle at the bottom
                alignItems: 'center',            
            }}
        >
             {isUserPromptVisible && (
                <div style={{margin:'30px'}}>
                    <UserPrompt />
                </div>
            )}
       
            <div
    style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end', // This will vertically center the child elements
        alignItems: 'center', // This will horizontally center the child elements
        width: '100%',
        height: '100%',
    }}
>
<animated.nav
    ref={navRef}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '5px solid #F5F5F5',
        marginBottom: '15px',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)',
        ...springProps, // Add the spring props here
    }}
>
    {renderSlices()}
    {renderTransparentSlices()}
    {renderNumbers()}
    {renderInnerContent()}
    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '40%',
        height: '40%',
        border: '5px solid #FAFAFA',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
    }} />
</animated.nav>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:'15px'}}>
            <text style={{ color: '#989898', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
    {fieldName || 'Select a field'}
</text>
                </div>
               
            
        </div>
        </div>
    );
    }
export default Navigation;


