import React, { useEffect, useState } from "react";
import styles from "../../../styles/numberline/numberline.module.css";
import { useMessage } from "../../../contexts/MessageContext";

const NumberLine = ({ customData }) => {
  const [answers, setAnswers] = useState(customData?.inputValues || []);
  const [userInputs, setUserInputs] = useState({});
  const [allNumbersPlaced, setAllNumbersPlaced] = useState(false); // State to track if all numbers are placed
  const [showMessage, setShowMessage] = useState(false); // State to control display of message
  const [isCorrect, setIsCorrect] = useState(false); // State to track correctness
  const { addDialog, removeDialog } = useMessage();

  const formatNumber = (number) => {
    return number.toString().replace(".", ",");
  };

  const parseFraction = (fraction) => {
    const [numerator, denominator] = fraction.split("/").map(Number);
    return numerator / denominator;
  };

  const handleInputChange = (index, value) => {
    const updatedUserInputs = {
      ...userInputs,
      [index]: value.trim(),
    };
    setUserInputs(updatedUserInputs);

    // Check if all numbers have been placed
    const allPlaced =
      Object.keys(updatedUserInputs).length === answers.length &&
      Object.values(updatedUserInputs).every((input) => input !== "");
    setAllNumbersPlaced(allPlaced);
  };

  const checkAnswers = () => {
    const allCorrect = answers.every((answer, index) => {
      const parsedAnswer = answer.includes("/")
        ? parseFraction(answer)
        : parseFloat(answer);
      const parsedInput = userInputs[index]?.includes("/")
        ? parseFraction(userInputs[index])
        : parseFloat(userInputs[index]);
      return parsedInput === parsedAnswer;
    });

    setIsCorrect(allCorrect);
    setShowMessage(true);
  };

  useEffect(() => {
    setAnswers(customData.inputValues);
  }, [customData]);

  useEffect(() => {
    // Check if all input fields have been filled
    const allPlaced =
      Object.keys(userInputs).length === answers.length &&
      Object.values(userInputs).every((input) => input !== "");
    setAllNumbersPlaced(allPlaced);
  }, [userInputs, answers]);

  return (
    <div className={styles.number_line}>
      <div className={styles.line}>
        {[...Array(21)].map((_, index) => (
          <div
            key={index}
            data-number={index - 10}
            className={styles.mark}
            style={{ left: `${index * 5}%` }}
          ></div>
        ))}
      </div>
      <p className={styles.instructions}>{customData.questionPrompt}</p>
      <div className={styles.numbers_list}>
        {answers.length > 0 &&
          answers.map((number, index) => (
            <span
              key={index}
              className={`${styles.number} ${
                Object.values(userInputs).includes(number)
                  ? styles.activeNumber
                  : ""
              }`}
              draggable="true"
              onDragStart={(e) =>
                e.dataTransfer.setData("text", number.toString())
              }
            >
              {formatNumber(number)}
            </span>
          ))}
      </div>
      {answers.map((answer, index) => {
        const position = answer.includes("/")
          ? parseFraction(answer)
          : parseFloat(answer);
        return (
          <div
            key={index}
            data-number={position}
            className={styles.arrow_and_input}
            style={{ left: `${4 * position + 50}%` }}
          >
            <input
              type="text"
              className={`${styles.input_field} ${
                userInputs[index] ? styles.haveNumber : ""
              }`}
              data-test={userInputs[index]}
              value={userInputs[index] && formatNumber(userInputs[index])}
              placeholder=". . . ."
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData("text");
                handleInputChange(index, data);
              }}
              onDragOver={(e) => e.preventDefault()}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <div className={styles.arrow} />
          </div>
        );
      })}
      <div className={styles.button_and_message}>
        {allNumbersPlaced && (
          <button className={styles.check_button} onClick={checkAnswers}>
            Controleer
          </button>
        )}
        {showMessage && (
          <p className={`${styles.message} ${isCorrect ? styles.correct : styles.incorrect}`}>
            {isCorrect ? "Correct! Goed gedaan!" : "Onjuist. Probeer het opnieuw!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default NumberLine;
