import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableExercise from "./Graph&Tables/client/TableExercise";
import styles from "../styles/ExercisePage.module.css";
import GraphToTable from "./Graph&Tables/client/GraphToTable";
import Parabola from "./Graph&Tables/client/Parabola";
import MatchingGame from "./Matching/client/MatchingGame";
import FractionBuckets from "./Fractions/client/FractionBuckets";

const ExercisePage = () => {
  const [fetchData, setFetchData] = useState([]);
  const { id: exerciseID } = useParams();

  // Map of exercise types to components
  const exerciseComponents = {
    "table-exercise": TableExercise,
    "graph-to-table": GraphToTable,
    parabola: Parabola,
    "matching-pairs": MatchingGame,
    "fraction-buckets": FractionBuckets,
  };

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
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseID]);

  useEffect(() => {
    console.log(fetchData);
  }, [fetchData]);

  const ExerciseComponent =
    exerciseComponents[fetchData.exerciseType] ||
    (() => <div>Unsupported exercise type</div>);
  if (fetchData.length < 1)
    return <h2 className={styles.loading_text}>Loading..</h2>;
  return (
    <div className={styles.exercise_page}>
      <div className={styles.question_area}>
        <h2>{fetchData.prompt}</h2>
      </div>
      <div className={styles.exercise_area}>
        <ExerciseComponent customData={fetchData.customData} />
      </div>
    </div>
  );
};

export default ExercisePage;
