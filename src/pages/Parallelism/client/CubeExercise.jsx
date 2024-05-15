import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CubeExercise = ({ customData }) => {
  const [selectedColor, setSelectedColor] = useState('red');
  const [cubeLines, setCubeLines] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const calculateCubePoints = (centerX, centerY, size) => {
    const halfSize = size / 2;
    const frontTopLeft = [centerX - halfSize, centerY - halfSize];
    const frontTopRight = [centerX + halfSize, centerY - halfSize];
    const frontBottomLeft = [centerX - halfSize, centerY + halfSize];
    const frontBottomRight = [centerX + halfSize, centerY + halfSize];

    const offsetX = halfSize / 2;
    const offsetY = halfSize / 2;

    const backTopLeft = [centerX - halfSize + offsetX, centerY - halfSize - offsetY];
    const backTopRight = [centerX + halfSize + offsetX, centerY - halfSize - offsetY];
    const backBottomLeft = [centerX - halfSize + offsetX, centerY + halfSize - offsetY];
    const backBottomRight = [centerX + halfSize + offsetX, centerY + halfSize - offsetY];

    return {
      frontTopLeft, frontTopRight, frontBottomLeft, frontBottomRight,
      backTopLeft, backTopRight, backBottomLeft, backBottomRight
    };
  };

  const cubePoints = calculateCubePoints(150, 150, 100);

  useEffect(() => {
    if (cubeLines.length === 0) {
      const lines = [
        { id: 1, points: [...cubePoints.frontTopLeft, ...cubePoints.frontTopRight], color: 'red' },
        { id: 2, points: [...cubePoints.frontTopRight, ...cubePoints.frontBottomRight], color: 'black' },
        { id: 3, points: [...cubePoints.frontBottomRight, ...cubePoints.frontBottomLeft], color: 'black' },
        { id: 4, points: [...cubePoints.frontBottomLeft, ...cubePoints.frontTopLeft], color: 'blue' },
        { id: 5, points: [...cubePoints.backTopLeft, ...cubePoints.backTopRight], color: 'black' },
        { id: 6, points: [...cubePoints.backTopRight, ...cubePoints.backBottomRight], color: 'black' },
        { id: 7, points: [...cubePoints.backBottomRight, ...cubePoints.backBottomLeft], color: 'black' },
        { id: 8, points: [...cubePoints.backBottomLeft, ...cubePoints.backTopLeft], color: 'black' },
        { id: 9, points: [...cubePoints.frontTopLeft, ...cubePoints.backTopLeft], color: 'yellow' },
        { id: 10, points: [...cubePoints.frontTopRight, ...cubePoints.backTopRight], color: 'black' },
        { id: 11, points: [...cubePoints.frontBottomRight, ...cubePoints.backBottomRight], color: 'black' },
        { id: 12, points: [...cubePoints.frontBottomLeft, ...cubePoints.backBottomLeft], color: 'black' },
      ];
      setCubeLines(lines);
    }
  }, [cubeLines, cubePoints]);

  const handleLineClick = (id) => {
    if (id === 1 || id === 4 || id === 9) return; 
    setCubeLines(lines =>
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
    const isCorrect = cubeLines.every((line) => {
      if ([1, 3, 5, 7].includes(line.id)) {
        return line.color === 'red';
      } else if ([2, 4, 6, 8].includes(line.id)) {
        return line.color === 'blue';
      } else if ([9, 10, 11, 12].includes(line.id)) {
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
            margin-top: -50px;
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
            height: 24px;
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
            {cubeLines.map(line => (
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

export default CubeExercise;
