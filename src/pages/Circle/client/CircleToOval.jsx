import React, { useState } from 'react';
import Draggable from 'react-draggable';

function CircleToOval({ customData }) {
    const [height, setHeight] = useState(100);
    const [width, setWidth] = useState(100);
    const [isCorrect, setIsCorrect] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const questionPrompt = customData?.questionPrompt || "No prompt provided";

    const handleDrag = (e, ui) => {
        const newHeight = height - ui.deltaY;
        const newWidth = 80 * (160 - newHeight) / 160 + 72;
        if (newHeight > 0 && newHeight <= 180) {
            setHeight(newHeight);
            setWidth(newWidth);
        }
        setIsCorrect(null); // Reset the message when dragging starts
    };

    const checkAnswer = () => {
        if (parseInt(width) === 74) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
            setAttempts(attempts + 1);
        }
    };

    const reset = () => {
        setHeight(100);
        setWidth(100);
        setIsCorrect(null);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
            <svg width="400" height="400" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Oval */}
                <ellipse cx="100" cy="200" rx="80" ry="160" stroke="black" strokeWidth="2" fill="none" />
                {/* Inner Oval */}
                <ellipse cx="100" cy="200" rx="71" ry="152" stroke="black" strokeWidth="1" fill="none" />
                
                {/* Dynamic Oval */}
                <ellipse cx="100" cy="200" rx={width} ry={height} stroke="black" strokeWidth="10" fill="none" />
                
                {/* Draggable Point on the ellipse */}
                <Draggable
                    axis="y"
                    bounds={{ top: 200 - 180, bottom: 200 }}  // Adjust bounds to allow more dragging
                    position={{ x: 100, y: 200 - height }}
                    onDrag={handleDrag}
                >
                    <circle cx="0" cy="0" r="10" fill="red" cursor="pointer" />
                </Draggable>
            </svg>
            <button 
                onClick={checkAnswer} 
                style={{ 
                    marginTop: '20px', 
                    padding: '10px 20px', 
                    fontSize: '16px', 
                    cursor: 'pointer',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Check Answer
            </button>
            {isCorrect !== null && (
                <div style={{ marginTop: '20px', fontSize: '18px', color: 'black' }}>
                    {isCorrect ? "Correct!" : "Incorrect!"}
                </div>
            )}
            {isCorrect === false && attempts < 3 && (
                <button 
                    onClick={reset} 
                    style={{ 
                        marginTop: '20px', 
                        padding: '10px 20px', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        backgroundColor: 'orange',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Retry
                </button>
            )}
            {attempts >= 3 && (
                <button 
                    onClick={() => setIsCorrect(null)} 
                    style={{ 
                        marginTop: '20px', 
                        padding: '10px 20px', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Continue
                </button>
            )}
        </div>
    );
}

export default CircleToOval;

