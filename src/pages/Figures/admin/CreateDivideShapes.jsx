import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

const GRID_SIZE = 12;
const CELL_SIZE = 35;

const shapes = {
  parallelogram: [
    { x: 2 * CELL_SIZE, y: 3 * CELL_SIZE }, // top-left
    { x: 8 * CELL_SIZE, y: 3 * CELL_SIZE }, // top-right
    { x: 10 * CELL_SIZE, y: 6 * CELL_SIZE }, // bottom-right
    { x: 4 * CELL_SIZE, y: 6 * CELL_SIZE } // bottom-left
  ],
  trapezium: [
    { x: 2 * CELL_SIZE, y: 7 * CELL_SIZE }, // bottom-left
    { x: 10 * CELL_SIZE, y: 7 * CELL_SIZE }, // bottom-right
    { x: 8 * CELL_SIZE, y: 3 * CELL_SIZE }, // top-right
    { x: 4 * CELL_SIZE, y: 3 * CELL_SIZE } // top-left
  ],
  rhombus: [
    { x: 6 * CELL_SIZE, y: 1 * CELL_SIZE }, // top
    { x: 10 * CELL_SIZE, y: 5 * CELL_SIZE }, // right
    { x: 6 * CELL_SIZE, y: 9 * CELL_SIZE }, // bottom
    { x: 2 * CELL_SIZE, y: 5 * CELL_SIZE } // left
  ],
  triangle: [
    { x: 6 * CELL_SIZE, y: 1 * CELL_SIZE }, // top
    { x: 10 * CELL_SIZE, y: 9 * CELL_SIZE }, // bottom-right
    { x: 2 * CELL_SIZE, y: 9 * CELL_SIZE } // bottom-left
  ],
  rectangle: [
    { x: 3 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-left
    { x: 9 * CELL_SIZE, y: 2 * CELL_SIZE }, // top-right
    { x: 9 * CELL_SIZE, y: 8 * CELL_SIZE }, // bottom-right
    { x: 3 * CELL_SIZE, y: 8 * CELL_SIZE } // bottom-left
  ]
};

const styles = {
  app: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' },
  gridContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' },
  gridRow: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
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

function CreateDivideShapes({ setCustomData, customData }) {
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
  const [lines, setLines] = useState(customData?.lines || {});
  const [startPoint, setStartPoint] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [tool, setTool] = useState(null); // 'pencil' or 'eraser'
  const [gridCount, setGridCount] = useState(1);
  const [selectedShape, setSelectedShape] = useState(customData?.shape || "parallelogram");

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
    setLines(customData?.lines || {});
    setSelectedShape(customData?.shape || "parallelogram");
  }, [customData]);

  const saveExercise = async () => {
    const convertedLines = {};
    Object.keys(lines).forEach(gridIndex => {
      convertedLines[gridIndex] = lines[gridIndex].map(line => ({
        cells: [
          Math.round(line.cells[0] / CELL_SIZE),
          Math.round(line.cells[1] / CELL_SIZE),
          Math.round(line.cells[2] / CELL_SIZE),
          Math.round(line.cells[3] / CELL_SIZE)
        ]
      }));
    });

    const customData = { questionPrompt, gridCount, lines: convertedLines, shape: selectedShape };
    setCustomData(customData);
  };

  const snapToGrid = (value) => Math.round(value / CELL_SIZE) * CELL_SIZE;

  const handleMouseDown = (e, gridIndex) => {
    if (tool === 'pencil') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);
      if (!startPoint) {
        setStartPoint({ x: snappedX, y: snappedY });
      } else {
        const newLines = { ...lines };
        if (!newLines[gridIndex]) newLines[gridIndex] = [];
        newLines[gridIndex].push({ cells: [startPoint.x, startPoint.y, snappedX, snappedY] });
        setLines(newLines);
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

  const handleMouseClick = (e, gridIndex) => {
    if (tool === 'eraser') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newLines = lines[gridIndex]?.filter(line => {
        const [x1, y1, x2, y2] = line.cells;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
      }) || [];
      setLines({ ...lines, [gridIndex]: newLines });
    }
  };

  const renderGrid = (gridIndex) => (
    <div style={styles.gridRow} key={gridIndex}>
      <Stage
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onMouseDown={(e) => handleMouseDown(e, gridIndex)}
        onMouseMove={handleMouseMove}
        onClick={(e) => handleMouseClick(e, gridIndex)}
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
          {selectedShape !== 'triangle' && (
            <Line
              points={[
                ...shapes[selectedShape].flatMap(point => [point.x, point.y]),
                shapes[selectedShape][0].x, shapes[selectedShape][0].y
              ]}
              stroke="black"
              strokeWidth={4}
              closed
            />
          )}
          {selectedShape === 'triangle' && (
            <Line
              points={[
                ...shapes[selectedShape].flatMap(point => [point.x, point.y])
              ]}
              stroke="black"
              strokeWidth={4}
              closed
            />
          )}
          {startPoint && previewPoint && (
            <Line
              points={[startPoint.x, startPoint.y, previewPoint.x, previewPoint.y]}
              stroke="blue"
              strokeWidth={4}
              dash={[10, 5]}
            />
          )}
          {(lines[gridIndex] || []).map((line, i) => (
            <Line key={i} points={line.cells} stroke="blue" strokeWidth={4} />
          ))}
        </Layer>
      </Stage>
    </div>
  );

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Select Shape:</label>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {['parallelogram', 'trapezium', 'rhombus', 'triangle', 'rectangle'].map(shape => (
            <label key={shape} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                value={shape}
                checked={selectedShape === shape}
                onChange={() => setSelectedShape(shape)}
              />
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Number of correct answers:</label>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <label key={i} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                value={i + 1}
                checked={gridCount === i + 1}
                onChange={() => setGridCount(i + 1)}
              />
              {i + 1}
            </label>
          ))}
        </div>
      </div>
      <div style={styles.gridContainer}>
        {Array.from({ length: gridCount }).map((_, i) => renderGrid(i))}
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
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: '30px', alignSelf: 'center' }} 
      />
    </div>
  );
}

export default CreateDivideShapes;
