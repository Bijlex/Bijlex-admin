import React, { useState } from 'react';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';

const GRID_SIZE = 12;
const CELL_SIZE = 35;
const RECT_WIDTH = 8; // Rectangle width in number of cells
const RECT_HEIGHT = 5; // Rectangle height in number of cells

const DiagonalsRectangle = ({ customData }) => {
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const snapToGrid = (value) => {
    return Math.round(value / CELL_SIZE) * CELL_SIZE;
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);

    if (!startPoint) {
      setStartPoint({ x: snappedX, y: snappedY });
    } else {
      setLines([...lines, { points: [startPoint.x, startPoint.y, snappedX, snappedY] }]);
      setStartPoint(null);
    }
  };

  const correctDiagonals = [
    [2 * CELL_SIZE, 2 * CELL_SIZE, (2 + RECT_WIDTH) * CELL_SIZE, (2 + RECT_HEIGHT) * CELL_SIZE], // top-left to bottom-right of the rectangle
    [(2 + RECT_WIDTH) * CELL_SIZE, (2 + RECT_HEIGHT) * CELL_SIZE, 2 * CELL_SIZE, 2 * CELL_SIZE], // bottom-right to top-left of the rectangle
    [(2 + RECT_WIDTH) * CELL_SIZE, 2 * CELL_SIZE, 2 * CELL_SIZE, (2 + RECT_HEIGHT) * CELL_SIZE], // top-right to bottom-left of the rectangle
    [2 * CELL_SIZE, (2 + RECT_HEIGHT) * CELL_SIZE, (2 + RECT_WIDTH) * CELL_SIZE, 2 * CELL_SIZE]  // bottom-left to top-right of the rectangle
  ];

  const isCloseEnough = (points1, points2) => {
    const tolerance = 5; // adjust tolerance as needed
    for (let i = 0; i < points1.length; i++) {
      if (Math.abs(points1[i] - points2[i]) > tolerance) {
        return false;
      }
    }
    return true;
  };

  const checkDiagonals = () => {
    if (lines.length < 2) {
      setMessage('Too few lines');
      setAttempts(attempts + 1);
      return;
    }

    if (lines.length > 2) {
      setMessage('Too many lines');
      setAttempts(attempts + 1);
      return;
    }

    const matchedLines = correctDiagonals.map((correctLine) =>
      lines.some((line) => isCloseEnough(line.points, correctLine))
    );

    const topLeftToBottomRightMatched = matchedLines.slice(0, 2).some(matched => matched === true);
    const topRightToBottomLeftMatched = matchedLines.slice(2).some(matched => matched === true);

    if (topLeftToBottomRightMatched && topRightToBottomLeftMatched) {
      setMessage('Correct');
    } else {
      setMessage('Incorrect');
      setAttempts(attempts + 1);
    }
  };

  const reset = () => {
    setLines([]);
    setMessage('');
    setStartPoint(null);
  };

  return (
    <div style={styles.app}>
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <Stage
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => (
              <Rect
                key={`${row}-${col}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                stroke="lightgrey"
              />
            ))
          )}
          <Rect
            x={2 * CELL_SIZE}
            y={2 * CELL_SIZE}
            width={RECT_WIDTH * CELL_SIZE}
            height={RECT_HEIGHT * CELL_SIZE}
            stroke="black"
            strokeWidth={4}
          />
          {startPoint && (
            <Circle
              x={startPoint.x}
              y={startPoint.y}
              radius={6}
              fill="yellow"
            />
          )}
          {lines.map((line, i) => (
            <Line key={i} points={line.points} stroke="red" strokeWidth={4} />
          ))}
        </Layer>
      </Stage>
      <button style={styles.button} onClick={checkDiagonals}>Check answer</button>
      {message && <div style={styles.message}>{message}</div>}
      {(message === 'Incorrect' || message === 'Too few lines' || message === 'Too many lines') && attempts < 3 && (
        <button style={styles.button} onClick={reset}>Retry</button>
      )}
      {attempts >= 3 && (
        <button style={styles.button} onClick={() => setMessage('Continue to the next question.')}>Continue</button>
      )}
    </div>
  );
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold'
  }
};

export default DiagonalsRectangle;
