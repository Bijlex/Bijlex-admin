import React, { useState, useEffect } from "react";

function Bucket({ fraction, total }) {
  // Convert fraction to a number by replacing the comma with a period
  const numericFraction = parseFloat(fraction.replace(",", "."));
  const height = `${(numericFraction * 100).toFixed(2)}%`; // Calculates the height of the water based on the fraction

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "3px solid black",
        borderTop: "none", // No top border to simulate an open top
        borderRadius: "5px", // Slightly rounded corners for the glass effect
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: height,
          backgroundColor: "rgb(76, 245, 236)", // Water color
          borderRadius: "5px 5px 0 0", // Rounded bottom corners
        }}
      ></div>
    </div>
  );
}

function Fraction({ value, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, value)}
      style={{
        margin: "10px",
        padding: "5px",
        backgroundColor: "lightgray",
        cursor: "pointer",
      }}
    >
      {value}
    </div>
  );
}

function FractionBuckets({ customData, preview }) {
  const total = 10; // Total liters of water (could be passed as a prop)
  const [buckets, setBuckets] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [draggableFractions, setDraggableFractions] = useState([]);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  useEffect(() => {
    // Update buckets based on customData received from parent
    if (customData && customData.fractions) {
      const shuffledFractions = shuffle(customData.fractions);
      setDraggableFractions(shuffledFractions);
      setBuckets(
        shuffledFractions.map((fraction, index) => ({
          id: index,
          fraction: fraction,
          evaluatedFraction: evaluateFraction(fraction),
          matched: false,
        }))
      );
      setAnswers(Array(shuffledFractions.length).fill(null));
    }
  }, [customData]);

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const evaluateFraction = (fraction) => {
    const value = parseFloat(eval(fraction));
    const formattedValue = value.toFixed(3);
    const result = formattedValue.endsWith("0")
      ? value.toFixed(2)
      : formattedValue;
    return result.replace(".", ",");
  };

  const handleDragStart = (e, fraction) => {
    e.dataTransfer.setData("fraction", fraction);
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    const fraction = e.dataTransfer.getData("fraction");
    const newAnswers = [...answers];
    newAnswers[index] = fraction; // Store the original string
    setAnswers(newAnswers);
  };

  useEffect(() => {
    setShowCheckButton(answers.every((answer) => answer != null));
  }, [answers]);

  const checkAnswers = () => {
    const results = answers.map((answer, index) => {
      return parseFloat(eval(answer)) === parseFloat(buckets[index].evaluatedFraction.replace(",", "."));
    });
    setBuckets(
      buckets.map((bucket, index) => ({ ...bucket, matched: results[index] }))
    );

    const allCorrect = results.every((res) => res);
    const allIncorrect = results.every((res) => !res);
    if (allCorrect) {
      setResultMessage("Correct! Great job!");
    } else if (allIncorrect) {
      setResultMessage("Incorrect. Try again!");
    } else {
      setResultMessage("Partially correct. Keep trying!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h2>{questionPrompt}</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "80%",
          margin: "30px 0",
        }}
      >
        {buckets.map((bucket, index) => (
          <div
            key={bucket.id}
            style={{ textAlign: "center", height: "150px", width: "100px" }}
          >
            <Bucket fraction={bucket.evaluatedFraction} total={total} />
            <div
              style={{ marginTop: "5px", fontSize: "16px", fontWeight: "bold" }}
            >
              {bucket.evaluatedFraction}
            </div>
            <div
              onDrop={(e) => handleDrop(index, e)}
              onDragOver={(e) => e.preventDefault()}
              style={{
                width: "100px",
                height: "50px",
                border: "1px dashed black",
                margin: "20px auto",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              {answers[index]}
            </div>
          </div>
        ))}
      </div>
      {draggableFractions.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "30%",
            margin: "90px 0",
          }}
        >
          {draggableFractions.map((fraction, index) => (
            <Fraction
              key={index}
              value={fraction}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      )}
      {showCheckButton && !preview && (
        <button
          onClick={checkAnswers}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Check Answers
        </button>
      )}
      {resultMessage && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: resultMessage.startsWith("Correct") ? "green" : "red",
          }}
        >
          {resultMessage}
        </div>
      )}
    </div>
  );
}

export default FractionBuckets;
