import React, { useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser } from '@fortawesome/free-solid-svg-icons';

const GRID_SIZE = 12;
const CELL_SIZE = 35;

// Define the trapezium points with the wider base at the bottom
const trapeziumPoints = [
  { x: 4 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-left
  { x: 8 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-right
  { x: 10 * CELL_SIZE, y: 7 * CELL_SIZE }, // bottom-right
  { x: 2 * CELL_SIZE, y: 7 * CELL_SIZE }  // bottom-left
];

const correctDiagonals = [
  [trapeziumPoints[0].x, trapeziumPoints[0].y, trapeziumPoints[2].x, trapeziumPoints[2].y], // top-left to bottom-right
  [trapeziumPoints[1].x, trapeziumPoints[1].y, trapeziumPoints[3].x, trapeziumPoints[3].y], // top-right to bottom-left
  [trapeziumPoints[2].x, trapeziumPoints[2].y, trapeziumPoints[0].x, trapeziumPoints[0].y], // bottom-right to top-left
  [trapeziumPoints[3].x, trapeziumPoints[3].y, trapeziumPoints[1].x, trapeziumPoints[1].y]  // bottom-left to top-right
];

const styles = {
  app: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' },
  gridContainer: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  buttonsContainer: { display: 'flex', flexDirection: 'column', marginLeft: '20px' },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { marginTop: '20px', fontSize: '18px', fontWeight: 'bold' },
  disabled: {
    pointerEvents: 'none',
    opacity: '0.6',
  },
  stage: {
    opacity: '1', // Initial opacity for stage
  },
  rect: {
    opacity: '1', // Initial opacity for grid squares
  },
  line: {
    opacity: '1', // Initial opacity for lines
  }
};

const DiagonalTrapezium = ({ customData }) => {
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [tool, setTool] = useState(null); // 'pencil' or 'eraser'
  const [disabled, setDisabled] = useState(false); // State to manage disabling the component

  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const snapToGrid = (value) => Math.round(value / CELL_SIZE) * CELL_SIZE;

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

  const isCloseEnough = (points1, points2) => {
    const tolerance = 5;
    for (let i = 0; i < points1.length; i++) {
      if (Math.abs(points1[i] - points2[i]) > tolerance) {
        return false;
      }
    }
    return true;
  };

  const checkDiagonals = () => {
    if (lines.length !== 2) {
      setMessage('Please draw exactly two diagonals');
      setAttempts(attempts + 1);
      setDisabled(true); // Disable the component
      return;
    }

    const matchedLines = lines.map(line => {
      return correctDiagonals.some(correctLine => isCloseEnough(line.points, correctLine));
    });

    if (matchedLines.every(matched => matched)) {
      setMessage('Correct');
    } else {
      setMessage('Incorrect');
      setAttempts(attempts + 1);
      setDisabled(true); // Disable the component
    }
  };

  const reset = () => {
    setLines([]);
    setMessage('');
    setStartPoint(null);
    setPreviewPoint(null);
    setDisabled(false); // Enable the component
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
          style={{ cursor: tool === 'eraser' ? 'pointer' : 'default', ...styles.stage, ...(disabled ? { opacity: '0.6' } : {}) }}
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
                  style={{ ...styles.rect, ...(disabled ? { opacity: '0.6' } : {}) }}
                />
              ))
            )}
            <Line
              points={[
                trapeziumPoints[0].x, trapeziumPoints[0].y,
                trapeziumPoints[1].x, trapeziumPoints[1].y,
                trapeziumPoints[2].x, trapeziumPoints[2].y,
                trapeziumPoints[3].x, trapeziumPoints[3].y,
                trapeziumPoints[0].x, trapeziumPoints[0].y
              ]}
              stroke="black"
              strokeWidth={4}
              closed
              style={{ ...styles.line, ...(disabled ? { opacity: '0.6' } : {}) }}
            />
            {startPoint && previewPoint && (
              <Line
                points={[startPoint.x, startPoint.y, previewPoint.x, previewPoint.y]}
                stroke="blue"
                strokeWidth={4}
                dash={[10, 5]}
                style={{ ...styles.line, ...(disabled ? { opacity: '0.6' } : {}) }}
              />
            )}
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke={['red', 'blue', 'green', 'orange', 'purple', 'brown'][i % 6]} strokeWidth={4} />
            ))}
          </Layer>
        </Stage>
        <div style={styles.buttonsContainer}>
          <button
            style={{ ...styles.button, backgroundColor: tool === 'pencil' ? 'blue' : 'green', ...(disabled ? { opacity: '0.6' } : {})}}
            onClick={() => setTool('pencil')}
            disabled={disabled} // Disable the button when disabled
          >
            <FontAwesomeIcon icon={faPencil} style={{ marginRight: '8px' }} />
            Pencil
          </button>
          <button
            style={{ ...styles.button, backgroundColor: tool === 'eraser' ? 'blue' : 'green', ...(disabled ? { opacity: '0.6' } : {}) }}
            onClick={() => setTool('eraser')}
            disabled={disabled} // Disable the button when disabled
          >
            <FontAwesomeIcon icon={faEraser} style={{ marginRight: '8px' }} />
            Eraser
          </button>
        </div>
      </div>
      <button style={{ ...styles.button, backgroundColor: 'green', ...(disabled ? { opacity: '0.6' } : {}) }} onClick={checkDiagonals} disabled={disabled}>
        Check answer
      </button>
      {message && <div style={{ ...styles.message, ...(disabled ? { opacity: '0.6' } : {}) }}>{message}</div>}
      {(message === 'Incorrect' || message === 'Please draw exactly two diagonals') && (
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={reset}>
          Retry
        </button>
      )}
    </div>
  );
};

export default DiagonalTrapezium;
