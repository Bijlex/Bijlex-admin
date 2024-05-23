import React from "react";
import styles from "../../../styles/buttons.module.css";
const StandardBtn_extra_small = ({ handleClick, text, isDisabled = false }) => {
  return (
    <button
      className={
        (styles.addButton, styles.primary_btn, styles.primary_btn_extra_small)
      }
      onClick={handleClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default StandardBtn_extra_small;
