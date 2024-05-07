import React, { useEffect, useState } from "react";
import CreateTableExercise from "./Graph&Tables/admin/CreateTableExercise";
import CreateGraphToTable from "./Graph&Tables/admin/CreateGraphToTable";
import CreateParabola from "./Graph&Tables/admin/CreateParabola";
import CreateMatchingPair from "./Matching/admin/CreateMatchingPair";
import TableExercise from "./Graph&Tables/client/TableExercise";
import GraphToTable from "./Graph&Tables/client/GraphToTable";
import Parabola from "./Graph&Tables/client/Parabola";
import MatchingGame from "./Matching/client/MatchingGame";
import axios from "axios";
import { useMessage } from "../contexts/MessageContext";

const BijlexHome = () => {
  const [currentSelect, setCurrentSelect] = useState("question_models");
  const [level, setLevel] = useState("");
  const [year, setYear] = useState("");
  const [chapter, setChapter] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [customData, setCustomData] = useState({});

  const [exerciseType, setExerciseType] = useState("");
  const CreateComponents = {
    "table-exercise": CreateTableExercise,
    "graph-to-table": CreateGraphToTable,
    parabola: CreateParabola,
    "matching-pairs": CreateMatchingPair,
  };
  const exerciseComponents = {
    "table-exercise": TableExercise,
    "graph-to-table": GraphToTable,
    parabola: Parabola,
    "matching-pairs": MatchingGame,
  };
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const handleLevelClick = (level) => {
    console.log(level);
    setLevel(level);
    setCurrentSelect("year");
  };
  const handleYearClick = (year) => {
    setYear(year);
    setCurrentSelect("chapter");
  };
  const handleChapterClick = (chapter) => {
    setChapter(chapter);
    setCurrentSelect("paragraph");
  };
  const handleParagraphClick = (paragraph) => {
    setParagraph(paragraph);
    setCurrentSelect("question");
  };
  const handleQuestionClick = (question) => {
    setQuestion(question);
    setCurrentSelect("detail_question");
  };
  const handleQuestionModelClick = (exerciseType) => {
    setCurrentSelect("Specific_model");
    setExerciseType(exerciseType);
  };

  useEffect(() => {
    if (paragraph != "") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://bijlex-backend.onrender.com/exercises/getByALHP",
            {
              params: {
                chapter: chapter,
                year: year,
                level: level,
                paragraph: paragraph,
              },
            }
          );
          if (response.status === 200) {
            const customData =
              typeof response.data.customData === "string"
                ? JSON.parse(response.data.customData)
                : response.data.customData;
            console.log(response.data);
            setQuestions(response.data);
          } else {
            addFullscreenConfirmationDialog("No Data Found", "Ok");
          }
        } catch (error) {
          addFullscreenConfirmationDialog(
            "Something went wrong on the server" + error.response
              ? error.response.data
              : error.message,
            "Ok"
          );
        }
      };
      fetchData();
    }
  }, [paragraph]);
  useEffect(() => {
    if (question != "") {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(
            `https://bijlex-backend.onrender.com/exercises/${question}`
          );
          if (response.status === 200) {
            console.log(response);
            const customData =
              typeof response.data.customData === "string"
                ? JSON.parse(response.data.customData)
                : response.data.customData;
            setExerciseType(response.data.exerciseType);
            setCustomData(customData);
          }
        } catch (error) {
          console.error("Failed to fetch exercises:", error);
        }
      };

      fetchExercises();
    }
  }, [question]);
  const goBackSelect = () => {
    switch (currentSelect) {
      case "chapter":
        setCurrentSelect("year");
        setChapter("");
        break;
      case "paragraph":
        setCurrentSelect("chapter");
        setParagraph("");
        break;
      case "question":
        setCurrentSelect("paragraph");
        setQuestion("");
        break;
      case "preview":
        setCurrentSelect("Specific_model");
        break;
      default:
        setCurrentSelect("level");
        break;
    }
  };
  const CreateComponent =
    CreateComponents[exerciseType] ||
    (() => <div>Unsupported exercise type</div>);
  const ExerciseComponent =
    exerciseComponents[exerciseType] ||
    (() => <div>Unsupported exercise type</div>);
  const previewExercise = (returnedCustomData) => {
    setCustomData(returnedCustomData);
    setCurrentSelect("preview");
  };
  const addExercise = async () => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Creating your exercise",
    });
    formData.append("level", level);
    formData.append("year", year);
    formData.append("chapter", chapter);
    formData.append("paragraph", paragraph);
    formData.append("question", question);
    formData.append("exerciseType", exerciseType);
    formData.append("customData", JSON.stringify(customData));
    console.log(formData);
    try {
      // const response = await axios.post(
      //   "https://bijlex-backend.onrender.com/exercises/",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const response = await axios.post(
        "https://bijlex-backend.onrender.com/exercises/",
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
  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <div className="home">
      <div className="exercise_top_bar">
        {currentSelect != "level" && (
          <span onClick={goBackSelect} className="backBtn">
            &lt;
          </span>
        )}
        {currentSelect == "level" && <span>{currentSelect.toUpperCase()}</span>}
        {currentSelect == "year" && (
          <>
            <span onClick={() => setCurrentSelect("level")}>
              {level + " >"}
            </span>
            <span>{currentSelect}</span>
          </>
        )}
        {currentSelect == "chapter" && (
          <>
            <span onClick={() => setCurrentSelect("level")}>
              {level + " >"}
            </span>

            <span onClick={() => setCurrentSelect("year")}>{year + " >"}</span>
            <span>{currentSelect + "s"}</span>
          </>
        )}
        {currentSelect == "paragraph" && (
          <>
            <span onClick={() => setCurrentSelect("level")}>
              {level + " >"}
            </span>

            <span onClick={() => setCurrentSelect("year")}>{year + " >"}</span>
            <span onClick={() => setCurrentSelect("chapter")}>
              {chapter + " >"}
            </span>
            <span>{currentSelect + "s"}</span>
          </>
        )}
        {currentSelect == "question" && (
          <>
            <span onClick={() => setCurrentSelect("level")}>
              {level + " >"}
            </span>

            <span onClick={() => setCurrentSelect("year")}>{year + " >"}</span>
            <span onClick={() => setCurrentSelect("chapter")}>
              {chapter + " >"}
            </span>
            <span
              onClick={() => {
                setCurrentSelect("paragraph");
                setParagraph("");
              }}
            >
              {paragraph + " >"}
            </span>
            <span>{currentSelect + "s"}</span>
            <button
              onClick={() => setCurrentSelect("question_models")}
              className="addQuestionBtn"
            >
              Add a new question
            </button>
          </>
        )}
        {currentSelect == "preview" && (
          <button onClick={addExercise} className="addQuestionBtn">
            Save Exercise
          </button>
        )}
      </div>
      {currentSelect == "level" && (
        <div className="academic_track_box">
          <button className="selectBtn" onClick={() => handleLevelClick("Vwo")}>
            Vwo onderbouw
          </button>
          <button
            className="selectBtn"
            onClick={() => handleLevelClick("Havo")}
          >
            Havo onderbouw
          </button>
          <button
            className="selectBtn"
            onClick={() => handleLevelClick("Vmbo Kader")}
          >
            Vmbo Kader
          </button>
          <button
            className="selectBtn"
            onClick={() => handleLevelClick("Vmbo Basic")}
          >
            Vmbo Basic
          </button>
          <button
            className="selectBtn"
            onClick={() => handleLevelClick("Vmbo GL tl")}
          >
            Vmbo GL tl
          </button>
        </div>
      )}
      {currentSelect == "year" && (
        <div className="academic_track_box">
          <button className="selectBtn" onClick={() => handleYearClick("1")}>
            Jarr 1
          </button>
          <button className="selectBtn" onClick={() => handleYearClick("2")}>
            Jarr 2
          </button>
          <button className="selectBtn" onClick={() => handleYearClick("3")}>
            Jarr 3
          </button>
        </div>
      )}
      {currentSelect == "chapter" && (
        <div className="academic_track_box">
          <button className="selectBtn" onClick={() => handleChapterClick("1")}>
            1
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("2")}>
            2
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("3")}>
            3
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("4")}>
            4
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("5")}>
            5
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("6")}>
            6
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("7")}>
            7
          </button>
          <button className="selectBtn" onClick={() => handleChapterClick("8")}>
            8
          </button>
        </div>
      )}
      {currentSelect == "paragraph" && (
        <div className="academic_track_box">
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("1")}
          >
            1
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("2")}
          >
            2
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("3")}
          >
            3
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("4")}
          >
            4
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("5")}
          >
            5
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("6")}
          >
            6
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("7")}
          >
            7
          </button>
          <button
            className="selectBtn"
            onClick={() => handleParagraphClick("8")}
          >
            8
          </button>
        </div>
      )}
      {currentSelect == "question" && (
        <div className="question_models_box">
          <div className="question_model_card question_model_card_headings">
            <h2>Order</h2>
            <h2>Name</h2>
            <h2>Exercise Type</h2>
          </div>
          {questions.length > 0 ? (
            questions?.map((quest) => (
              <div className="question_model_card">
                <span>{quest.order}</span>
                <span>{quest.name}</span>
                <span>{quest.exerciseType}</span>
                <button
                  onClick={() => handleQuestionClick(quest._id)}
                  className="question_select_btn"
                >
                  Select
                </button>
              </div>
            ))
          ) : (
            <p>No exercises found.</p>
          )}
        </div>
      )}
      {currentSelect == "question_models" && (
        <div className="question_models_box">
          <div className="question_model_card question_model_card_headings">
            <h2>ID</h2>
            <h2>Name</h2>
            <h2>Exercise Type</h2>
          </div>
          <div className="question_model_card">
            <span>1</span>
            <span>AAA-GEO-001</span>
            <span>Table Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("table-exercise")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>2</span>
            <span>AAA-GEO-001</span>
            <span>Graph to Table Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("graph-to-table")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>3</span>
            <span>AAA-GEO-001</span>
            <span>Parabola Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("parabola")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>4</span>
            <span>AAA-GEO-001</span>
            <span>Matching Pairs Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("matching-pairs")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
        </div>
      )}
      {exerciseType != "" && currentSelect == "Specific_model" && (
        <CreateComponent setCustomData={previewExercise} />
      )}
      {currentSelect == "preview" && (
        <ExerciseComponent customData={customData} preview={true} />
      )}
      {currentSelect == "detail_question" && (
        <ExerciseComponent customData={customData} />
      )}
    </div>
  );
};

export default BijlexHome;
