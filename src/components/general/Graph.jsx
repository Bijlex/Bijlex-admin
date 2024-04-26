import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { calculateLineEquation, formatEquation } from "../../utlis/calculation";
import styles from "../../styles/graph/GraphToTable.module.css";

function isPointOnLine(line, point) {
  const { x: x1, y: y1 } = line[0];
  const { x: x2, y: y2 } = line[1];
  const [x, y] = point;

  // Calculate the slope (m) and y-intercept (b) of the line
  const m = (y2 - y1) / (x2 - x1);
  const b = y1 - m * x1;

  // Calculate y using the line equation
  const lineY = m * x + b;

  // Check if the calculated y is the same as the point's y
  return Math.abs(y - lineY) <= 0.8;
}

const Graph = ({
  XMaxRange = 10,
  XMinRange = -10,
  XStepSize = 1,
  YMaxRange = 10,
  YMinRange = -10,
  YStepSize = 1,
  placeDotsActive = false,
  drawLineActive = false,
  dots,
  setDots = () => {},
  lineDetails = [{ line: "", color: "" }],
  setLineDetails = () => {},
  selectedDots = [],
  setSelectedDots = () => {},
  setChartRef,
  hoverOverLineIndex = "",
  setHoverOverLineIndex = () => {},
  deletingLine = false,
  isExpectingCords = false,
}) => {
  const [blinkColor, setBlinkColor] = useState("black");
  // Function to generate random color
  const generateRandomColor = () => {
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    // Ensure color is not too light or black
    while (color === "#FFFFFF" || color === "#000000" || color.length < 7) {
      color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
    return color;
  };
  const labels = Array.from(
    { length: (XMaxRange - XMinRange) / XStepSize + 1 },
    (_, i) => XMinRange + i * XStepSize
  );
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Dots",
        data: dots,
        backgroundColor: dots.map(
          (dot) =>
            selectedDots.some(
              (selectedDot) =>
                selectedDot.x === dot.x && selectedDot.y === dot.y
            )
              ? "red" // Always yellow if the dot is part of selectedDotsForLine
              : drawLineActive
              ? blinkColor // Only apply blinking effect if drawLineActive is true and the dot is not part of selectedDotsForLine
              : "black" // Default color when drawLineActive is false
        ),

        pointRadius: 5,
        animation: false,
      },
      ...lineDetails.map((detail, index) => {
        const { slope, yIntercept } = calculateLineEquation(
          detail.line[0],
          detail.line[1]
        );
        const extendedStart = {
          x: XMinRange,
          y: slope * XMinRange + yIntercept,
        };
        const extendedEnd = {
          x: XMaxRange,
          y: slope * XMaxRange + yIntercept,
        };
        return {
          label: `Line ${index + 1}: ${formatEquation({
            slope,
            yIntercept,
          })}`,
          data: [extendedStart, extendedEnd],
          type: "line",
          fill: false,
          borderColor: detail.color,
          borderWidth: index === hoverOverLineIndex ? 4 : 2,
          showLine: true,
          lineTension: 0,
          pointRadius: 1, // No need to show points for the line
        };
      }),
    ],
  };

  // Options remain unchanged
  const options = {
    scales: {
      y: {
        type: "linear",
        position: "center",
        min: YMinRange,
        max: YMaxRange,
        grid: {
          color: "rgba(0, 60, 150, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.25)",
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          callback: function (value, index, values) {
            return "";
          },
          stepSize: YStepSize,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
      x: {
        type: "linear",
        position: "center",
        min: XMinRange,
        max: XMaxRange,
        grid: {
          color: "rgba(0, 60, 150, 0.3)",
          borderColor: "rgba(0, 60, 150, 0.25)",
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          callback: function (value, index, values) {
            return "";
          },
          stepSize: XStepSize,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
    },
    plugins: {
      datalabels: {
        color: "black",
        align: "top",
        anchor: "end",
        formatter: (value, context) => {
          const dot = context.chart.data.datasets[0].data[context.dataIndex];
          return `(${dot.x}, ${dot.y})`;
        },
        font: {
          weight: "bold",
          size: 10,
        },
        offset: 5,
      },
      legend: {
        display: true, // Ensure legends are displayed to show equations
        position: "bottom",
        labels: {
          // This function ensures that the color of the text in the legend matches the line color
          color: (context) => {
            // Directly access the color from the lineDetails array
            // -1 because the first dataset is dots, so lineDetails[0] corresponds to context.datasetIndex 1
            if (context.datasetIndex === 0) return "black"; // Return black for dots dataset
            const lineDetail = lineDetails[context.datasetIndex - 1];
            return lineDetail ? lineDetail.color : "black"; // Return the line color if exists, otherwise black
          },
          usePointStyle: true,
        },
      },

      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    onClick: (e) => {
      // Modify the onClick logic to update the new `lineDetails` state
      if (
        !placeDotsActive &&
        !drawLineActive &&
        !deletingLine &&
        !isExpectingCords
      )
        return;

      const canvasPosition = e.chart.canvas.getBoundingClientRect();
      const x = Math.round(
        e.chart.scales.x.getValueForPixel(e.native.x - canvasPosition.x)
      );
      const y = Math.round(
        e.chart.scales.y.getValueForPixel(e.native.y - canvasPosition.y)
      );
      const clickThreshold = 0.5;
      if (isExpectingCords) {
        const haveCords = selectedDots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );
        if (haveCords > 0) {
          setSelectedDots([...cords, { x, y }]);
        }
        return true;
      }
      if (placeDotsActive) {
        const existingIndex = dots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );

        if (existingIndex >= 0) {
          // Logic for removing a dot and its connected lines
          const filteredLineDetails = lineDetails.filter(
            (detail) =>
              !(
                detail.line[0].x === dots[existingIndex].x &&
                detail.line[0].y === dots[existingIndex].y
              ) &&
              !(
                detail.line[1].x === dots[existingIndex].x &&
                detail.line[1].y === dots[existingIndex].y
              )
          );
          setLineDetails(filteredLineDetails);
          setDots(dots.filter((_, index) => index !== existingIndex));
        } else {
          setDots([...dots, { x, y }]);
        }
      } else if (drawLineActive) {
        const clickedDotIndex = dots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );

        if (clickedDotIndex >= 0 && selectedDots.length < 2) {
          const newSelectedDot = dots[clickedDotIndex];
          if (
            !selectedDots.some(
              (dot) => dot.x === newSelectedDot.x && dot.y === newSelectedDot.y
            )
          ) {
            const newSelectedDots = [...selectedDots, newSelectedDot];
            console.log(newSelectedDots);
            if (newSelectedDots.length === 2) {
              setLineDetails([
                ...lineDetails,
                { line: newSelectedDots, color: generateRandomColor() },
              ]);
              setSelectedDots([]);
            } else {
              setSelectedDots(newSelectedDots);
            }
          }
        }
      } else if (deletingLine) {
        const highlightedLine = lineDetails.findIndex((line) =>
          isPointOnLine(line.line, [x, y])
        );

        if (highlightedLine >= 0) {
          const newLines = [...lineDetails];
          newLines.splice(highlightedLine, 1);
          setLineDetails(newLines);
          setHoverOverLineIndex(null);
          return;
        }
      }
    },
    onHover: (e) => {
      if (!deletingLine) {
        return;
      }
      const canvasPosition = e.chart.canvas.getBoundingClientRect();
      const x = Math.round(
        e.chart.scales.x.getValueForPixel(e.native.x - canvasPosition.x)
      );
      const y = Math.round(
        e.chart.scales.y.getValueForPixel(e.native.y - canvasPosition.y)
      );
      for (let i = 0; i < lineDetails.length; i++) {
        const line = lineDetails[i];
        if (isPointOnLine(line.line, [x, y])) {
          return setHoverOverLineIndex(i);
        }
      }
      setHoverOverLineIndex(null);
    },
    maintainAspectRatio: true,
    aspectRatio: 1,
  };
  const chartRef = useRef(null);

  useEffect(() => {
    setChartRef(chartRef);
    console.log(chartRef.current);
    return () => {
      setChartRef(null);
    };
  }, [setChartRef]);
  // Blinking effect logic
  useEffect(() => {
    let blinkInterval;
    if (drawLineActive || isExpectingCords) {
      blinkInterval = setInterval(() => {
        setBlinkColor((prevColor) =>
          prevColor === "yellow" ? "black" : "yellow"
        );
      }, 500); // Adjust the interval as needed
    }

    return () => clearInterval(blinkInterval); // Cleanup on unmount or when drawLineActive changes
  }, [drawLineActive, isExpectingCords]);
  const axisLinePlugin = {
    id: "drawAxisLines",
    afterDraw: (chart, args, options) => {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
        scales: { x, y },
      } = chart;
      ctx.save();

      // Set styles for the axis lines
      ctx.strokeStyle = options.axisLineColor || "rgba(0, 0, 0, 0.8)"; // Default to black
      ctx.lineWidth = options.axisLineWidth || 2; // Default line width

      // Draw X-axis line
      ctx.beginPath();
      ctx.moveTo(left, y.getPixelForValue(0));
      ctx.lineTo(right, y.getPixelForValue(0));
      ctx.stroke();

      // Draw Y-axis line
      ctx.beginPath();
      ctx.moveTo(x.getPixelForValue(0), top);
      ctx.lineTo(x.getPixelForValue(0), bottom);
      ctx.stroke();

      ctx.restore();
    },
  };
  // Define plugin options, if you want to customize the axis lines appearance
  const pluginOptions = {
    axisLineColor: "#000000", // Color of the axis lines
    axisLineWidth: 2, // Width of the axis lines
  };

  const axisLabelPlugin = {
    id: "adjustZeroLabel",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      const xAxis = chart.scales.x;
      const zeroLabelYPosition = yAxis.getPixelForValue(0);
      const zeroLabelXPosition = xAxis.getPixelForValue(0);

      // Set the text properties
      ctx.fillStyle = "black"; // label color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Adjust the y-position for the "0" label
      const newYPosition = zeroLabelYPosition - 9;
      const newXPosition = zeroLabelXPosition - 13;

      // Draw the new "0" label
      ctx.fillText("0", newXPosition, newYPosition);
      ctx.restore();
    },
  };
  const yTickAdjusterPlugin = {
    id: "yTickAdjuster",
    beforeDraw: (chart) => {
      const yScale = chart.scales.y;
      const xScale = chart.scales.x;
      const ctx = chart.ctx;
      const tickFont = yScale.options.ticks.font.family;
      console.log(tickFont);
      ctx.save();
      ctx.font = tickFont;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      yScale.ticks.forEach((tick, index) => {
        if (tick.value === 0) {
          // Skip the 0 tick since it's already drawn or to avoid duplication
          return;
        }

        // Calculate the y coordinate of the tick label
        const y = yScale.getPixelForTick(index);

        // Adjust the x coordinate to position it manually (5 pixels from y-axis)
        const x = xScale.getPixelForValue(0) - 10;

        // Set the style for the tick label
        ctx.fillStyle = yScale.options.ticks.color || "black";

        // Render the tick label manually
        ctx.fillText(tick.value, x, y);
      });

      ctx.restore();
    },
  };
  const xTickAdjusterPlugin = {
    id: "xTickAdjuster",
    beforeDraw: (chart) => {
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      const ctx = chart.ctx;
      const tickFontSize =
        xScale.options.ticks.font.size || Chart.defaults.font.size;
      const tickFontFamily =
        xScale.options.ticks.font.family || Chart.defaults.font.family;
      const tickFontStyle =
        xScale.options.ticks.font.style || Chart.defaults.font.style;
      const tickFont = `${tickFontStyle} ${tickFontSize}px ${tickFontFamily}`;

      ctx.save();
      ctx.font = tickFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "top"; // Adjust based on where you want the tick label to appear relative to the tick line

      xScale.ticks.forEach((tick, index) => {
        // Skip rendering for the '0' tick label if needed
        if (tick.value === 0) {
          return;
        }

        // Calculate the x coordinate of the tick label
        const x = xScale.getPixelForTick(index);

        // Adjust the y coordinate to position it manually (5 pixels below the x-axis)
        const y = yScale.getPixelForValue(0) + 10;

        // Set the style for the tick label
        ctx.fillStyle = xScale.options.ticks.color || "black";

        // Render the tick label manually
        ctx.fillText(tick.value, x, y); // use tick.label to render the formatted label
      });

      ctx.restore();
    },
  };

  return (
    <div className={styles.lineGraph}>
      <Scatter
        ref={chartRef}
        data={data}
        options={options}
        plugins={[
          yTickAdjusterPlugin,
          xTickAdjusterPlugin,
          { ...axisLinePlugin, ...pluginOptions },
          axisLabelPlugin,
        ]}
      />
    </div>
  );
};

export default Graph;
