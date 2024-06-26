import React, { useState, useEffect } from 'react';

function SquaresToDice({ customData }) {
    const { questionPrompt, squares } = customData;
    const [squareValues, setSquareValues] = useState(
        squares.map((square, index) => ({ id: index, value: square.value ? square.value : '' }))
    );
    const [allSquaresFilled, setAllSquaresFilled] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const allFilled = squareValues.every(square => square.value !== '');
        setAllSquaresFilled(allFilled);
    }, [squareValues]);

    const handleSquareChange = (id, event) => {
        const value = event.target.value;
        setSquareValues(prevValues => {
            const newValues = prevValues.map(square =>
                square.id === id ? { ...square, value: value } : square
            );
            return newValues;
        });
    };

    const checkAnswer = () => {
        const validPairs = [
            [1, 6], [6, 1],
            [2, 5], [5, 2],
            [3, 4], [4, 3]
        ];

        const values = squareValues.map(square => parseInt(square.value));

        const checkPair = (idx1, idx2) => {
            const pair = [values[idx1], values[idx2]];
            return validPairs.some(validPair =>
                (validPair[0] === pair[0] && validPair[1] === pair[1]) ||
                (validPair[1] === pair[0] && validPair[0] === pair[1])
            );
        };

        const isValid =
            checkPair(0, 4) &&
            checkPair(1, 3) &&
            checkPair(2, 5);

        if (isValid) {
            setResultMessage("Correct!");
        } else {
            setResultMessage("Incorrect, try again.");
            setAttemptCount(prev => prev + 1);
            if (attemptCount === 0) {
                setShowHint(true);
            }
        }
    };

    return (
        <div
            style={{
                padding: '50px',
                fontFamily: 'Arial, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
            <div
                style={{
                    position: 'relative',
                    marginBottom: '30px',
                    width: '100%', // Ensures the container spans full width
                    display: 'flex',
                    justifyContent: 'center', // Centers items horizontally
                    alignItems: 'center', // Centers items vertically
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 100px)',
                        gridTemplateRows: 'repeat(4, 100px)',
                        gap: '0px',
                    }}
                >
                    {[
                        null, 0, null,
                        1, 2, 3,
                        null, 4, null,
                        null, 5, null,
                    ].map((index, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: index !== null ? '1px solid #000' : 'none',
                                    backgroundColor: index !== null ? '#fff' : 'transparent',
                                }}
                            >
                                {index !== null ? (
                                    squares[index].value ? (
                                        <div
                                            style={{
                                                width: '80%',
                                                height: '80%',
                                                fontSize: '16px',
                                                textAlign: 'center',
                                                lineHeight: '80px',
                                            }}
                                        >
                                            {squares[index].value}
                                        </div>
                                    ) : (
                                        <input
                                            type="number"
                                            value={squareValues[index].value}
                                            onChange={(e) => handleSquareChange(squareValues[index].id, e)}
                                            style={{
                                                width: '80%',
                                                height: '80%',
                                                fontSize: '16px',
                                                textAlign: 'center',
                                                border: 'none',
                                                outline: 'none',
                                            }}
                                        />
                                    )
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
                {showHint && attemptCount === 1 && (
                    <img
                        src="/images/SquaresToDice/dice.png"
                        alt="Hint"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: 'calc(100% - 200px)', // Adjust the position here
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '150px',
                            zIndex: 1, // Ensures the image is above the squares grid
                        }}
                    />
                )}
            </div>
            {allSquaresFilled && (
                <button
                    onClick={checkAnswer}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    Check Answer
                </button>
            )}
            {resultMessage && (
                <div style={{ marginTop: '20px', fontSize: '16px', color: 'black' }}>
                    {resultMessage}
                </div>
            )}
        </div>
    );
}

export default SquaresToDice;
