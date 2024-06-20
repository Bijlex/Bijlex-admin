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
import CreateFractionBuckets from "./Fractions/admin/CreateFractionBuckets";
import FractionBuckets from "./Fractions/client/FractionBuckets";
import CreateNumberLine from "./Numberline/admin/CreateNumberLine";
import NumberLine from "./Numberline/client/NumberLine";
import { exportDownloadIcon } from "../constants/icons";
import SvgBtn from "../components/general/buttons/SvgBtn";
import ExportPanel from "../components/exportPanel";
import CreateKnapsackExercise from "./Arithmetic/admin/CreateKnapsackExercise";
import KnapsackExercise from "./Arithmetic/client/KnapsackExercise";
import CreateCompassExercise from "./Degrees/admin/CreateCompassExercise";
import CompassExercise from "./Degrees/client/CompassExercise";
import CreateParallelogramExercise from "./Parallelism/admin/CreateParallelogramExercise";
import ParallelogramExercise from "./Parallelism/client/ParallelogramExercise";
import CreateStarExercise from "./Parallelism/admin/CreateStarExercise";
import StarExercise from "./Parallelism/client/StarExercise";
import CreateCubeExercise from "./Parallelism/admin/CreateCubeExercise";
import CubeExercise from "./Parallelism/client/CubeExercise";
import CreateSquaresToDice from "./Cube/admin/CreateSquaresToDice";
import SquaresToDice from "./Cube/client/SquaresToDice";
import CreateCircleToOval from "./Draggable-Figures/admin/CreateCircleToOval";
import CircleToOval from "./Draggable-Figures/client/CircleToOval";
import CreateDiagonalsSquare from "./Diagonals/admin/CreateDiagonalsSquare";
import DiagonalsSquare from "./Diagonals/client/DiagonalsSquare";
import CreateDiagonalsRectangle from "./Diagonals/admin/CreateDiagonalsRectangle";
import DiagonalsRectangle from "./Diagonals/client/DiagonalsRectangle";
import CreateSquareToParallelogram from "./Draggable-Figures/admin/CreateSquareToParallelogram";
import SquareToParallelogram from "./Draggable-Figures/client/SquareToParallelogram";
import CreateSquareToRhombus from "./Draggable-Figures/admin/CreateSquareToRhombus";
import SquareToRhombus from "./Draggable-Figures/client/SquareToRhombus";
import CreateSquareToRectangle from "./Draggable-Figures/admin/CreateSquareToRectangle";
import SquareToRectangle from "./Draggable-Figures/client/SquareToRectangle";
import CreateSquareToTrapezium from "./Draggable-Figures/admin/CreateSquareToTrapezium";
import SquareToTrapezium from "./Draggable-Figures/client/SquareToTrapezium";
import CreateSquareToQuadrilateral from "./Draggable-Figures/admin/CreateSquareToQuadrilateral";
import SquareToQuadrilateral from "./Draggable-Figures/client/SquareToQuadrilateral";
import CreateCaptchaCircles from "./Captcha/admin/CreateCaptchaCircles";
import CaptchaCircles from "./Captcha/client/CaptchaCircles";
import CreatePieChartStory from "./Pie-Chart/admin/CreatePieChartStory";
import PieChartStory from "./Pie-Chart/client/PieChartStory";
import CreateFruitPercentageBasic from "./Percentages/admin/CreateFruitPercentageBasic";
import FruitPercentageBasic from "./Percentages/client/FruitPercentageBasic";
import CreateFruitPercentageAdvanced from "./Percentages/admin/CreateFruitPercentageAdvanced";
import FruitPercentageAdvanced from "./Percentages/client/FruitPercentageAdvanced";
import CreateFruitPercentageExpert from "./Percentages/admin/CreateFruitPercentageExpert";
import FruitPercentageExpert from "./Percentages/client/FruitPercentageExpert";
import StandardBtn from "../components/general/buttons/StandardBtn";
import StandardBtn_small from "../components/general/buttons/StandardBtn_small";
import StandardBtn_extra_small from "../components/general/buttons/StandardBtn_extra_small";
import EditOrderPopup from "../components/general/EditOrderPopup";
import { customSort } from "../utlis/general";
import CreateTimerQuestions from "./Arithmetic/admin/CreateTimerQuestions";
import TimerQuestions from "./Arithmetic/client/TimerQuestions";
import CreateMatchingBoxes from "./Matching/admin/CreateMatchingBoxes";
import MatchingBoxes from "./Matching/client/MatchingBoxes";
import CreateSimplifyFractions from "./Fractions/admin/CreateSimplifyFractions";
import SimplifyFractions from "./Fractions/client/SimplifyFractions";
import BiggerSmaller from "./Arithmetic/client/BiggerSmaller";
import CreateBiggerSmaller from "./Arithmetic/admin/CreateBiggerSmaller";
import CreateCaptchaImages from "./Captcha/admin/CreateCaptchaImages";
import CaptchaImages from "./Captcha/client/CaptchaImages";
import CreateMatchingImages from "./Matching/admin/CreateMatchingImages";
import MatchingImages from "./Matching/client/MatchingImages";
import CreateTaxiExercise from "./Arithmetic/admin/CreateTaxiExercise";
import TaxiExercise from "./Arithmetic/client/TaxiExercise";
import CreateDiagonalTrapezium from "./Diagonals/admin/CreateDiagonalTrapezium";
import DiagonalTrapezium from "./Diagonals/client/DiagonalTrapezium";
import CreateDiagonalsParallelogram from "./Diagonals/admin/CreateDiagonalsParallelogram";
import DiagonalsParallelogram from "./Diagonals/client/DiagonalsParallelogram";
import CreateSlotMachine from "./Arithmetic/admin/CreateSlotMachine";
import SlotMachine from "./Arithmetic/client/SlotMachine";
import CreateSlotMachine2 from "./Arithmetic/admin/CreateSlotMachine2";
import SlotMachine2 from "./Arithmetic/client/SlotMachine2";
import CreateDuoLingo from "./Dragging-Exercises/admin/CreateDuoLingo";
import DuoLingo from "./Dragging-Exercises/client/DuoLingo";

const BijlexHome = () => {
  const [currentSelect, setCurrentSelect] = useState("level");
  const [mode, setMode] = useState("");
  const [level, setLevel] = useState("");
  const [year, setYear] = useState("");
  const [chapter, setChapter] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");

  const [soloQuestion, setSoloQuestion] = useState({});
  const [reOrder, setReOrder] = useState(false);

  const handleReOrder = (q) => {
    setSoloQuestion(q);
    setReOrder(true);
  };

  const [customData, setCustomData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10; // Adjust as needed

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const [exportExercise, setExportExercise] = useState({});

  const [jsonExport, setJsonExport] = useState(false);
  const exportDocument = (quest) => {
    setExportExercise(quest);
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
  const [exerciseType, setExerciseType] = useState("");
  const CreateComponents = {
    "table-exercise": CreateTableExercise,
    "graph-to-table": CreateGraphToTable,
    parabola: CreateParabola,
    "matching-pairs": CreateMatchingPair,
    "numberline-completion": CreateNumberLine,
    "fraction-buckets": CreateFractionBuckets,
    "knapsack-problem": CreateKnapsackExercise,
    compass: CreateCompassExercise,
    "parallel-parallelogram": CreateParallelogramExercise,
    "parallel-star": CreateStarExercise,
    "parallel-cube": CreateCubeExercise,
    "squares-to-dice": CreateSquaresToDice,
    "circle-to-oval": CreateCircleToOval,
    "diagonals-square": CreateDiagonalsSquare,
    "diagonals-rectangle": CreateDiagonalsRectangle,
    "square-to-parallelogram": CreateSquareToParallelogram,
    "square-to-rhombus": CreateSquareToRhombus,
    "square-to-rectangle": CreateSquareToRectangle,
    "square-to-trapezium": CreateSquareToTrapezium,
    "square-to-quadrilateral": CreateSquareToQuadrilateral,
    "captcha-circles": CreateCaptchaCircles,
    "pie-chart-story": CreatePieChartStory,
    "fruit-percentage-basic": CreateFruitPercentageBasic,
    "fruit-percentage-advanced": CreateFruitPercentageAdvanced,
    "fruit-percentage-expert": CreateFruitPercentageExpert,
    "timer-arithmetic-questions": CreateTimerQuestions,
    "matching-boxes": CreateMatchingBoxes,
    "simplify-fractions": CreateSimplifyFractions,
    "bigger-smaller": CreateBiggerSmaller,
    "captcha-images": CreateCaptchaImages,
    "matching-images": CreateMatchingImages,
    "taxi-exercise": CreateTaxiExercise,
    "diagonals-trapezium": CreateDiagonalTrapezium,
    "diagonals-parallelogram": CreateDiagonalsParallelogram,
    "slot-machine": CreateSlotMachine,
    "slot-machine2": CreateSlotMachine2,
    "duo-lingo": CreateDuoLingo,
  };
  const exerciseComponents = {
    "table-exercise": TableExercise,
    "graph-to-table": GraphToTable,
    parabola: Parabola,
    "matching-pairs": MatchingGame,
    "numberline-completion": NumberLine,
    "fraction-buckets": FractionBuckets,
    "knapsack-problem": KnapsackExercise,
    compass: CompassExercise,
    "parallel-parallelogram": ParallelogramExercise,
    "parallel-star": StarExercise,
    "parallel-cube": CubeExercise,
    "squares-to-dice": SquaresToDice,
    "circle-to-oval": CircleToOval,
    "diagonals-square": DiagonalsSquare,
    "diagonals-rectangle": DiagonalsRectangle,
    "square-to-parallelogram": SquareToParallelogram,
    "square-to-rhombus": SquareToRhombus,
    "square-to-rectangle": SquareToRectangle,
    "square-to-trapezium": SquareToTrapezium,
    "square-to-quadrilateral": SquareToQuadrilateral,
    "captcha-circles": CaptchaCircles,
    "pie-chart-story": PieChartStory,
    "fruit-percentage-basic": FruitPercentageBasic,
    "fruit-percentage-advanced": FruitPercentageAdvanced,
    "fruit-percentage-expert": FruitPercentageExpert,
    "timer-arithmetic-questions": TimerQuestions,
    "matching-boxes": MatchingBoxes,
    "simplify-fractions": SimplifyFractions,
    "bigger-smaller": BiggerSmaller,
    "captcha-images": CaptchaImages,
    "matching-images": MatchingImages,
    "taxi-exercise": TaxiExercise,
    "diagonals-trapezium": DiagonalTrapezium,
    "diagonals-parallelogram": DiagonalsParallelogram,
    "slot-machine": SlotMachine,
    "slot-machine2": SlotMachine2,
    "duo-lingo": DuoLingo,
  };
  const {
    addDialog,
    removeDialog,
    addFullscreenConfirmationDialog,
    addConfirmationDialog,
  } = useMessage();
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
  const handleEditQuestionClick = (question) => {
    setMode("Edit");
    setQuestion(question);
    setCurrentSelect("Edit_model");
  };
  const handleQuestionModelClick = (exerciseType) => {
    setMode("Create");
    setCustomData({});
    setCurrentSelect("Specific_model");
    setExerciseType(exerciseType);
  };
  const fetchData = async () => {
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Fetching your exercises",
    });
    try {
      const response = await axios.get(
        "https://bijlex-backend.onrender.com/exercises/getByALHP",
        // "http://localhost:3500/exercises/getByALHP",
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
        removeDialog(loadingDialogId);
        const customData =
          typeof response.data.customData === "string"
            ? JSON.parse(response.data.customData)
            : response.data.customData;
        const sortedData = response.data.sort(customSort);
        console.log(sortedData)
        setQuestions(sortedData);
      } else {
        setQuestions([])
        addFullscreenConfirmationDialog("No Data Found", "Ok");
        removeDialog(loadingDialogId)
      }
    } catch (error) {
      removeDialog(loadingDialogId);
      addFullscreenConfirmationDialog(
        "Something went wrong on the server" + error.response
          ? error.response.data
          : error.message,
        "Ok"
      );
    }
  };
  useEffect(() => {
    if (paragraph != "") {
      fetchData();
    }
  }, [paragraph]);
  useEffect(() => {
    if (
      question != "" &&
      (currentSelect == "preview" ||
        currentSelect == "detail_question" ||
        currentSelect == "Edit_model")
    ) {
      const fetchExercises = async () => {
        const loadingDialogId = addDialog({
          type: "loading",
          message: "Loading your exercise",
        });
        try {
          const response = await axios.get(
            `https://bijlex-backend.onrender.com/exercises/${question}`
          );
          if (response.status === 200) {
            console.log(response);
            removeDialog(loadingDialogId);
            const customData =
              typeof response.data.customData === "string"
                ? JSON.parse(response.data.customData)
                : response.data.customData;
            setExerciseType(response.data.exerciseType);
            setCustomData(customData);
          }
        } catch (error) {
          removeDialog(loadingDialogId);
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
        setQuestion("");
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

  const editExercise = async () => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Updating your exercise",
    });
    formData.append("id", question);
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
      const response = await axios.patch(
        "https://bijlex-backend.onrender.com/exercises/" + question,
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
      removeDialog(loadingDialogId);
      if (!error.response) {
        console.error("Network error:", error.message);
        errMsg = "Network error. Please try again later.";
      } else {
        errMsg = error.response.data.message;
      }
    }
  };
  const reOrderExercise = async (id, q, v) => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Updating your exercise",
    });
    formData.append("id", id);
    formData.append("question", q);
    formData.append("variation", v);
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
      const response = await axios.patch(
        "https://bijlex-backend.onrender.com/exercises/reorder",
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
          duration: 3000, //  duration in milliseconds
        });
        fetchData();
        return true;
      }
    } catch (error) {
      let errMsg = "";
      removeDialog(loadingDialogId);
      if (!error.response) {
        console.error("Network error:", error.message);
        errMsg = "Network error. Please try again later.";
      } else {
        errMsg = error.response.data.message;
      }
    } finally {
      setReOrder(false);
    }
  };
  const deleteExercise = async (id) => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Deleting your exercise",
    });
    formData.append("id", question);
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
      const response = await axios.delete(
        "https://bijlex-backend.onrender.com/exercises/" + id,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      removeDialog(loadingDialogId);

      if (response.status === 200) {
        addDialog({
          type: "message",
          messageType: "success", // can be 'default', 'success', or 'error'
          message: "Exercise Deleted!",
          duration: 3000, // duration in milliseconds
        });
        fetchData();
        return true;
      }
    } catch (error) {
      let errMsg = "";
      removeDialog(loadingDialogId);
      if (!error.response) {
        console.error("Network error:", error.message);
        errMsg = "Network error. Please try again later.";
      } else {
        errMsg = error.response.data.message;
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await addConfirmationDialog(
      "Are you sure you want to delete this?"
    );
    if (confirm) {
      deleteExercise(id);
      // Proceed with delete action
    } else {
      // Handle cancellation
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
          <>
            {mode === "Edit" ? (
              <button onClick={editExercise} className="addQuestionBtn">
                Update Exercise
              </button>
            ) : (
              <button onClick={addExercise} className="addQuestionBtn">
                Save Exercise
              </button>
            )}
          </>
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
          {currentQuestions.length > 0 ? (
            currentQuestions.map((quest) => (
              <div key={quest._id} className="question_model_card">
                <span>{quest.order}</span>
                <span>{quest.name}</span>
                <span>{quest.exerciseType}</span>
                <SvgBtn
                  handleClick={() => exportDocument(quest)}
                  SvgIcon={exportDownloadIcon}
                  text={"Export Exercise"}
                />
                <StandardBtn_extra_small
                  text={"Edit"}
                  handleClick={() => handleEditQuestionClick(quest._id)}
                />
                <StandardBtn_extra_small
                  text={"Reorder"}
                  handleClick={() => handleReOrder(quest)}
                />
                <StandardBtn_extra_small
                  text={"View"}
                  handleClick={() => handleQuestionClick(quest._id)}
                />
                <StandardBtn_extra_small
                  text={"Delete"}
                  handleClick={() => handleDelete(quest._id)}
                />
              </div>
            ))
          ) : (
            <p>No exercises found.</p>
          )}

          <div className="pagination_controls">
            <StandardBtn_small
              text={"Previous"}
              handleClick={handlePrevPage}
              isDisabled={currentPage === 1}
            />

            <span>
              Page {currentPage} of {totalPages}
            </span>
            <StandardBtn_small
              text={"Next"}
              handleClick={handleNextPage}
              isDisabled={currentPage === totalPages}
            />
          </div>
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
          <div className="question_model_card">
            <span>5</span>
            <span>WIB-BRK-901</span>
            <span>Fraction Buckets Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("fraction-buckets")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>6</span>
            <span>AAA-GEO-001</span>
            <span>Numberline Completion Exercise</span>

            <button
              onClick={() => handleQuestionModelClick("numberline-completion")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>7</span>
            <span>AAA-GEO-001</span>
            <span>"Knapsack Problem" Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("knapsack-problem")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>8</span>
            <span>AAA-GEO-001</span>
            <span>Compass Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("compass")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>9</span>
            <span>AAA-GEO-001</span>
            <span>Parallel Parallelogram Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("parallel-parallelogram")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>10</span>
            <span>AAA-GEO-001</span>
            <span>Parallel Star Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("parallel-star")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>11</span>
            <span>BIL-EVE-901</span>
            <span>Parallel Cube Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("parallel-cube")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>12</span>
            <span>LEN-MAA-900</span>
            <span>Squares To Dice Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("squares-to-dice")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>13</span>
            <span>FIG-BAS-905</span>
            <span>Circle To Oval Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("circle-to-oval")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>14</span>
            <span>FIG-BAS-902</span>
            <span>Diagonals Square Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("diagonals-square")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>15</span>
            <span>FIG-BAS-902</span>
            <span>Diagonals Rectangle Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("diagonals-rectangle")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>16</span>
            <span>FIG-BAS-906</span>
            <span>Square To Parallelogram Exercise</span>
            <button
              onClick={() =>
                handleQuestionModelClick("square-to-parallelogram")
              }
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>17</span>
            <span>FIG-BAS-906</span>
            <span>Square To Rhombus Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("square-to-rhombus")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>18</span>
            <span>FIG-BAS-906</span>
            <span>Square To Rectangle Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("square-to-rectangle")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>19</span>
            <span>FIG-BAS-906</span>
            <span>Square To Trapezium Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("square-to-trapezium")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>20</span>
            <span>FIG-BAS-906</span>
            <span>Square To Quadrilateral Exercise</span>
            <button
              onClick={() =>
                handleQuestionModelClick("square-to-quadrilateral")
              }
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>21</span>
            <span>FIG-BAS-904</span>
            <span>Captcha Circles Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("captcha-circles")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>22</span>
            <span>FIG-BAS-907</span>
            <span>Pie Chart Story Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("pie-chart-story")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>23</span>
            <span>---</span>
            <span>Fruit Percentage Basic Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("fruit-percentage-basic")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>24</span>
            <span>---</span>
            <span>Fruit Percentage Advanced Exercise</span>
            <button
              onClick={() =>
                handleQuestionModelClick("fruit-percentage-advanced")
              }
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>25</span>
            <span>---</span>
            <span>Fruit Percentage Expert Exercise</span>
            <button
              onClick={() =>
                handleQuestionModelClick("fruit-percentage-expert")
              }
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>26</span>
            <span>WIB-BEW-901</span>
            <span>Timer Arithmetic Questions Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("timer-arithmetic-questions")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>27</span>
            <span>---</span>
            <span>Matching Boxes Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("matching-boxes")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>28</span>
            <span>---</span>
            <span>Matching Boxes Images Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("matching-images")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>29</span>
            <span>---</span>
            <span>Simplify Fractions Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("simplify-fractions")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>30</span>
            <span>---</span>
            <span>Bigger Smaller Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("bigger-smaller")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>31</span>
            <span>---</span>
            <span>Captcha 9 Images Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("captcha-images")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>32</span>
            <span>---</span>
            <span>Taxi Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("taxi-exercise")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>33</span>
            <span>---</span>
            <span>Diagonals Trapezium Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("diagonals-trapezium")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>34</span>
            <span>---</span>
            <span>Diagonals Parallelogram Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("diagonals-parallelogram")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
          <div className="question_model_card">
            <span>35</span>
            <span>---</span>
            <span>Slot Machine Exercise</span>
            <button
              onClick={() => handleQuestionModelClick("slot-machine")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>

          <div className="question_model_card">
            <span>36</span>
            <span>---</span>
            <span>Slot Machine Exercise 2</span>
            <button
              onClick={() => handleQuestionModelClick("slot-machine2")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>

          <div className="question_model_card">
            <span>37</span>
            <span>---</span>
            <span>DuoLingo Exercise 
            </span>
            <button
              onClick={() => handleQuestionModelClick("duo-lingo")}
              className="question_select_btn"
            >
              Select
            </button>
          </div>
        </div>
      )}
      {jsonExport && (
        <ExportPanel
          json={parseJsonIfNeeded(exportExercise.customData)}
          closeDialog={() => setJsonExport(false)}
          exerciseName={exportExercise.name}
        />
      )}
      {reOrder && (
        <EditOrderPopup
          question={soloQuestion}
          onClose={() => setReOrder(false)}
          onUpdate={reOrderExercise}
        />
      )}
      {exerciseType != "" &&
        (currentSelect == "Specific_model" ||
          currentSelect == "Edit_model") && (
          <CreateComponent
            setCustomData={previewExercise}
            customData={customData}
          />
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
