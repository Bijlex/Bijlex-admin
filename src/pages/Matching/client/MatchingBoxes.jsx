import React, { useState, useEffect, useRef } from "react";

function MatchingBoxes({ customData, preview }) {
  const { questionPrompt, numBoxes, leftInputs, rightInputs, lines: correctLines } = customData;
  const [userLines, setUserLines] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [result, setResult] = useState(null);
  const [activeBoxes, setActiveBoxes] = useState({});
  const [removeMode, setRemoveMode] = useState(false);
  const containerRef = useRef(null);

  const handleBoxClick = (boxId) => {
    const isLeftBox = boxId.startsWith("left");
    const isRightBox = boxId.startsWith("right");

    if (removeMode) {
      setUserLines((prevLines) => {
        const updatedLines = prevLines.filter((line) => line.from !== boxId && line.to !== boxId);
        updateActiveBoxes(updatedLines);
        return updatedLines;
      });
      setActiveBoxes((prev) => ({ ...prev, [boxId]: false }));
    } else {
      if (selectedBox !== null) {
        const isSelectedLeftBox = selectedBox.startsWith("left");
        const isSelectedRightBox = selectedBox.startsWith("right");

        if ((isLeftBox && isSelectedRightBox) || (isRightBox && isSelectedLeftBox)) {
          const newLine = {
            from: selectedBox,
            to: boxId,
          };
          setUserLines((prevLines) => {
            const updatedLines = [...prevLines, newLine];
            updateActiveBoxes(updatedLines);
            return updatedLines;
          });
          setSelectedBox(null);
          setActiveBoxes((prev) => ({ ...prev, [selectedBox]: true, [boxId]: true }));
        } else {
          setSelectedBox(null);
        }
      } else {
        setSelectedBox(boxId);
        setActiveBoxes((prev) => ({ ...prev, [boxId]: true }));
      }
    }
  };

  const toggleRemoveMode = () => {
    setRemoveMode((prevMode) => !prevMode);
    setSelectedBox(null); // Deselect any selected box when toggling modes
  };

  const checkAnswer = () => {
    const isCorrect = userLines.length === correctLines.length &&
      userLines.every(line => 
        correctLines.some(correctLine => 
          (correctLine.from === line.from && correctLine.to === line.to) ||
          (correctLine.from === line.to && correctLine.to === line.from)
        )
      );
    setResult(isCorrect ? "Correct" : "Incorrect");
  };

  const updateActiveBoxes = (lines) => {
    const activeBoxes = {};
    lines.forEach(line => {
      activeBoxes[line.from] = true;
      activeBoxes[line.to] = true;
    });
    setActiveBoxes(activeBoxes);
  };

  return (
    <div ref={containerRef} style={{ textAlign: "center", position: "relative" }}>
      <h2>{questionPrompt}</h2>
      <SVGCanvas lines={userLines} containerRef={containerRef} numBoxes={numBoxes} />
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {leftInputs.map((input, index) => (
            <div
              key={`left${index}`}
              id={`left${index}`}
              className="box"
              style={{
                border: '1px solid black',
                padding: '20px',
                margin: '10px',
                position: 'relative',
                boxShadow: activeBoxes[`left${index}`] 
                  ? removeMode 
                    ? '0 4px 8px rgba(255, 0, 0, 0.6)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.3)' 
                  : 'none',
                transform: activeBoxes[`left${index}`] ? 'translateY(-2px)' : 'none',
                zIndex: activeBoxes[`left${index}`] ? 2 : 1,
                transition: 'box-shadow 0.3s, transform 0.3s'
              }}
              onClick={() => handleBoxClick(`left${index}`)}
            >
              {input}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {rightInputs.map((input, index) => (
            <div
              key={`right${index}`}
              id={`right${index}`}
              className="box"
              style={{
                border: '1px solid black',
                padding: '20px',
                margin: '10px',
                position: 'relative',
                boxShadow: activeBoxes[`right${index}`] 
                  ? removeMode 
                    ? '0 4px 8px rgba(255, 0, 0, 0.6)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.3)' 
                  : 'none',
                transform: activeBoxes[`right${index}`] ? 'translateY(-2px)' : 'none',
                zIndex: activeBoxes[`right${index}`] ? 2 : 1,
                transition: 'box-shadow 0.3s, transform 0.3s'
              }}
              onClick={() => handleBoxClick(`right${index}`)}
            >
              {input}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <button
          onClick={toggleRemoveMode}
          style={{
            backgroundColor: removeMode ? "red" : "green",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {removeMode ? "Match Boxes" : "Remove Lines"}
        </button>
        <button
          onClick={checkAnswer}
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Check Answer
        </button>
      </div>
      {result && <p style={{ color: "black", fontSize: "18px", marginTop: "20px" }}>{result}</p>}
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
    <svg
      viewBox={`0 0 1000 ${canvasHeight}`}
      style={{ position: "absolute", top: 0, left: "-85px", width: "100%", height: canvasHeight, zIndex: 0, pointerEvents: "none" }}
    >
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

        // Ensure that lines from left to right and right to left look the same
        const [finalX1, finalX2] = x1 < x2 ? [x1, x2] : [x2, x1];
        const [finalY1, finalY2] = x1 < x2 ? [y1, y2] : [y2, y1];

        return (
          <line
            key={idx}
            x1={finalX1}
            y1={finalY1}
            x2={finalX2}
            y2={finalY2}
            stroke="green"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </svg>
  );
}

export default MatchingBoxes;
