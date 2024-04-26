import React from "react";
import SvgBtn from "./buttons/SvgBtn";
import styles from "../../styles/ExerciseCard.module.css";
import { documentIcon } from "../../constants/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { capitalizeWords } from "../../utlis/general";
const ExerciseCard = ({ exercise }) => {
  const emptyFun = () => {
    return true;
  };
  let navigate = useNavigate();
  return (
    <div className={styles.exercise_card}>
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
          handleClick={() => navigate(`/${exercise._id}`)}
          SvgIcon={documentIcon}
          text={"Test Exercise"}
        />
      </div>
    </div>
  );
};

export default ExerciseCard;
