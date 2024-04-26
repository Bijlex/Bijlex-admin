import React, { useState, useEffect } from "react";
import { initialButtons } from "../../../constants/InitialButtons";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext";
import styles from "../../../styles/matching/MatchingPairForm.module.css";

const CreateMatchingPair = () => {
  const [buttons, setButtons] = useState([...initialButtons]);
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  useEffect(() => {
    const loadedButtons = JSON.parse(localStorage.getItem("buttons"));
    if (loadedButtons) {
      setButtons(loadedButtons);
    } else {
      setButtons([...initialButtons]);
    }
  }, []);

  const handleAddButton = () => {
    const newId = buttons.length
      ? Math.max(...buttons.map((b) => b.id)) + 1
      : 1;
    setButtons([
      ...buttons,
      { id: newId, value: "", isSelected: false, isMatched: false },
    ]);
  };

  const handleRemoveButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };

  const handleChangeButton = (id, field, value) => {
    setButtons(
      buttons.map((button) =>
        button.id === id ? { ...button, [field]: value } : button
      )
    );
  };

  const handleSortButtons = () => {
    const sortedButtons = [...buttons].sort((a, b) => {
      // Extract numeric values from the button values, assuming they can be parsed directly or are fractions
      const aValue = a.value.includes("/")
        ? eval(a.value)
        : parseFloat(a.value);
      const bValue = b.value.includes("/")
        ? eval(b.value)
        : parseFloat(b.value);
      return bValue - aValue;
    });
    setButtons(sortedButtons);
  };

  const handleSave = async () => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Creating your exercise",
    });
    formData.append("chapter", "Chapter 2");
    formData.append("difficulty", 1);
    formData.append("prompt", "Please select similar values");
    formData.append("category", "decimal_matching");
    formData.append("exerciseType", "matching-pairs");
    const customStyle = {};
    const customData = {
      buttons,
    };
    console.log(customData);
    formData.append("customData", JSON.stringify(customData));
    formData.append("customStyle", JSON.stringify(customStyle));

    try {
      const response = await axios.post(
        "http://localhost:3500/exercises/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      removeDialog(loadingDialogId);

      if (response.status === 201) {
        addDialog({
          type: "message",
          messageType: "success", // can be 'default', 'success', or 'error'
          message: "Exercise Listed!",
          duration: 3000, // duration in milliseconds
        });
        return true;
      }
    } catch (error) {
      let errMsg = "";
      if (!error.response) {
        console.error("Network error:", error.message);
        errMsg = "Network error. Please try again later.";
      } else {
        errMsg = error.response.data.message;
      }
    }
  };

  const handleGoBack = () => {
    // Go back to the previous page or a specific location
    window.history.back();
  };

  return (
    <div className={styles.edit_page}>
      <div className={styles.edit_grid}>
        {buttons.map((button) => (
          <div key={button.id} className={styles.button_item}>
            <input
              type="text"
              className={styles.input_field}
              value={button.value}
              onChange={(e) =>
                handleChangeButton(button.id, "value", e.target.value)
              }
            />
            <button
              onClick={() => handleRemoveButton(button.id)}
              className={styles.operation_button}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddButton} className={styles.operation_button}>
          Add Button
        </button>
        <button onClick={handleSortButtons} className={styles.operation_button}>
          Sort Pairs
        </button>
        <button onClick={handleSave} className={styles.operation_button}>
          Save Changes
        </button>
        <button onClick={handleGoBack} className={styles.operation_button}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CreateMatchingPair;
