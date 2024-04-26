import { useState, useEffect } from "react";
import { Line, Scatter } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../../../styles/graph/Parabola.module.css";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext";

const graphRange = 20; // Increased range for better visibility of parabolas

function CreateParabola() {
  const [parabolaParams, setParabolaParams] = useState({ a: 1, h: 0, k: 0 });
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const moveParabola = (direction) => {
    setParabolaParams((prevParams) => {
      let { a, h, k } = prevParams;
      switch (direction) {
        case "up":
          k += 1;
          break;
        case "down":
          k -= 1;
          break;
        case "wider":
          a -= 0.1;
          break;
        case "narrower":
          a += 0.1;
          break;
        case "left":
          h -= 1;
          break;
        case "right":
          h += 1;
          break;
        default:
          break;
      }
      return { ...prevParams, a, h, k };
    });
  };

  // Prepare data for the chart
  const data = {
    labels: Array.from(
      { length: graphRange * 2 + 1 },
      (_, i) => i - graphRange
    ),
    datasets: [
      {
        label: "Parabola",
        data: Array.from({ length: graphRange * 2 + 1 }, (_, i) => {
          const x = i - graphRange;
          return (
            parabolaParams.a * Math.pow(x - parabolaParams.h, 2) +
            parabolaParams.k
          );
        }),
        borderColor: "purple",
        borderWidth: 2,
      },
    ],
  };

  // Prepare options for the chart
  const options = {
    scales: {
      y: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Lighter grid lines
          borderColor: "rgba(255, 255, 255, 0.25)", // Lighter axis border
          borderWidth: 2,
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.75)", // Lighter tick labels
          stepSize: 1,
        },
      },
      x: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Lighter grid lines
          borderColor: "rgba(255, 255, 255, 0.25)", // Lighter axis border
          borderWidth: 2,
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.75)", // Lighter tick labels
          stepSize: 1,
        },
      },
    },
    elements: {
      point: {
        radius: 0, // Hide points
      },
      line: {
        tension: 0, // Straight lines for the parabola's curve
      },
    },
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  // Utility function to format numbers, enclosing negative values in parentheses
  const formatValue = (value) => {
    return value < 0 ? `(${value})` : value.toString();
  };

  const generateRandomEquation = () => {
    const newA = Math.round((Math.random() * 4 - 2) * 10) / 10; // Generate a value, then round it to make it divisible by 0.10
    const newH = Math.round(Math.random() * 10 - 5); // Randomize h within a range
    const newK = Math.round(Math.random() * 10 - 5); // Randomize k within a range
    setParabolaParams({ a: newA, h: newH, k: newK });
  };

  const createExercise = async () => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Creating your exercise",
    });
    formData.append("chapter", "Chapter 2");
    formData.append("difficulty", 1);
    formData.append(
      "prompt",
      "Please match your parabola with the target equation"
    );
    formData.append("category", "graph-parabola");
    formData.append("exerciseType", "parabola");
    const customStyle = {};
    const customData = {
      parabolaParams,
    };
    console.log(customData);
    formData.append("customData", JSON.stringify(customData));
    formData.append("customStyle", JSON.stringify(customStyle));

    try {
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
    generateRandomEquation();
  }, []);

  return (
    <div className={styles.App}>
      <div className={styles.graph_box}>
        <div className={styles.line_graph}>
          <Line data={data} options={options} />
        </div>
        <div className={styles.question_container}>
          <h2>Create a Parabola</h2>
          <div className={styles.target_equation}>
            y =
            <input
              type="text"
              value={parabolaParams.a.toFixed(2)}
              onChange={(e) =>
                setParabolaParams((prev) => ({
                  ...prev,
                  a: parseFloat(e.target.value) || 0,
                }))
              }
            />
            (x -
            <input
              type="text"
              value={parabolaParams.h.toFixed(2)}
              onChange={(e) =>
                setParabolaParams((prev) => ({
                  ...prev,
                  h: parseFloat(e.target.value) || 0,
                }))
              }
            />
            ) ^2 +
            <input
              type="text"
              value={parabolaParams.k.toFixed(2)}
              onChange={(e) =>
                setParabolaParams((prev) => ({
                  ...prev,
                  k: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className={styles.arrow_box}>
            <button onClick={() => moveParabola("left")}>Left</button>
            <button onClick={() => moveParabola("right")}>Right</button>
          </div>
          <div className={styles.arrow_box}>
            <button onClick={() => moveParabola("up")}>Up</button>
            <button onClick={() => moveParabola("down")}>Down</button>
          </div>
          <div className={styles.arrow_box}>
            <button onClick={() => moveParabola("wider")}>Wider</button>
            <button onClick={() => moveParabola("narrower")}>Narrower</button>
          </div>
          <div className={styles.arrow_box}>
            <button onClick={createExercise}>Create Exercise</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateParabola;
