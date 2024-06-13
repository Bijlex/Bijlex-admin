import React, { useState, useEffect } from "react";
import styles from "../../../styles/captcha/CaptchaCircles.module.css";

const CaptchaImages = ({ customData }) => {
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [message, setMessage] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const questionPrompt = customData?.questionPrompt || "No prompt provided";
  const images = customData?.images || [];

  const handleSquareClick = (squareId) => {
    setSelectedSquares((prev) => {
      if (prev.includes(squareId)) {
        return prev.filter((id) => id !== squareId);
      }
      return [...prev, squareId];
    });
  };

  const checkAnswers = () => {
    const correctSquares = customData.selectedSquares;
    const isCorrect = JSON.stringify(selectedSquares.sort()) === JSON.stringify(correctSquares.sort());
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
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className={`${styles.gridSquare} ${selectedSquares.includes(i) ? styles.selected : ""}`}
            onClick={() => handleSquareClick(i)}
            style={{
              backgroundImage: `url(${images[i]})`,
              backgroundSize: "cover",
            }}
          />
        ))}
      </div>
      <button className={styles.button} onClick={checkAnswers}>
        Check Answer
      </button>
      <div className={styles.messageContainer}>
        {message && (
          <div className={`${styles.message} ${message === "Correct!" ? styles.correct : styles.incorrect}`}>
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

export default CaptchaImages;
