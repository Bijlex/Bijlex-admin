import React, { useState, useEffect, useRef } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateMatchingImages({ setCustomData, customData }) {
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
  const [leftNumBoxes, setLeftNumBoxes] = useState(customData?.leftNumBoxes || 2);
  const [rightNumBoxes, setRightNumBoxes] = useState(customData?.rightNumBoxes || 2);
  const [lines, setLines] = useState(customData?.lines || []);
  const [selectedBox, setSelectedBox] = useState(null);
  const [leftInputs, setLeftInputs] = useState(customData?.leftInputs || []);
  const [rightInputs, setRightInputs] = useState(customData?.rightInputs || []);
  const containerRef = useRef(null);

  // Function to handle box click and connect lines
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

  // Reset state when customData changes
  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
    setLeftNumBoxes(customData?.leftNumBoxes || 2);
    setRightNumBoxes(customData?.rightNumBoxes || 2);
    setLeftInputs(customData?.leftInputs || []);
    setRightInputs(customData?.rightInputs || []);
    setLines(customData?.lines || []);
  }, [customData]);

  // Handle change in question prompt input
  const handleQuestionPromptChange = (event) => {
    setQuestionPrompt(event.target.value);
  };

  // Handle text input change in boxes
  const handleInputChange = (event, index, side) => {
    const value = event.target.value;
    const newInputs = side === "left" ? [...leftInputs] : [...rightInputs];
    newInputs[index] = { ...newInputs[index], text: value };
    side === "left" ? setLeftInputs(newInputs) : setRightInputs(newInputs);
  };

  // Handle image upload change in boxes
  const handleImageUpload = (event, index, side) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newInputs = side === "left" ? [...leftInputs] : [...rightInputs];
        newInputs[index] = { ...newInputs[index], image: reader.result };
        side === "left" ? setLeftInputs(newInputs) : setRightInputs(newInputs);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the exercise data
  const saveExercise = async () => {
    const exerciseData = {
      questionPrompt,
      leftNumBoxes,
      rightNumBoxes,
      leftInputs,
      rightInputs,
      lines,
    };
    setCustomData(exerciseData);
  };

  // Handle change in number of boxes on the left side
  const handleLeftNumBoxesChange = (event) => {
    const newNumBoxes = parseInt(event.target.value);
    setLeftNumBoxes(newNumBoxes);
    setLines([]); // Reset lines when the number of boxes changes
    setLeftInputs(new Array(newNumBoxes).fill({ text: "", image: "" }));
  };

  // Handle change in number of boxes on the right side
  const handleRightNumBoxesChange = (event) => {
    const newNumBoxes = parseInt(event.target.value);
    setRightNumBoxes(newNumBoxes);
    setLines([]); // Reset lines when the number of boxes changes
    setRightInputs(new Array(newNumBoxes).fill({ text: "", image: "" }));
  };

  return (
    <div ref={containerRef} style={{ textAlign: "center", position: "relative" }}>
      {/* Question prompt input */}
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

      {/* Number of boxes selection for left and right sides */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", marginTop: "20px" }}>
        <div>
          <label>Left Side:</label>
          <div>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <label key={num} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  value={num}
                  checked={leftNumBoxes === num}
                  onChange={handleLeftNumBoxesChange}
                />
                {num}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>Right Side:</label>
          <div>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <label key={num} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  value={num}
                  checked={rightNumBoxes === num}
                  onChange={handleRightNumBoxesChange}
                />
                {num}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Display boxes for left and right sides */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Left side boxes */}
          {leftInputs.map((input, index) => (
            <div key={`leftInput${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div
                key={`left${index}`}
                id={`left${index}`}
                className="box"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid black",
                  padding: "20px",
                  margin: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
                onClick={() => handleBoxClick(`left${index}`)}
              >
                {leftInputs[index]?.image ? (
                  <img
                    src={leftInputs[index].image}
                    alt={`Box ${index + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                  />
                ) : (
                  leftInputs[index]?.text || `Box ${index + 1}`
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, index, "left")}
                style={{ marginLeft: "10px" }}
              />
              <input
                type="text"
                value={leftInputs[index]?.text || ""}
                onChange={(event) => handleInputChange(event, index, "left")}
                placeholder={`Box ${index + 1}`}
                style={{ marginLeft: "10px", width: "100px" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Right side boxes */}
          {rightInputs.map((input, index) => (
            <div key={`rightInput${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div
                key={`right${index}`}
                id={`right${index}`}
                className="box"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid black",
                  padding: "20px",
                  margin: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
                onClick={() => handleBoxClick(`right${index}`)}
              >
                {rightInputs[index]?.image ? (
                  <img
                    src={rightInputs[index].image}
                    alt={`Box ${index + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                  />
                ) : (
                  rightInputs[index]?.text || `Box ${index + 1}`
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, index, "right")}
                style={{ marginLeft: "10px" }}
              />
              <input
                type="text"
                value={rightInputs[index]?.text || ""}
                onChange={(event) => handleInputChange(event, index, "right")}
                placeholder={`Box ${index + 
                    1}`}
                    style={{ marginLeft: "10px", width: "100px" }}
                  />
                </div>
              ))}
            </div>
          </div>
    
          {/* SVG Canvas for drawing lines */}
          <SVGCanvas lines={lines} containerRef={containerRef} leftNumBoxes={leftNumBoxes} rightNumBoxes={rightNumBoxes} />
    
          {/* Save button */}
          <SvgBtn
            handleClick={saveExercise}
            SvgIcon={documentIcon}
            text={"Make Exercise"}
            style={{ marginBottom: "30px", alignSelf: "center" }}
          />
        </div>
      );
    }
    
    function SVGCanvas({ lines, containerRef, leftNumBoxes, rightNumBoxes }) {
      const [containerOffset, setContainerOffset] = useState({ left: 0, top: 0 });
    
      // Update container offset on scroll
      useEffect(() => {
        const updateContainerOffset = () => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerOffset({ left: rect.left + window.scrollX, top: rect.top + window.scrollY });
          }
        };
    
        updateContainerOffset();
        window.addEventListener("scroll", updateContainerOffset);
    
        return () => {
          window.removeEventListener("scroll", updateContainerOffset);
        };
      }, [containerRef]);
    
      // Calculate canvas height based on the number of boxes
      const canvasHeight = Math.max(leftNumBoxes, rightNumBoxes) * 140; // Adjust the multiplier based on the height of each box and margin
    
      return (
        <svg
          viewBox={`0 0 1000 ${canvasHeight}`}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: canvasHeight, pointerEvents: "none" }}
        >
          {/* Draw lines between connected boxes */}
          {lines.map((line, idx) => {
            const startBox = document.getElementById(line.from);
            const endBox = document.getElementById(line.to);
    
            if (!startBox || !endBox) return null; // Exit early if boxes are not found
    
            const startRect = startBox.getBoundingClientRect();
            const endRect = endBox.getBoundingClientRect();
    
            const x1 = startRect.left + startRect.width / 2 + window.scrollX - containerOffset.left;
            const y1 = startRect.top + startRect.height / 2 + window.scrollY - containerOffset.top;
            const x2 = endRect.left + endRect.width / 2 + window.scrollX - containerOffset.left;
            const y2 = endRect.top + endRect.height / 2 + window.scrollY - containerOffset.top;
    
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
      );
    }
    
    export default CreateMatchingImages;
    