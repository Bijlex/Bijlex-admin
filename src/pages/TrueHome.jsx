import React, { useEffect, useState } from "react";
import axios from "axios";
import ExerciseCard from "../components/general/ExerciseCard";
import SvgBtn from "../components/general/buttons/SvgBtn";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addIcon } from "../constants/icons";
import { capitalizeWords } from "../utlis/general";
const TrueHome = () => {
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exerciseType, setExerciseType] = useState("table-exercise");
  const exercisesPerPage = 5;
  let navigate = useNavigate();
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "https://bijlex-backend.onrender.com/exercises/type/" + exerciseType
        );
        console.log(response.data);
        if (response.status === 200) {
          setExercises(response.data); // Assume the entire dataset is fetched at once
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseType]); // Fetch exercises once on component mount

  // Get current exercises
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(exercises?.length / exercisesPerPage);
  const emptyFunc = () => {
    return null;
  };
  return (
    <div className="home">
      <div className="exercise_type_tabs_box">
        <h2 className="exercise_tab_header">Choose Exercise</h2>
        <div className="tab_container">
          <button
            onClick={() => setExerciseType("table-exercise")}
            className={
              "exercise_type_tabs" +
              " " +
              `${exerciseType == "table-exercise" && "active_exercise_tab"}`
            }
          >
            Table Exercise
          </button>
          <button
            className={
              "exercise_type_tabs" +
              " " +
              `${exerciseType == "graph-to-table" && "active_exercise_tab"}`
            }
            onClick={() => setExerciseType("graph-to-table")}
          >
            Graph to Table Exercise
          </button>
          <button
            className={
              "exercise_type_tabs" +
              " " +
              `${exerciseType == "parabola" && "active_exercise_tab"}`
            }
            onClick={() => setExerciseType("parabola")}
          >
            Parabola Exercise
          </button>
          <button
            className={
              "exercise_type_tabs" +
              " " +
              `${exerciseType == "matching-pairs" && "active_exercise_tab"}`
            }
            onClick={() => setExerciseType("matching-pairs")}
          >
            Matching Pairs Exercise
          </button>
          {/* <button className="exercise_type_tabs">
            Table to Graph Exercise
          </button> */}
        </div>
      </div>
      <div className="exercise_list">
        <SvgBtn
          handleClick={() => navigate(`/${exerciseType}/create`)}
          text={`Add new ${capitalizeWords(exerciseType)} exercise`}
          SvgIcon={addIcon}
          customStyles={{
            width: "20vw",
            marginLeft: "auto",
            marginBottom: "2vh",
            backgroundColor: "green",
          }}
        />
        {currentExercises.length > 0 ? (
          currentExercises?.map((exercise) => (
            <ExerciseCard key={exercise._id} exercise={exercise} />
          ))
        ) : (
          <p>No exercises found.</p>
        )}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              style={{ margin: "0 5px" }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrueHome;
