import React, { useState, useEffect } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";
import styles from "../../../styles/captcha/CreateCaptchaCircles.module.css";

function CreateCaptchaCircles({ setCustomData, customData }) {
  const [selectedSquares, setSelectedSquares] = useState(
    customData?.selectedSquares || []
  );
  const [questionPrompt, setQuestionPrompt] = useState(
    customData?.questionPrompt || ""
  );
  const [imageFile, setImageFile] = useState(customData?.imageFile || null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
    setSelectedSquares(customData?.selectedSquares || []);
    setImageFile(customData?.imageFile || null);
  }, [customData]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url); // Clean up the URL object when the component unmounts or imageFile changes
    }
  }, [imageFile]);

  const handleQuestionPromptChange = (event) => {
    setQuestionPrompt(event.target.value);
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSquareClick = (squareId) => {
    setSelectedSquares((prev) => {
      if (prev.includes(squareId)) {
        return prev.filter((id) => id !== squareId); // Deselect the square
      }
      return [...prev, squareId]; // Select the square
    });
  };

  const saveExercise = async () => {
    const newCustomData = {
      questionPrompt: questionPrompt,
      imageFile: imageFile, // Include image file in custom data
      selectedSquares: selectedSquares, // Pass the selected squares
    };
    setCustomData(newCustomData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>Question Prompt:</label>
        <input
          type="text"
          value={questionPrompt}
          onChange={handleQuestionPromptChange}
          placeholder="Enter the question prompt"
          className={styles.input}
        />
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleImageFileChange}
          className={styles.fileInput}
        />
      </div>
      <div style={{ marginBottom: "40px" }}>
        {imageFile && (
          <div className={styles.captchaContainer}>
            <div className={styles.gridContainer}>
              {Array.from({ length: 9 }, (_, i) => {
                const row = Math.floor(i / 3);
                const col = i % 3;
                const backgroundPosition = `-${col * 100}px -${row * 100}px`;

                return (
                  <div
                    key={i}
                    className={`${styles.gridSquare} ${
                      selectedSquares.includes(i) ? styles.selected : ""
                    }`}
                    onClick={() => handleSquareClick(i)}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundPosition,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        className={styles.svgBtnContainer}
      />
    </div>
  );
}

export default CreateCaptchaCircles;
