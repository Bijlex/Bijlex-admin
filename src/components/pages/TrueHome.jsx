import React, { useEffect, useState } from "react";
import axios from "axios";
import ExerciseCard from "../general/ExerciseCard";
import SvgBtn from "../general/buttons/SvgBtn";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addIcon } from "../../constants/icons";
const TrueHome = () => {
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 5;
  let navigate = useNavigate();
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("http://localhost:3500/exercises/");
        console.log(response.data);
        if (response.status === 200) {
          setExercises(response.data); // Assume the entire dataset is fetched at once
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, []); // Fetch exercises once on component mount

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

  return (
    <div className="home">
      {/* <SvgBtn
        handleClick={() => navigate("/table-exercise/create")}
        text="Add new exercise"
        SvgIcon={addIcon}
      /> */}
      <div className="exercise_list">
        {currentExercises.length > 0 ? (
          currentExercises?.map((exercise) => (
            <ExerciseCard key={exercise._id} exercise={exercise} />
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
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
  );
};

export default TrueHome;
