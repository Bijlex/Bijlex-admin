import React, { useState, useEffect } from "react";
// import "./ButtonGrid.css";
import styles from "../../styles/matching/ButtonGrid.module.css";
const ButtonGrid = ({ values }) => {
  const [buttons, setButtons] = useState(values);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [flashRed, setFlashRed] = useState(null);

  useEffect(() => {
    // Load buttons from local storage or use initial buttons
    const savedButtons = values;
    setButtons(savedButtons.sort(() => Math.random() - 0.5)); // Randomize the loaded button array
  }, []);

  // Helper function to evaluate values with tolerance for rounding errors
  const valuesAreClose = (value1, value2) => {
    const tolerance = 0.001; // Define your tolerance level
    return Math.abs(evaluateValue(value1) - evaluateValue(value2)) < tolerance;
  };

  const evaluateValue = (value) => {
    if (value.includes("/")) {
      const [numerator, denominator] = value.split("/");
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(value);
  };

  const handleButtonClick = (id) => {
    const updatedButtons = buttons.map((button) => {
      if (button.id === id) {
        return { ...button, isSelected: !button.isSelected }; // Toggle isSelected
      }
      return button;
    });

    setButtons(updatedButtons);
    const newSelectedButtons = updatedButtons.filter(
      (button) => button.isSelected
    );
    setSelectedButtons(newSelectedButtons);

    if (newSelectedButtons.length === 2) {
      const [first, second] = newSelectedButtons;
      if (valuesAreClose(first.value, second.value)) {
        const matchedUpdate = updatedButtons.map((button) => {
          if (button.id === first.id || button.id === second.id) {
            return { ...button, isMatched: true, isSelected: false }; // Match found, update isMatched
          }
          return button;
        });
        setButtons(matchedUpdate);
        setSelectedButtons([]);
        if (matchedUpdate.every((button) => button.isMatched)) {
          alert("All Pairs are Matched, Congrats!");
        }
      } else {
        setFlashRed(newSelectedButtons.map((button) => button.id));
        setTimeout(() => {
          setButtons(
            buttons.map((button) => ({ ...button, isSelected: false }))
          ); // Clear selection
          setFlashRed(null);
          setSelectedButtons([]);
        }, 1000);
      }
    }
  };
  useEffect(() => {
    setButtons(values.sort(() => Math.random() - 0.5));
  }, [values]);

  return (
    <div className={styles.button_grid}>
      {buttons.map((button) => (
        <button
          key={button.id}
          className={`${styles.grid_button} ${
            button.isSelected ? styles.selected : ""
          } ${button.isMatched ? styles.matched : ""} ${
            flashRed?.includes(button.id) ? styles.flash_red : ""
          }`}
          onClick={() => handleButtonClick(button.id)}
        >
          {button.value}
        </button>
      ))}
    </div>
  );
};

export default ButtonGrid;
