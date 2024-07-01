import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Rect, Transformer } from 'react-konva';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  colorOptions: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20px',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

const CreateCountColorFigures = ({ setCustomData, customData }) => {
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [tool, setTool] = useState('select'); // Default to 'select'

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
  }, [customData]);

  const saveExercise = async () => {
    const customData = { questionPrompt };
    setCustomData(customData);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const addShape = (shapeType) => {
    const newShape = {
      id: `shape-${shapes.length + 1}`,
      type: shapeType,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      rotation: 0,
      fill: '',
    };
    setShapes([...shapes, newShape]);
  };

  const handleSelectShape = (id) => {
    setSelectedShapeId(id === selectedShapeId ? null : id);
  };

  const handleShapeColorFill = () => {
    const updatedShapes = shapes.map(shape =>
      shape.id === selectedShapeId ? { ...shape, fill: selectedColor } : shape
    );
    setShapes(updatedShapes);
  };

  const handleShapeTransform = (id, newAttrs) => {
    const updatedShapes = shapes.map(shape =>
      shape.id === id ? { ...shape, ...newAttrs } : shape
    );
    setShapes(updatedShapes);
  };

  const reset = () => {
    setShapes([]);
    setSelectedShapeId(null);
  };

  return (
    <div style={styles.app}>
      <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Question Prompt:</label>
        <input
          type="text"
          value={questionPrompt}
          onChange={(e) => setQuestionPrompt(e.target.value)}
          placeholder="Enter the question prompt"
          style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={styles.colorOptions}>
        <label style={{ marginBottom: '5px' }}>Select Color:</label>
        <div>
          <button style={{ ...styles.button, backgroundColor: 'red' }} onClick={() => handleColorChange('red')}></button>
          <button style={{ ...styles.button, backgroundColor: 'blue' }} onClick={() => handleColorChange('blue')}></button>
          <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={() => handleColorChange('green')}></button>
          <button style={{ ...styles.button, backgroundColor: 'yellow' }} onClick={() => handleColorChange('yellow')}></button>
          <button style={{ ...styles.button, backgroundColor: 'purple' }} onClick={() => handleColorChange('purple')}></button>
        </div>
      </div>

      <div style={styles.buttonsContainer}>
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={() => addShape('rectangle')}>
          Add Rectangle
        </button>
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={() => addShape('circle')}>
          Add Circle
        </button>
      </div>

      <Stage
        width={window.innerWidth - 100}
        height={400}
        style={{ border: '1px solid #ccc', cursor: tool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer>
          {shapes.map(shape => {
            switch (shape.type) {
              case 'rectangle':
                return (
                  <React.Fragment key={shape.id}>
                    <Rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill}
                      onClick={() => handleSelectShape(shape.id)}
                      onTap={() => handleSelectShape(shape.id)}
                      draggable
                      rotation={shape.rotation}
                      onDragEnd={(e) => handleShapeTransform(shape.id, { x: e.target.x(), y: e.target.y() })}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        handleShapeTransform(shape.id, {
                          x: node.x(),
                          y: node.y(),
                          width: node.width() * node.scaleX(),
                          height: node.height() * node.scaleY(),
                          rotation: node.rotation(),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                    {selectedShapeId === shape.id && (
                      <Transformer
                        anchorSize={5}
                        borderEnabled={false}
                        rotateEnabled={true}
                        rotationSnaps={[0, 90, 180, 270]}
                        rotationSnapTolerance={10}
                        enabledAnchors={['middle-left', 'middle-right']}
                        node={shape}
                        rotationNode={shape}
                        rotateAnchorOffset={50}
                      />
                    )}
                  </React.Fragment>
                );
              case 'circle':
                return (
                  <React.Fragment key={shape.id}>
                    <Circle
                      x={shape.x}
                      y={shape.y}
                      radius={shape.width / 2}
                      fill={shape.fill}
                      onClick={() => handleSelectShape(shape.id)}
                      onTap={() => handleSelectShape(shape.id)}
                      draggable
                      rotation={shape.rotation}
                      onDragEnd={(e) => handleShapeTransform(shape.id, { x: e.target.x(), y: e.target.y() })}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        handleShapeTransform(shape.id, {
                          x: node.x(),
                          y: node.y(),
                          width: node.radius() * 2,
                          rotation: node.rotation(),
                        });
                      }}
                    />
                    {selectedShapeId === shape.id && (
                      <Transformer
                        anchorSize={5}
                        borderEnabled={false}
                        rotateEnabled={true}
                        rotationSnaps={[0, 90, 180, 270]}
                        rotationSnapTolerance={10}
                        enabledAnchors={['middle-left', 'middle-right']}
                        node={shape}
                        rotationNode={shape}
                        rotateAnchorOffset={50}
                      />
                    )}
                  </React.Fragment>
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>

      <div style={styles.buttonsContainer}>
        <button style={{ ...styles.button, backgroundColor: 'blue' }} onClick={handleShapeColorFill}>
          Fill Selected Shape
        </button>
        <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={reset}>
          Reset
        </button>
      </div>

      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default CreateCountColorFigures;
