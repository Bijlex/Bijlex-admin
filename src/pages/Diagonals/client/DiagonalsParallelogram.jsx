import React, { useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const GRID_SIZE = 12;
const CELL_SIZE = 35;

const parallelogramPoints = [
  { x: 2 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-left
  { x: 8 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-right (increased x value to make it wider)
  { x: 10 * CELL_SIZE, y: 5 * CELL_SIZE }, // bottom-right (decreased y value to make it shorter)
  { x: 4 * CELL_SIZE, y: 5 * CELL_SIZE } // bottom-left (decreased y value to make it shorter)
];

const correctDiagonals = [
  [parallelogramPoints[0].x, parallelogramPoints[0].y, parallelogramPoints[2].x, parallelogramPoints[2].y],
  [parallelogramPoints[2].x, parallelogramPoints[2].y, parallelogramPoints[0].x, parallelogramPoints[0].y],
  [parallelogramPoints[1].x, parallelogramPoints[1].y, parallelogramPoints[3].x, parallelogramPoints[3].y],
  [parallelogramPoints[3].x, parallelogramPoints[3].y, parallelogramPoints[1].x, parallelogramPoints[1].y]
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
    marginBottom: '10px'
  },
  message: { marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }
};

const DiagonalsParallelogram = ({ customData }) => {
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [tool, setTool] = useState(null); // 'pencil' or 'eraser'
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
            <Line
              points={[
                parallelogramPoints[0].x, parallelogramPoints[0].y,
                parallelogramPoints[1].x, parallelogramPoints[1].y,
                parallelogramPoints[2].x, parallelogramPoints[2].y,
                parallelogramPoints[3].x, parallelogramPoints[3].y,
                parallelogramPoints[0].x, parallelogramPoints[0].y
              ]}
              stroke="black"
              strokeWidth={4}
              closed
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
              <Line key={i} points={line.points} stroke={['red', 'blue', 'green', 'orange', 'purple', 'brown'][i % 6]} strokeWidth={4} />
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
      {(message === 'Incorrect' || message === 'Please draw exactly two diagonals') && attempts < 2 && (
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={reset}>Retry</button>
      )}
      {attempts >= 2 && (
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={() => setMessage('Continue to the next question.')}>Continue</button>
      )}
    </div>
  );
};

export default DiagonalsParallelogram;
