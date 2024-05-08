import React, { useEffect, useState } from "react";
import styles from "../../../styles/numberline/numberline.module.css";
import { useMessage } from "../../../contexts/MessageContext";

const NumberLine = ({ customData, preview = false }) => {
  const [answers, setAnswers] = useState(customData?.answers || []);
  const [userInputs, setUserInputs] = useState({});
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const formatNumber = (number) => {
    return number.toString().replace(".", ",");
  };

  // Function to handle user input change
  const handleInputChange = (index, value) => {
    setUserInputs({
      ...userInputs,
      [index]: value.trim(), // Trim whitespace
    });
  };
  // Function to check answers
  const checkAnswers = () => {
    const allCorrect = answers.every(
      (answer, index) => parseFloat(userInputs[index]) === answer
    );

    if (allCorrect) {
      setUserInputs({});
      addFullscreenConfirmationDialog("Correct! Goed gedaan!", "Ok");
    } else {
      addFullscreenConfirmationDialog("Onjuist. Probeer het opnieuw!", "Ok");
    }
  };
  useEffect(() => {
    setAnswers(customData.answers);
  }, [customData]);

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
      <p className={styles.instructions}>{customData.prompt}</p>
      <div className={styles.numbers_list}>
        {answers.length > 0 &&
          answers.map((number, index) => (
            // Making numbers draggable
            <span
              key={index}
              className={`${styles.number} ${
                Object.keys(userInputs).some((key) => userInputs[key] == number)
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
      {answers.map((position, index) => (
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
              setUserInputs({ ...userInputs, [index]: data });
            }}
            onDragOver={(e) => e.preventDefault()} // Necessary to allow drop
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <div className={styles.arrow} />
        </div>
      ))}
      {!preview && (
        <button className={styles.check_button} onClick={checkAnswers}>
          Controleer
        </button>
      )}
    </div>
  );
};

export default NumberLine;
