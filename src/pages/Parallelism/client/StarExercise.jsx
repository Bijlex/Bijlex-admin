import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const StarExercise = ({ customData }) => {
  const [selectedColor, setSelectedColor] = useState('red');
  const [starLines, setStarLines] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const calculateStarPoints = (centerX, centerY, innerRadius, outerRadius, points) => {
    const angleStep = Math.PI / points;
    const starPoints = [];
    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep - Math.PI / 2;
      starPoints.push(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    }
    return starPoints;
  };

  const starPoints = calculateStarPoints(150, 150, 68, 120, 6);
  if (starLines.length === 0) {
    const lines = [];
    for (let i = 0; i < starPoints.length; i += 2) {
      const nextPointIndex = (i + 2) % starPoints.length;
      const color = i === 0 ? 'red' : i === 2 ? 'blue' : i === 4 ? 'yellow' : 'black';
      lines.push({
        id: i / 2 + 1,
        points: [starPoints[i], starPoints[i + 1], starPoints[nextPointIndex], starPoints[nextPointIndex + 1]],
        color: color,
      });
    }
    setStarLines(lines);
  }

  const handleLineClick = (id) => {
    if (id === 1 || id === 2 || id === 3) return;
    setStarLines(lines =>
      lines.map(line => {
        if (line.id === id) {
          const newColor = line.color !== 'black' && line.color === selectedColor ? 'black' : selectedColor;
          return { ...line, color: newColor };
        }
        return line;
      })
    );
  };

  const checkAnswer = () => {
    const isCorrect = starLines.every((line) => {
      if (line.id === 1 || line.id === 4 || line.id === 7 || line.id === 10) {
        return line.color === 'red';
      } else if (line.id === 2 || line.id === 5 || line.id === 8 || line.id === 11) {
        return line.color === 'blue';
      } else if (line.id === 3 || line.id === 6 || line.id === 9 || line.id === 12) {
        return line.color === 'yellow';
      }
      return false;
    });
    setResultMessage(isCorrect ? "Correct!" : "Incorrect, try again.");
  };

  return (
    <>
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin-top: -50px; // Adjust as needed to center vertically
          }
          .radio-label {
            margin: 10px;
            font-size: 16px;
          }
          .radio-input {
            margin-right: 10px;
          }
          .result-message {
            margin-top: 20px;
            font-size: 16px;
            color: black;
            height: 24px; // Reserve space for the message
            visibility: ${resultMessage ? 'visible' : 'hidden'};
          }
          .check-button {
            background-color: green;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-top: 20px;
            cursor: pointer;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .check-button:hover {
            background-color: darkgreen;
          }
        `}
      </style>
      <div className="container">
        <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
        <div>
          <label className="radio-label">
            <input
              type="radio"
              value="red"
              checked={selectedColor === 'red'}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="radio-input"
            /> Red
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="blue"
              checked={selectedColor === 'blue'}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="radio-input"
            /> Blue
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="yellow"
              checked={selectedColor === 'yellow'}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="radio-input"
            /> Yellow
          </label>
        </div>
        <Stage width={300} height={300}>
          <Layer>
            {starLines.map(line => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.color}
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
                onClick={() => handleLineClick(line.id)}
              />
            ))}
          </Layer>
        </Stage>
        <div className="result-message">
          {resultMessage}
        </div>
        <button onClick={checkAnswer} className="check-button">
          Check Answer
        </button>
      </div>
    </>
  );
};

export default StarExercise;
