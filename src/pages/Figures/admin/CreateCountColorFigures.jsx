import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Shape } from 'react-konva';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

const GRID_SIZE = 12;
const CELL_SIZE = 35;

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
  message: { marginTop: '20px', fontSize: '18px', fontWeight: 'bold' },
  colorOptions: { display: 'flex', flexDirection: 'column', marginRight: '20px' },
  radio: { margin: '5px 0' },
};

const CreateCountColorFigures = ({ setCustomData, customData }) => {
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [tool, setTool] = useState(null); // 'pencil', 'eraser', 'fill'
  const [selectedColor, setSelectedColor] = useState('black');
  const [message, setMessage] = useState('');
  const [currentColor, setCurrentColor] = useState('black'); // Track current drawing color
  const [filledShapes, setFilledShapes] = useState([]); // Track filled shapes

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
  }, [customData]);

  const saveExercise = async () => {
    const customData = { questionPrompt };
    setCustomData(customData);
  };

  const snapToGrid = (value) => Math.round(value / CELL_SIZE) * CELL_SIZE;

  const handleMouseDown = (e) => {
    if (tool === 'pencil') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);
      if (!startPoint) {
        setStartPoint({ x: snappedX, y: snappedY });
      } else {
        const newLine = { points: [startPoint.x, startPoint.y, snappedX, snappedY], color: currentColor };
        setLines([...lines, newLine]);

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
    if (tool === 'fill') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const shapeToFill = findShapeToFill(x, y);
      if (shapeToFill) {
        setFilledShapes([...filledShapes, { points: shapeToFill, color: selectedColor }]);
      }
    } else if (tool === 'eraser') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newLines = lines.filter(line => {
        const [x1, y1, x2, y2] = line.points;
        return distanceToSegment(x, y, x1, y1, x2, y2) >= CELL_SIZE / 2;
      });
      setLines(newLines);
    }
  };

  const reset = () => {
    setLines([]);
    setFilledShapes([]);
    setStartPoint(null);
    setPreviewPoint(null);
    setMessage('');
  };

  const findShapeToFill = (clickX, clickY) => {
    // This function should return points of the shape to fill based on lines drawn
    const areaPoints = [];
    const visited = new Set();
    const queue = [{ x: clickX, y: clickY }];
    let found = false;

    while (queue.length > 0) {
      const { x, y } = queue.shift();
      if (visited.has(`${x},${y}`)) {
        continue;
      }
      visited.add(`${x},${y}`);
      areaPoints.push({ x, y });

      if (!found && isClosedArea(areaPoints)) {
        found = true;
        break;
      }

      queue.push({ x: x + 1, y });
      queue.push({ x: x - 1, y });
      queue.push({ x, y: y + 1 });
      queue.push({ x, y: y - 1 });
    }

    if (found) {
      return areaPoints;
    }

    return null;
  };

  const isClosedArea = (points) => {
    // Function to check if points form a closed shape
    if (points.length < 2) return false;
    const sortedPoints = points.sort((a, b) => a.x - b.x || a.y - b.y);
    const [minX, minY] = [sortedPoints[0].x, sortedPoints[0].y];
    const [maxX, maxY] = [sortedPoints[points.length - 1].x, sortedPoints[points.length - 1].y];
    const expectedPoints = new Set();

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        expectedPoints.add(`${x},${y}`);
      }
    }

    return points.every(({ x, y }) => expectedPoints.has(`${x},${y}`));
  };

  const handleFillButtonClick = () => {
    // Clear existing filled shapes before applying new fill
    setFilledShapes([]);

    // Find and fill shapes based on selected color
    lines.forEach(line => {
      if (line.color === selectedColor) {
        const shapeToFill = findShapeToFill(line.points[0], line.points[1]);
        if (shapeToFill) {
          setFilledShapes(prevShapes => [...prevShapes, { points: shapeToFill, color: selectedColor }]);
        }
      }
    });
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
    setSelectedColor(color);
  };

  return (
    <div style={styles.app}>
      <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Question Prompt:</label>
        <input
          type="text"
          value={questionPrompt}
          onChange={(e) => setQuestionPrompt(e.target.value)}
          placeholder="Enter the question prompt"
          style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={styles.gridContainer}>
        <div style={styles.colorOptions}>
          <label style={styles.radio}><input type="radio" value="red" name="color" onChange={() => handleColorChange('red')} /> Red</label>
          <label style={styles.radio}><input type="radio" value="blue" name="color" onChange={() => handleColorChange('blue')} /> Blue</label>
          <label style={styles.radio}><input type="radio" value="green" name="color" onChange={() => handleColorChange('green')} /> Green</label>
          <label style={styles.radio}><input type="radio" value="yellow" name="color" onChange={() => handleColorChange('yellow')} /> Yellow</label>
          <label style={styles.radio}><input type="radio" value="purple" name="color" onChange={() => handleColorChange('purple')} /> Purple</label>
        </div>
        <Stage
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
          style={{ cursor: tool === 'eraser' ? 'pointer' : 'default' }}
        >
          <Layer>
            {startPoint && previewPoint && (
              <Line
                points={[startPoint.x, startPoint.y, previewPoint.x, previewPoint.y]}
                stroke={currentColor}
                strokeWidth={4}
                dash={[10, 5]}
              />
            )}
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke={line.color} strokeWidth={4} />
            ))}
            {filledShapes.map((shape, i) => (
              <Shape
                key={i}
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  context.moveTo(shape.points[0].x, shape.points[0].y);
                  shape.points.forEach(point => context.lineTo(point.x, point.y));
                  context.closePath();
                  context.fillStyle = shape.color;
                  context.fillStrokeShape(shape);
                }}
                points={shape.points}
              />
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
          <button
            style={{ ...styles.button, backgroundColor: tool === 'fill' ? 'blue' : 'green' }}
            onClick={() => setTool('fill')}
          >
            Fill
          </button>
          <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={reset}>Reset</button>
          <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={handleFillButtonClick}>Apply Fill</button>
        </div>
      </div>
      {message && <div style={styles.message}>{message}</div>}
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: '30px', alignSelf: 'center' }}
      />
    </div>
  );
};

export default CreateCountColorFigures;
