import React, { useState, useEffect } from "react";
// import "./MatchingPairForm.css";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext";

const EditMatchingPair = () => {
  const [buttons, setButtons] = useState();
  const [fetchData, setFetchData] = useState([]);
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const { id: exerciseID } = useParams();
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `https://bijlex-backend.onrender.com/exercises/${exerciseID}`
        );
        if (response.status === 200) {
          console.log(response);
          const customData =
            typeof response.data.customData === "string"
              ? JSON.parse(response.data.customData)
              : response.data.customData;
          setFetchData({ ...response.data, customData: customData });
          setButtons(customData.buttons);
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseID]);

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
      message: "Updating your exercise",
    });

    formData.append("id", exerciseID);
    const customData = {
      buttons,
    };
    console.log(customData);
    formData.append("customData", JSON.stringify(customData));

    try {
      const response = await axios.patch(
        "https://bijlex-backend.onrender.com/exercises/" + exerciseID,
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
          message: "Exercise Updated!",
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
    <div className="edit-page">
      <div className="edit-grid">
        {buttons.map((button) => (
          <div key={button.id} className="button-item">
            <input
              type="text"
              className="input-field"
              value={button.value}
              onChange={(e) =>
                handleChangeButton(button.id, "value", e.target.value)
              }
            />
            <button
              onClick={() => handleRemoveButton(button.id)}
              className="operation-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddButton} className="operation-button">
          Add Button
        </button>
        <button onClick={handleSortButtons} className="operation-button">
          Sort Pairs
        </button>
        <button onClick={handleSave} className="operation-button">
          Save Changes
        </button>
        <button onClick={handleGoBack} className="operation-button">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EditMatchingPair;
