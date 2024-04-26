import React, { useEffect, useState } from "react";
import styles from "../../../styles/matching/MatchingGame.module.css";
import ButtonGrid from "../ButtonGrid";
import { useNavigate } from "react-router-dom";

function MatchingGame({ customData }) {
  const [buttons, setButtons] = useState([]);
  let navigate = useNavigate();
  // Function to handle the Go Back button action
  const handleGoBack = () => {
    // Go back to the previous page or a specific location
    navigate("/");
  };
  const handleReset = () => {
    setButtons(customData?.buttons.map((button) => ({ ...button })));
  };
  useEffect(() => {
    setButtons(customData?.buttons.map((button) => ({ ...button })));
  }, [customData]);

  return (
    <div className={styles.matching_game}>
      <ButtonGrid values={buttons} />
      <div className={styles.game_controls}>
        <button className={styles.button} onClick={handleGoBack}>
          Go Back
        </button>
        <div className={styles.space}></div>
        <button className={styles.button} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default MatchingGame;
