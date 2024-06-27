import React, { useState } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";

function MatchingBoxes({ customData, preview = false }) {
  const { questionPrompt, numBoxes, leftInputs, rightInputs, lines: correctLines } = customData;
  const [userLines, setUserLines] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [result, setResult] = useState(null);
  const [removeMode, setRemoveMode] = useState(false);

  const handleBoxClick = (boxId) => {
    const isLeftBox = boxId.startsWith("left");
    const isRightBox = boxId.startsWith("right");

    if (removeMode) {
      setUserLines((prevLines) => {
        const updatedLines = prevLines.filter((line) => line.from !== boxId && line.to !== boxId);
        return updatedLines;
      });
    } else {
      if (selectedBox !== null) {
        const isSelectedLeftBox = selectedBox.startsWith("left");
        const isSelectedRightBox = selectedBox.startsWith("right");

        if ((isLeftBox && isSelectedRightBox) || (isRightBox && isSelectedLeftBox)) {
          const newLine = {
            from: selectedBox,
            to: boxId,
          };
          setUserLines((prevLines) => [...prevLines, newLine]);
          setSelectedBox(null);
        } else {
          setSelectedBox(null);
        }
      } else {
        setSelectedBox(boxId);
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

  return (
    <ArcherContainer strokeColor="red">
      <div style={{ textAlign: "center", position: "relative" }}>
        <h2>{questionPrompt}</h2>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {leftInputs.map((input, index) => (
              <ArcherElement
                key={`left${index}`}
                id={`left${index}`}
                relations={userLines.filter(line => line.from === `left${index}`).map(line => ({
                  targetId: line.to,
                  targetAnchor: 'left',
                  sourceAnchor: 'right'
                }))}
              >
                <div
                  id={`left${index}`}
                  className="box"
                  style={{
                    border: '1px solid black',
                    padding: '20px',
                    margin: '10px',
                    position: 'relative',
                    boxShadow: selectedBox === `left${index}` ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
                    transform: selectedBox === `left${index}` ? 'translateY(-2px)' : 'none',
                    zIndex: selectedBox === `left${index}` ? 2 : 1,
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    cursor: "pointer"
                  }}
                  onClick={() => handleBoxClick(`left${index}`)}
                >
                  {input}
                </div>
              </ArcherElement>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {rightInputs.map((input, index) => (
              <ArcherElement
                key={`right${index}`}
                id={`right${index}`}
                relations={userLines.filter(line => line.from === `right${index}`).map(line => ({
                  targetId: line.to,
                  targetAnchor: 'right',
                  sourceAnchor: 'left'
                }))}
              >
                <div
                  id={`right${index}`}
                  className="box"
                  style={{
                    border: '1px solid black',
                    padding: '20px',
                    margin: '10px',
                    position: 'relative',
                    boxShadow: selectedBox === `right${index}` ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
                    transform: selectedBox === `right${index}` ? 'translateY(-2px)' : 'none',
                    zIndex: selectedBox === `right${index}` ? 2 : 1,
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    cursor: "pointer"
                  }}
                  onClick={() => handleBoxClick(`right${index}`)}
                >
                  {input}
                </div>
              </ArcherElement>
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
    </ArcherContainer>
  );
}

export default MatchingBoxes;
