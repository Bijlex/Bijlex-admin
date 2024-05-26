import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the Captcha container, grid, and square
const CaptchaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh; /* Full height to center vertically */
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px); /* Adjust as needed */
  gap: 5px; /* Adjust as needed */
  margin-top: 20px;
`;

const GridSquare = styled.div`
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  border: 1px solid #ccc;
  cursor: pointer;
  background-size: 300px 300px; /* Adjust based on your image size */
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* Smooth transition for shadow and transform */

  &.selected {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add shadow */
    transform: scale(1.05); /* Slightly increase size to bring to front */
  }
`;

const MessageContainer = styled.div`
  height: 30px; /* Reserve space for the message */
  margin-top: 20px;
`;

const Message = styled.div`
  font-size: 18px;
  color: ${props => (props.correct ? 'green' : 'red')};
`;

const CaptchaCircles = ({ customData }) => {
    const [selectedSquares, setSelectedSquares] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState(null);
    const questionPrompt = customData?.questionPrompt || "No prompt provided";
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (customData?.imageFile) {
            const url = URL.createObjectURL(customData.imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url); // Clean up the URL object when the component unmounts or imageFile changes
        }
    }, [customData?.imageFile]);

    const handleSquareClick = (squareId) => {
        setSelectedSquares((prev) => {
            if (prev.includes(squareId)) {
                return prev.filter((id) => id !== squareId); // Deselect the square
            }
            return [...prev, squareId]; // Select the square
        });
    };

    const checkAnswers = () => {
        const correctSquares = customData.selectedSquares;
        const isCorrect = JSON.stringify(selectedSquares.sort()) === JSON.stringify(correctSquares.sort());
        setMessage(isCorrect ? 'Correct!' : 'Incorrect!');
        if (!isCorrect) {
            setAttempts(attempts + 1);
        }
    };

    const reset = () => {
        setSelectedSquares([]);
        setMessage(null);
    };

    return (
        <CaptchaContainer>
            <h2>{questionPrompt}</h2>
            <GridContainer>
                {Array.from({ length: 9 }, (_, i) => {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    const backgroundPosition = `-${col * 100}px -${row * 100}px`;

                    return (
                        <GridSquare
                            key={i}
                            className={selectedSquares.includes(i) ? 'selected' : ''}
                            onClick={() => handleSquareClick(i)}
                            style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition }}
                        />
                    );
                })}
            </GridContainer>
            <button style={buttonStyle} onClick={checkAnswers}>Check Answer</button>
            <MessageContainer>
                {message && <Message correct={message === 'Correct!'}>{message}</Message>}
            </MessageContainer>
            {message === 'Incorrect!' && attempts < 2 && (
                <button style={buttonStyle} onClick={reset}>Retry</button>
            )}
            {attempts >= 2 && (
                <button style={buttonStyle}>Continue</button>
            )}
        </CaptchaContainer>
    );
};

const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px'
};

export default CaptchaCircles;
