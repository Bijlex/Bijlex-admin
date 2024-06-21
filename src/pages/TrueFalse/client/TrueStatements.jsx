import React, { useState, useEffect } from 'react';

function TrueStatements({ customData }) {
    const [selectedStatements, setSelectedStatements] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [cardsState, setCardsState] = useState(Array(customData.inputValues.length).fill(null));
    const [cardsDisabled, setCardsDisabled] = useState(false);
    const [retryAllowed, setRetryAllowed] = useState(true);

    useEffect(() => {
        if (attempts >= 2) {
            const correctStatements = customData.truthValues
                .map((truth, index) => (truth === 'true' ? 'correct' : 'incorrect'));

            setCardsState(correctStatements);
            setCardsDisabled(true);
            setRetryAllowed(false);
        }
    }, [attempts, customData.truthValues]);

    const handleCardClick = (index) => {
        if (cardsDisabled) return;
        setSelectedStatements((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    const checkAnswers = () => {
        const correctStatements = customData.truthValues
            .map((truth, index) => (truth === 'true' ? index : null))
            .filter((index) => index !== null);

        const allCorrect =
            selectedStatements.length === correctStatements.length &&
            selectedStatements.every((index) => correctStatements.includes(index));

        setIsCorrect(allCorrect);
        setShowMessage(true);

        if (!allCorrect) {
            setAttempts(attempts + 1);
            setCardsDisabled(true);

            if (attempts + 1 >= 2) {
                const newCardsState = customData.truthValues.map(truth => (truth === 'true' ? 'correct' : 'incorrect'));
                setCardsState(newCardsState);
            }
        }
    };

    const reset = () => {
        setSelectedStatements([]);
        setShowMessage(false);
        setIsCorrect(false);
        setAttempts(1);  // Ensure that attempts is set to 1 to allow only one retry
        setCardsState(Array(customData.inputValues.length).fill(null));
        setCardsDisabled(false);
        setRetryAllowed(false); // Prevent further retries
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
            <h2 style={{ marginBottom: '30px' }}>{customData?.questionPrompt || "No question prompt provided"}</h2>
            <div style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                {customData.inputValues.map((statement, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(index)}
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: cardsState[index] === 'correct' ? '0 0 10px 5px green' : cardsState[index] === 'incorrect' ? '0 0 10px 5px red' : selectedStatements.includes(index) ? '0 0 10px 5px yellow' : 'none',
                            background: selectedStatements.includes(index) ? '#fffbe6' : '#fff',
                            cursor: cardsDisabled ? 'not-allowed' : 'pointer',
                            transition: 'box-shadow 0.3s, transform 0.3s',
                            transform: selectedStatements.includes(index) ? 'scale(1.05)' : 'scale(1)',
                            textAlign: 'center',
                            marginBottom: '10px',
                            pointerEvents: cardsDisabled ? 'none' : 'auto'
                        }}
                    >
                        {statement}
                    </div>
                ))}
            </div>
            <button
                onClick={checkAnswers}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    maxWidth: '600px'
                }}
            >
                Check Answer
            </button>
            {showMessage && (
                <p style={{ marginTop: '20px', fontSize: '18px', color: isCorrect ? 'green' : 'red', maxWidth: '600px' }}>
                    {isCorrect ? 'Correct! Goed gedaan!' : 'Onjuist. Probeer het opnieuw!'}
                </p>
            )}
            {attempts > 0 && attempts < 2 && retryAllowed && (
                <button onClick={reset} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s', maxWidth: '600px' }}>
                    Retry
                </button>
            )}
        </div>
    );
}

export default TrueStatements;
