import React from "react";
import styles from "../../../styles/buttons.module.css";
const StandardBtn = ({ handleClick, text, isDisabled = false }) => {
  return (
    <button
      className={(styles.addButton, styles.primary_btn)}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default StandardBtn;
