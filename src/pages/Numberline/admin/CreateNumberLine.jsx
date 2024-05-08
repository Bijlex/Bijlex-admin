import React, { useState } from "react";

const CreateNumberLine = ({ setCustomData }) => {
  const [answers, setAnswers] = useState([0.1, 1.2, -2.2, 3.3, 4, 5, 6, 7]);
  const prompt =
    "Zet de volgende getallen op de juiste plaats op de getallenlijn:";
  const addExercise = async () => {
    const customStyle = {};
    const customData = {
      answers,
      prompt,
    };
    setCustomData(customData);
  };

  return (
    <div>
      <button onClick={() => setCustomData(addExercise)}>Submit</button>
    </div>
  );
};

export default CreateNumberLine;
