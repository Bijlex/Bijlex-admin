import React, { useState } from 'react';
import Draggable from 'react-draggable';

function SquareToParallelogram({ customData }) {
    const [corners, setCorners] = useState([
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 100, y: 200 },
        { x: 200, y: 200 },
    ]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const questionPrompt = customData?.questionPrompt || "No prompt provided";

    const handleDrag = (index, e, ui) => {
        const newCorners = [...corners];
        newCorners[index] = {
            x: newCorners[index].x + ui.deltaX,
            y: newCorners[index].y + ui.deltaY,
        };
        setCorners(newCorners);
        setIsCorrect(null); // Reset the message when dragging starts
    };

    const checkAnswer = () => {
        const correctCorners = [
            { x: 120, y: 150 },
            { x: 320, y: 150 },
            { x: 80, y: 250 },
            { x: 280, y: 250 },
        ];
        const isCorrectAnswer = corners.every((corner, index) => {
            const correctCorner = correctCorners[index];
            return (
                Math.abs(corner.x - correctCorner.x) < 5 &&
                Math.abs(corner.y - correctCorner.y) < 5
            );
        });

        setIsCorrect(isCorrectAnswer);
        if (!isCorrectAnswer) {
            setAttempts(attempts + 1);
        }
    };

    const reset = () => {
        setCorners([
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 100, y: 200 },
            { x: 200, y: 200 },
        ]);
        setIsCorrect(null);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
            <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* Parallelogram */}
                <polygon points="120,150 320,150 280,250 80,250" stroke="black" strokeWidth="2" fill="yellow" />
                {/* Square */}
                <polygon points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[3].x},${corners[3].y} ${corners[2].x},${corners[2].y}`} stroke="black" strokeWidth="4" fill="none" />
                {/* Draggable corners */}
                {corners.map((corner, index) => (
                    <Draggable
                        key={index}
                        position={{ x: corner.x, y: corner.y }}
                        onDrag={(e, ui) => handleDrag(index, e, ui)}
                    >
                        <rect x={-5} y={-5} width={10} height={10} fill="red" cursor="pointer" />
                    </Draggable>
                ))}
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

export default SquareToParallelogram;
