import React, { useState } from 'react';

function BiggerSmaller({ customData }) {
    const [selectedSign, setSelectedSign] = useState('');
    const [message, setMessage] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleDragStart = (event, sign) => {
        event.dataTransfer.setData('sign', sign);
    };

    const handleDrop = (event) => {
        const sign = event.dataTransfer.getData('sign');
        setSelectedSign(sign);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const checkAnswer = () => {
        const num1 = customData?.number1;
        const num2 = customData?.number2;
        let isCorrect = false;

        if (selectedSign === '<' && num1 < num2) {
            isCorrect = true;
        } else if (selectedSign === '>' && num1 > num2) {
            isCorrect = true;
        } else if (selectedSign === '=' && num1 === num2) {
            isCorrect = true;
        }

        setMessage(isCorrect ? 'Correct!' : 'Incorrect!');
        if (!isCorrect) {
            setAttempts(attempts + 1);
        }
    };

    const reset = () => {
        setSelectedSign('');
        setMessage('');
    };

    const buttonStyle = {
        padding: '12px 24px',
        fontSize: '18px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '30px',
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ marginBottom: '30px' }}>{customData?.questionPrompt || "No question prompt provided"}</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '20px' }}>
                <span style={{ fontSize: '24px' }}>{customData?.number1}</span>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        width: '60px',
                        height: '60px',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '24px',
                    }}
                >
                    {selectedSign}
                </div>
                <span style={{ fontSize: '24px' }}>{customData?.number2}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '200px', marginBottom: '40px', gap: '20px' }}>
                {['<', '>', '='].map((sign) => (
                    <div
                        key={sign}
                        draggable
                        onDragStart={(e) => handleDragStart(e, sign)}
                        style={{
                            width: '60px',
                            height: '60px',
                            border: '1px solid #ccc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '24px',
                            cursor: 'pointer',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                        }}
                    >
                        {sign}
                    </div>
                ))}
            </div>
            <button
                onClick={checkAnswer}
                style={{
                    padding: '12px 24px',
                    fontSize: '18px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                }}
            >
                Check Answer
            </button>
            {message && (
                <>
                    {message === 'Incorrect!' && (
                        <div>
                            <div style={{ fontSize: '20px', color: 'red', marginBottom: '20px' }}>
                                {message}
                            </div>
                            <button style={buttonStyle} onClick={reset}>Reset</button>
                        </div>
                    )}
                    <div style={{ fontSize: '20px', color: message === 'Correct!' ? 'green' : 'red', marginTop: '20px' }}>
                        {message}
                    </div>
                </>
            )}
        </div>
    );
}

export default BiggerSmaller;
