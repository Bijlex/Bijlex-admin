import React, { useState } from "react";
import SvgBtn from "./buttons/SvgBtn";
import styles from "../../styles/ExerciseCard.module.css";
import { documentIcon, exportDownloadIcon } from "../../constants/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { capitalizeWords } from "../../utlis/general";
import { useMessage } from "../../contexts/MessageContext";
import ExportPanel from "../exportPanel";
const ExerciseCard = ({ exercise }) => {
  const emptyFun = () => {
    return true;
  };
  let navigate = useNavigate();
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const [jsonExport, setJsonExport] = useState(false);
  const exportDocument = () => {
    console.log(exercise.customData);
    setJsonExport(true);
  };
  // Utility to safely parse JSON if needed
  const parseJsonIfNeeded = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("Failed to parse JSON", error);
      return {}; // Return an empty object or handle the error as needed
    }
  };
  return (
    <div className={styles.exercise_card}>
      {jsonExport && (
        <ExportPanel
          json={parseJsonIfNeeded(exercise.customData)}
          closeDialog={() => setJsonExport(false)}
          exerciseName={exercise.name}
        />
      )}
      <div className={styles.card_info}>
        <h2 className={styles.exercise_name}>{exercise.name}</h2>
        <p className={styles.exercise_chapter}>{exercise.chapter}</p>
        <p className={styles.exercise_type}>
          {capitalizeWords(exercise.exerciseType)}
        </p>
        <p className={styles.exercise_type}>
          Difficulty level: {exercise.difficulty}
        </p>
      </div>
      <div className={styles.exercise_btns}>
        {/* <SvgBtn
          handleClick={emptyFun}
          SvgIcon={documentIcon}
          text={"Edit Exercise"}
          customStyles={{ backgroundColor: "green" }}
        />
        <SvgBtn
          handleClick={emptyFun}
          SvgIcon={documentIcon}
          text={"Delete Exercise"}
          customStyles={{ backgroundColor: "red" }}
        /> */}
        <SvgBtn
          handleClick={exportDocument}
          SvgIcon={exportDownloadIcon}
          text={"Export Exercise"}
        />
        <SvgBtn
          handleClick={() => navigate(`/${exercise._id}`)}
          SvgIcon={documentIcon}
          text={"Test Exercise"}
        />
      </div>
    </div>
  );
};

export default ExerciseCard;
