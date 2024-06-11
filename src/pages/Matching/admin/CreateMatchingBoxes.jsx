import React, { useState, useEffect, useRef } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateMatchingBoxes({ setCustomData, customData }) {
  const [questionPrompt, setQuestionPrompt] = useState(
    customData?.questionPrompt || ""
  );
  const [numBoxes, setNumBoxes] = useState(customData?.numBoxes || 2); // Default to 2 boxes
  const [lines, setLines] = useState(customData?.lines || []);
  const [selectedBox, setSelectedBox] = useState(null);
  const [leftInputs, setLeftInputs] = useState(customData?.leftInputs || []);
  const [rightInputs, setRightInputs] = useState(customData?.rightInputs || []);
  const containerRef = useRef(null);

  const handleBoxClick = (boxId) => {
    if (selectedBox !== null) {
      if (boxId !== selectedBox) {
        const newLine = {
          from: selectedBox,
          to: boxId,
        };
        setLines((prevLines) => [...prevLines, newLine]);
      }
      setSelectedBox(null);
    } else {
      setSelectedBox(boxId);
    }
  };

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
    setNumBoxes(customData?.numBoxes || 2);
    setLeftInputs(customData?.leftInputs || []);
    setRightInputs(customData?.rightInputs || []);
    setLines(customData?.lines || []);
  }, [customData]);

  const handleQuestionPromptChange = (event) => {
    setQuestionPrompt(event.target.value);
  };

  const handleInputChange = (event, index, side) => {
    const value = event.target.value;
    if (side === 'left') {
      const newInputs = [...leftInputs];
      newInputs[index] = value;
      setLeftInputs(newInputs);
    } else {
      const newInputs = [...rightInputs];
      newInputs[index] = value;
      setRightInputs(newInputs);
    }
  };

  const saveExercise = async () => {
    const customData = {
      questionPrompt: questionPrompt,
      numBoxes: numBoxes,
      leftInputs: leftInputs,
      rightInputs: rightInputs,
      lines: lines,
    };
    setCustomData(customData);
  };

  const handleNumBoxesChange = (event) => {
    const newNumBoxes = parseInt(event.target.value);
    setNumBoxes(newNumBoxes);
    setLines([]); // Reset lines when the number of boxes changes
    setLeftInputs(new Array(newNumBoxes).fill(''));
    setRightInputs(new Array(newNumBoxes).fill(''));
  };

  return (
    <div ref={containerRef} style={{ textAlign: "center", position: "relative" }}>
      <label style={{ marginTop: "20px" }}>Question Prompt:</label>
        <input
          type="text"
          value={questionPrompt}
          onChange={handleQuestionPromptChange}
          placeholder="Enter the question prompt"
          style={{
            width: "400px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", marginTop: "20px" }}>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <label key={num} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                value={num}
                checked={numBoxes === num}
                onChange={handleNumBoxesChange}
              />
              {num}
            </label>
          ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {leftInputs.map((input, index) => (
            <input
              key={`leftInput${index}`}
              type="text"
              value={input}
              onChange={(event) => handleInputChange(event, index, 'left')}
              placeholder={`Left input ${index + 1}`}
              style={{
                width: "150px",
                padding: "8px",
                margin: "5px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {rightInputs.map((input, index) => (
            <input
              key={`rightInput${index}`}
              type="text"
              value={input}
              onChange={(event) => handleInputChange(event, index, 'right')}
              placeholder={`Right input ${index + 1}`}
              style={{
                width: "150px",
                padding: "8px",
                margin: "5px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {[...Array(numBoxes).keys()].map((num) => (
            <div
              key={`left${num}`}
              id={`left${num}`}
              className="box"
              style={{ border: '1px solid black', padding: '20px', margin: '10px' }}
              onClick={() => handleBoxClick(`left${num}`)}
            >
              {leftInputs[num] || `Box ${num + 1}`}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {[...Array(numBoxes).keys()].map((num) => (
            <div
              key={`right${num}`}
              id={`right${num}`}
              className="box"
              style={{ border: '1px solid black', padding: '20px', margin: '10px' }}
              onClick={() => handleBoxClick(`right${num}`)}
            >
              {rightInputs[num] || `Box ${num + 1}`}
            </div>
          ))}
        </div>
      </div>
      <SVGCanvas lines={lines} containerRef={containerRef} numBoxes={numBoxes} />
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: "30px", alignSelf: "center" }}
      />
    </div>
  );
}

function SVGCanvas({ lines, containerRef, numBoxes }) {
  const [containerOffset, setContainerOffset] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const updateContainerOffset = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerOffset({ left: rect.left + window.scrollX, top: rect.top + window.scrollY });
      }
    };

    updateContainerOffset();
    window.addEventListener('scroll', updateContainerOffset);

    return () => {
      window.removeEventListener('scroll', updateContainerOffset);
    };
  }, [containerRef]);

  const canvasHeight = 500 + numBoxes * 120; // Adjust the multiplier based on the height of each box and margin

  return (
    <>
      <svg
        viewBox={`0 0 1000 ${canvasHeight}`}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: canvasHeight, pointerEvents: "none" }}
      >
        {lines.map((line, idx) => {
          const startBox = document.getElementById(line.from);
          const endBox = document.getElementById(line.to);

          if (!startBox || !endBox) return null; // Exit early if boxes are not found

          const startRect = startBox.getBoundingClientRect();
          const endRect = endBox.getBoundingClientRect();

          const x1 = startRect.left + startRect.width / 2 + window.scrollX - containerOffset.left - 60;
          const y1 = startRect.top + startRect.height / 2 + window.scrollY - containerOffset.top;
          const x2 = endRect.left + endRect.width / 2 + window.scrollX - containerOffset.left - 120;
          const y2 = endRect.top + endRect.height / 2 + window.scrollY - containerOffset.top + 5;

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="green"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </>
  );
}

export default CreateMatchingBoxes;
