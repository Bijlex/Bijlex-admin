import React, { useState } from 'react';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';

const GRID_SIZE = 12;
const CELL_SIZE = 35;
const RECT_WIDTH = 8; // Rectangle width in number of cells
const RECT_HEIGHT = 5; // Rectangle height in number of cells

const DiagonalsRectangle = ({ customData }) => {
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [tool, setTool] = useState(null); // 'pencil' or 'eraser'
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];

  const snapToGrid = (value) => {
    return Math.round(value / CELL_SIZE) * CELL_SIZE;
  };

  const handleMouseDown = (e) => {
    if (tool === 'pencil') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);

      if (!startPoint) {
        setStartPoint({ x: snappedX, y: snappedY });
      } else {
        setLines([...lines, { points: [startPoint.x, startPoint.y, snappedX, snappedY] }]);
        setStartPoint(null);
        setPreviewPoint(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (startPoint && tool === 'pencil') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);
      setPreviewPoint({ x: snappedX, y: snappedY });
    }
  };

  const distanceToSegment = (px, py, x1, y1, x2, y2) => {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  };

  const handleMouseClick = (e) => {
    if (tool === 'eraser') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newLines = lines.filter(line => {
        const [x1, y1, x2, y2] = line.points;
        return distanceToSegment(x, y, x1, y1, x2, y2) >= CELL_SIZE / 2;
      });
      setLines(newLines);
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
    setPreviewPoint(null);
  };

  return (
    <div style={styles.app}>
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div style={styles.gridContainer}>
        <Stage
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
          style={{ cursor: tool === 'eraser' ? 'pointer' : 'default' }}
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
            {startPoint && previewPoint && (
              <Line
                points={[startPoint.x, startPoint.y, previewPoint.x, previewPoint.y]}
                stroke="blue"
                strokeWidth={4}
                dash={[10, 5]}
              />
            )}
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke={colors[i % colors.length]} strokeWidth={4} />
            ))}
          </Layer>
        </Stage>
        <div style={styles.buttonsContainer}>
          <button
            style={{ ...styles.button, backgroundColor: tool === 'pencil' ? 'blue' : 'green' }}
            onClick={() => setTool('pencil')}
          >
            Pencil
          </button>
          <button
            style={{ ...styles.button, backgroundColor: tool === 'eraser' ? 'blue' : 'green' }}
            onClick={() => setTool('eraser')}
          >
            Eraser
          </button>
        </div>
      </div>
      <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={checkDiagonals}>Check answer</button>
      {message && <div style={styles.message}>{message}</div>}
      {(message === 'Incorrect' || message === 'Too few lines' || message === 'Too many lines') && attempts < 2 && (
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={reset}>Retry</button>
      )}
      {attempts >= 2 && (
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={() => setMessage('Continue to the next question.')}>Continue</button>
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
  gridContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold'
  }
};

export default DiagonalsRectangle;
