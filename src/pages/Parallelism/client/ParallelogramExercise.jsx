import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const ParallelogramExercise = ({ customData }) => {
  const [lines, setLines] = useState([
    { id: 1, points: [50, 100, 150, 100], color: 'red' },
    { id: 2, points: [150, 100, 200, 150], color: 'blue' },
    { id: 3, points: [100, 150, 200, 150], color: 'black' },
    { id: 4, points: [100, 150, 50, 100], color: 'black' }
  ]);
  const [selectedColor, setSelectedColor] = useState('red');
  const [resultMessage, setResultMessage] = useState('');
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const handleClick = (id) => {
    if (id === 1 || id === 2) return;
    const updatedLines = lines.map(line => {
      if (line.id === id) {
        const newColor = line.color !== 'black' && line.color === selectedColor ? 'black' : selectedColor;
        return { ...line, color: newColor };
      }
      return line;
    });
    setLines(updatedLines);
  };

  const handleCheckAnswer = () => {
    const baseLine = lines.find(line => line.id === 1).color;
    const topLine = lines.find(line => line.id === 3).color;
    const rightSide = lines.find(line => line.id === 2).color;
    const leftSide = lines.find(line => line.id === 4).color;

    const isCorrect = (baseLine === topLine) && (rightSide === leftSide);
    setResultMessage(isCorrect ? "Correct!" : "Incorrect, try again.");
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;  
          }
          .stage {
            margin-top: 20px;
          }
          .radio-label {
            margin-right: 10px;
            font-size: 16px;
          }
          .result-message {
            margin-top: 20px;
            font-size: 16px;
            color: black;
            height: 24px; // Reserve space for one line of text
          }
          .result-message.show {
            visibility: visible;
          }
          .check-button {
            background-color: green;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-top: 20px;
            cursor: pointer;
            border-radius: 5px;
          }
        `}
      </style>
      <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
      <div>
        <label className="radio-label">
          <input
            type="radio"
            value="red"
            checked={selectedColor === 'red'}
            onChange={() => setSelectedColor('red')}
            className="radio-input"
          /> Red
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="blue"
            checked={selectedColor === 'blue'}
            onChange={() => setSelectedColor('blue')}
            className="radio-input"
          /> Blue
        </label>
      </div>
      <Stage width={300} height={300} className="stage">
        <Layer>
          {lines.map(line => (
            <Line
              key={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
              onClick={() => handleClick(line.id)}
            />
          ))}
        </Layer>
      </Stage>
      <div className={`result-message ${resultMessage ? 'show' : ''}`}>
        {resultMessage}
      </div>
      <button onClick={handleCheckAnswer} className="check-button">Check Answer</button>
    </div>
  );
};

export default ParallelogramExercise;
