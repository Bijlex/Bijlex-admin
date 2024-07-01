import React, { useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const GRID_SIZE = 12;
const CELL_SIZE = 35;

const DivideShapes = ({ customData }) => {
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [tool, setTool] = useState(null); // 'pencil' or 'eraser'
  const questionPrompt = customData?.questionPrompt || "No prompt provided";
  const correctLinesData = customData?.lines || {};
  const selectedShape = customData?.shape || 'parallelogram'; // Default to parallelogram if not specified

  // Generate shape points dynamically based on CELL_SIZE
  const generateShapePoints = (shapeType) => {
    switch (shapeType) {
      case 'parallelogram':
        return [
          { x: 2 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-left
          { x: 8 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-right
          { x: 10 * CELL_SIZE, y: 5 * CELL_SIZE }, // bottom-right
          { x: 4 * CELL_SIZE, y: 5 * CELL_SIZE } // bottom-left
        ];
      case 'trapezium':
        return [
          { x: 2 * CELL_SIZE, y: 7 * CELL_SIZE }, // bottom-left
          { x: 10 * CELL_SIZE, y: 7 * CELL_SIZE }, // bottom-right
          { x: 8 * CELL_SIZE, y: 3 * CELL_SIZE }, // top-right
          { x: 4 * CELL_SIZE, y: 3 * CELL_SIZE } // top-left
        ];
      case 'rhombus':
        return [
          { x: 6 * CELL_SIZE, y: 1 * CELL_SIZE }, // top
          { x: 10 * CELL_SIZE, y: 5 * CELL_SIZE }, // right
          { x: 6 * CELL_SIZE, y: 9 * CELL_SIZE }, // bottom
          { x: 2 * CELL_SIZE, y: 5 * CELL_SIZE } // left
        ];
      case 'triangle':
        return [
          { x: 6 * CELL_SIZE, y: 1 * CELL_SIZE }, // top
          { x: 10 * CELL_SIZE, y: 9 * CELL_SIZE }, // bottom-right
          { x: 2 * CELL_SIZE, y: 9 * CELL_SIZE } // bottom-left
        ];
      case 'rectangle':
        return [
          { x: 3 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-left
          { x: 9 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-right
          { x: 9 * CELL_SIZE, y: 8 * CELL_SIZE }, // bottom-right
          { x: 3 * CELL_SIZE, y: 8 * CELL_SIZE } // bottom-left
        ];
      default:
        return [];
    }
  };

  const shapePoints = generateShapePoints(selectedShape);

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
    return points1.every((p, idx) => p === points2[idx]) || points1.every((p, idx) => p === points2[points2.length - 1 - idx]);
  };

  const checkDiagonals = () => {
    const snappedUserLines = lines.map(line => line.points.map(snapToGrid));

    if (snappedUserLines.length === 0) {
      setMessage('Please draw at least one line');
      return;
    }

    const userLinesSets = snappedUserLines.map(line => new Set(line));
    const correctLinesSets = Object.values(correctLinesData).map(group =>
      group.map(item => new Set(item.cells.map(cell => cell * CELL_SIZE)))
    );

    let foundCorrectAnswer = false;

    correctLinesSets.forEach((correctSet) => {
      if (correctSet.length === userLinesSets.length) {
        const match = correctSet.every(correctLine =>
          userLinesSets.some(userLine =>
            userLine.size === correctLine.size && [...userLine].every(point => correctLine.has(point))
          )
        );
        if (match) {
          foundCorrectAnswer = true;
        }
      }
    });

    if (foundCorrectAnswer) {
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

  const renderShape = () => {
    switch (selectedShape) {
      case 'parallelogram':
        return (
          <Line
            points={shapePoints.map(point => [point.x, point.y]).flat()}
            stroke="black"
            strokeWidth={4}
            closed
          />
        );
      case 'trapezium':
        return (
          <Line
            points={shapePoints.map(point => [point.x, point.y]).flat()}
            stroke="black"
            strokeWidth={4}
            closed
          />
        );
      case 'rhombus':
        return (
          <Line
            points={shapePoints.map(point => [point.x, point.y]).flat()}
            stroke="black"
            strokeWidth={4}
            closed
          />
        );
      case 'triangle':
        return (
          <Line
            points={shapePoints.map(point => [point.x, point.y]).flat()}
            stroke="black"
            strokeWidth={4}
            closed
          />
        );
      case 'rectangle':
        return (
          <Line
            points={shapePoints.map(point => [point.x, point.y]).flat()}
            stroke="black"
            strokeWidth={4}
            closed
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
            {renderShape()}
            {startPoint && previewPoint && (
              <Line
                points={[startPoint.x, startPoint.y, previewPoint.x, previewPoint.y]}
                stroke="blue"
                strokeWidth={4}
                dash={[10, 5]}
              />
            )}
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke="blue" strokeWidth={4} />
            ))}
          </Layer>
        </Stage>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
          <button
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', backgroundColor: tool === 'pencil' ? 'blue' : 'green' }}
            onClick={() => setTool('pencil')}
          >
            Pencil
          </button>
          <button
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', backgroundColor: tool === 'eraser' ? 'blue' : 'green' }}
            onClick={() => setTool('eraser')}
          >
            Eraser
          </button>
        </div>
      </div>
      <button
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', backgroundColor: 'green' }}
        onClick={checkDiagonals}
      >
        Check answer
      </button>
      {message && <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>{message}</div>}
      {(message === 'Incorrect' || message === 'Please draw the correct number of lines') && attempts < 2 && (
        <button
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', backgroundColor: 'green' }}
          onClick={reset}
        >
          Retry
        </button>
      )}
      {attempts >= 2 && (
        <button
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', backgroundColor: 'green' }}
          onClick={() => window.location.reload()}
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default DivideShapes;