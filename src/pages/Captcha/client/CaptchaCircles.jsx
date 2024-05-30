import React, { useState, useEffect } from "react";
import styles from "../../../styles/captcha/CaptchaCircles.module.css";

const CaptchaCircles = ({ customData }) => {
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState(null);
  const questionPrompt = customData?.questionPrompt || "No prompt provided";
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (customData?.imageFile) {
      const url = URL.createObjectURL(customData.imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url); // Clean up the URL object when the component unmounts or imageFile changes
    }
  }, [customData?.imageFile]);

  const handleSquareClick = (squareId) => {
    setSelectedSquares((prev) => {
      if (prev.includes(squareId)) {
        return prev.filter((id) => id !== squareId); // Deselect the square
      }
      return [...prev, squareId]; // Select the square
    });
  };

  const checkAnswers = () => {
    const correctSquares = customData.selectedSquares;
    const isCorrect =
      JSON.stringify(selectedSquares.sort()) ===
      JSON.stringify(correctSquares.sort());
    setMessage(isCorrect ? "Correct!" : "Incorrect!");
    if (!isCorrect) {
      setAttempts(attempts + 1);
    }
  };

  const reset = () => {
    setSelectedSquares([]);
    setMessage(null);
  };

  return (
    <div className={styles.captchaContainer}>
      <h2>{questionPrompt}</h2>
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
      <button className={styles.button} onClick={checkAnswers}>
        Check Answer
      </button>
      <div className={styles.messageContainer}>
        {message && (
          <div
            className={`${styles.message} ${
              message === "Correct!" ? styles.correct : styles.incorrect
            }`}
          >
            {message}
          </div>
        )}
      </div>
      {message === "Incorrect!" && attempts < 2 && (
        <button className={styles.button} onClick={reset}>
          Retry
        </button>
      )}
      {attempts >= 2 && <button className={styles.button}>Continue</button>}
    </div>
  );
};

export default CaptchaCircles;
