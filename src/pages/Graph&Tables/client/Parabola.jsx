import { useState, useEffect } from "react";
import { Line, Scatter } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../../../styles/graph/Parabola.module.css";
import { useMessage } from "../../../contexts/MessageContext";

const graphRange = 20; // Increased range for better visibility of parabolas

function Parabola({ customData }) {
  const [parabolaParams, setParabolaParams] = useState({ a: 1, h: 0, k: 0 });
  const [equation, setEquation] = useState("");
  const [targetEquation, setTargetEquation] = useState(
    customData?.parabolaParams
  );
  const [showEquation, setShowEquation] = useState(true);
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
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines
          borderColor: "rgba(0, 0, 0, 1)", // Lighter axis border
          borderWidth: 2,
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.75)", // Lighter tick labels
          stepSize: 1,
        },
      },
      x: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines
          borderColor: "rgba(0, 0, 0, 1)", // Lighter axis border
          borderWidth: 2,
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.75)", // Lighter tick labels
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

  useEffect(() => {
    // Update the equation string whenever parabolaParams changes, formatting negative values
    const a = parabolaParams.a.toFixed(2);
    const h = formatValue(parabolaParams.h.toFixed(2));
    const k = formatValue(parabolaParams.k.toFixed(2));
    setEquation(`y = ${a}(x - ${h})^2 + ${k}`);
  }, [parabolaParams]);
  useEffect(() => {
    setTargetEquation(customData?.parabolaParams);
  }, [customData]);

  const checkAnswer = () => {
    if (
      Math.abs(targetEquation.a - parabolaParams.a) < 0.1 &&
      Math.abs(targetEquation.h - parabolaParams.h) < 1 &&
      Math.abs(targetEquation.k - parabolaParams.k) < 1
    ) {
      const successDialog = addFullscreenConfirmationDialog(
        "You are correct",
        "Ok"
      );
    } else {
      const successDialog = addFullscreenConfirmationDialog(
        "You are incorrect",
        "Ok"
      );
    }
  };

  const toggleEquation = () => {
    setShowEquation((prev) => !prev);
  };

  return (
    <div className={styles.App}>
      <div className={styles.graph_box}>
        <div className={styles.line_graph}>
          <Line data={data} options={options} />
        </div>
        <div className={styles.question_container}>
          <h2 style={{ color: "black" }}>Match this equation</h2>
          <div className={styles.target_equation}>
            y = {formatValue(targetEquation.a.toFixed(2))}(x -{" "}
            {formatValue(targetEquation.h.toFixed(2))})^2 +{" "}
            {formatValue(targetEquation.k.toFixed(2))}
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
            <button onClick={toggleEquation} type="button">
              Toggle Equation
            </button>
          </div>
          {showEquation && (
            <div id="help_equation" className={styles.equation_display}>
              {equation}
            </div>
          )}
          <div className={styles.arrow_box}>
            <button
              type="button"
              onClick={checkAnswer}
              className="submit_button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parabola;
