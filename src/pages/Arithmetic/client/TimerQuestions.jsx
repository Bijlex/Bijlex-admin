import React, { useState, useEffect } from 'react';

function TimerQuestions({ customData }) {
    const { questionPrompt, arithmeticQuestion, finalAnswer, timer } = customData;
    const [userAnswer, setUserAnswer] = useState("");
    const [timeLeft, setTimeLeft] = useState(timer);
    const [isCorrect, setIsCorrect] = useState(null);
    const [timeUp, setTimeUp] = useState(false); // Track if time is up
    const [attempts, setAttempts] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false); // Track if answer has been submitted

    useEffect(() => {
        if (timeLeft > 0 && !answerSubmitted) {
            const countdown = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            if (!answerSubmitted) {
                setIsCorrect(false);
                setAttempts(attempts + 1);
            }
            setTimeUp(true);
        }
    }, [timeLeft, answerSubmitted]);

    const handleAnswerChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmit = () => {
        if (!answerSubmitted) {
            if (userAnswer === finalAnswer) {
                setIsCorrect(true);
                setAnswerSubmitted(true);
                return;
            }
            setIsCorrect(false);
            setAttempts(attempts + 1);
            setAnswerSubmitted(true);
        }
    };

    const reset = () => {
        setUserAnswer("");
        setIsCorrect(null);
        setTimeLeft(timer);
        setTimeUp(false);
        setAnswerSubmitted(false);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>{questionPrompt}</h2>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'black' }}>{arithmeticQuestion}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={handleAnswerChange}
                    placeholder="Enter your answer"
                    style={{ width: '200px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleSubmit} style={buttonStyle}>
                    Check Answer
                </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'black' }}>Time left: {timeLeft} seconds</p>
            </div>
            {isCorrect === true && <p style={{ color: 'black' }}>Correct!</p>}
            {isCorrect === false && answerSubmitted && <p style={{ color: 'black' }}>Incorrect, try again.</p>}
            {timeUp && !answerSubmitted && <p style={{ color: 'black' }}>You did not answer in time.</p>}
            {(isCorrect === false || timeUp) && !isCorrect && (
                <button style={buttonStyle} onClick={reset}>Retry</button>
            )}
            {attempts >= 2 && (
                <button style={buttonStyle}>Continue</button>
            )}
        </div>
    );
}

const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px'
};

export default TimerQuestions;
