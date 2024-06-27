import React, { useState, useEffect } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn";
import { documentIcon } from "../../../constants/icons.jsx";
import { map } from 'lodash';

const CreateMagicSquare = ({ setCustomData, customData }) => {
  const [bigSquares, setBigSquares] = useState(customData?.bigSquares || "");
  const [smallSquares, setSmallSquares] = useState(customData?.smallSquares || "");
  const [answers, setAnswers] = useState(customData?.answers || "");
  const [hiddenIndices, setHiddenIndices] = useState(customData?.hiddenIndices || "");
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");

  useEffect(() => {
    setBigSquares(customData?.bigSquares || "");
    setSmallSquares(customData?.smallSquares || "");
    setAnswers(customData?.answers || "");
    setHiddenIndices(customData?.hiddenIndices || "");
    setQuestionPrompt(customData?.questionPrompt || "");
  }, [customData]);

  const handleBigSquaresChange = (e) => {
    setBigSquares(e.target.value);
  };

  const handleSmallSquaresChange = (e) => {
    setSmallSquares(e.target.value);
  };

  const handleAnswersChange = (e) => {
    setAnswers(e.target.value);
  };

  const handleHiddenIndicesChange = (e) => {
    setHiddenIndices(e.target.value);
  };

  const saveExercise = async () => {
    const customData = {
      bigSquares,
      smallSquares,
      answers,
      hiddenIndices,
      questionPrompt,
    };

    setCustomData(customData);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <label style={{ marginBottom: "10px" }}>
        Question Prompt:
        <input
          type="text"
          value={questionPrompt}
          onChange={(e) => setQuestionPrompt(e.target.value)}
          placeholder="Enter your question prompt"
          style={{
            width: "400px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px ",
            marginBottom: "20px",
          }}
        />
      </label>

      <label style={{ marginBottom: "10px" }}>
        Big Squares:
        <textarea
          value={bigSquares}
          onChange={handleBigSquaresChange}
          placeholder="Enter big squares values (comma-separated)"
          style={{
            width: "400px",
            height: "100px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
      </label>

      <label style={{ marginBottom: "10px" }}>
        Small Squares (operators):
        <textarea
          value={smallSquares}
          onChange={handleSmallSquaresChange}
          placeholder="Enter small squares operators (comma-separated)"
          style={{
            width: "400px",
            height: "50px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
      </label>

      <label style={{ marginBottom: "10px" }}>
        Answers:
        <textarea
          value={answers}
          onChange={handleAnswersChange}
          placeholder=" Enter answers (comma-separated)"
          style={{
            width: "400px",
            height: "50px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
      </label>

      <label style={{ marginBottom: "10px" }}>
        Hidden Indices:
        <input
          type="text"
          value={hiddenIndices}
          onChange={handleHiddenIndicesChange}
          placeholder="Enter hidden indices (comma-separated)"
          style={{
            width: "400px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "2 0px",
          }}
        />
      </label>

  
     
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: "30px", alignSelf: "center" }}
      />
    </div>
  );
};

export default CreateMagicSquare;
