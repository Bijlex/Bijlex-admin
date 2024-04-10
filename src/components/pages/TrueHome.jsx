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
        const response = await axios.get(
          "https://bijlex-backend.onrender.com/exercises/type/table-exercise"
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
      <div className="exercise_type_tabs_box">
        <button className="exercise_type_tabs">Table Exercise</button>
      </div>
      <div className="exercise_list">
        <SvgBtn
          handleClick={() => navigate("/table-exercise/create")}
          text="Add new exercise"
          SvgIcon={addIcon}
          customStyles={{
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
