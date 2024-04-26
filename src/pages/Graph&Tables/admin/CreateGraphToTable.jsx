import React, { useState } from "react";
import "chart.js/auto";
import "chartjs-plugin-datalabels";
import styles from "../../../styles/graph/GraphToTable.module.css";
import { useEffect } from "react";
import { generateTableDataForLine } from "../../../utlis/calculation";
import Graph from "../../../components/general/Graph";
import Table from "../../../components/general/Table";
import SvgBtn from "../../../components/general/buttons/SvgBtn";
import {
  checkIcon,
  drawLineIcon,
  placeDotsIcon,
  tableIcon,
} from "../../../constants/icons";
import { useMessage } from "../../../contexts/MessageContext";
import axios from "axios";

function CreateGraphToTable() {
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const [dots, setDots] = useState([]);
  const [lineDetails, setLineDetails] = useState([]);
  const [placeDotsActive, setPlaceDotsActive] = useState(false);
  const [drawLineActive, setDrawLineActive] = useState(false);
  const [selectedDotsForLine, setSelectedDotsForLine] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [chartRef, setChartRef] = useState(null);
  const [hoverOverLineIndex, setHoverOverLineIndex] = useState(null);
  const [deletingLine, setDeletingLine] = useState(false);
  // Handle user input in exercise mode testetsest
  // Handle user input for multiple tables
  const handleInputChange = (lineIndex, axis, index, value) => {
    // First, find the table data that corresponds to the lineIndex
    const updatedTablesData = tablesData.map((table) => {
      // Check if it's the table we want to update
      if (table.lineIndex - 1 === lineIndex) {
        // Update the specific row in the table
        const updatedData = table.data.map((item, i) =>
          i === index ? { ...item, [axis]: value } : item
        );
        // Return the updated table
        if (value.trim() !== "" && !/^[\s-_]*$/.test(value)) {
          setUserAnswers({ ...table, data: updatedData });
        }
        return { ...table, data: updatedData };
      }
      // For all other tables, return them as they are
      return table;
    });

    setTablesData(updatedTablesData); // Set the updated tables data
    console.log(`Updating Line ${lineIndex}, ${axis}[${index}] to ${value}`);
  };

  // useEffect(() => {
  //   const hideDots = () => {
  //     const chart = chartRef.current;
  //     if (!chart) return;

  //     // Assuming the dots dataset is the first dataset (index 0)
  //     const datasetIndex = 0;
  //     chart.getDatasetMeta(datasetIndex).hidden = true; // Toggle visibility
  //     chart.update(); // Step 3: Update the chart
  //   };
  //   const displayDots = () => {
  //     const chart = chartRef.current;
  //     console.log(chart);
  //     if (!chart) return;
  //     console.log("hiding");

  //     // Assuming the dots dataset is the first dataset (index 0)
  //     const datasetIndex = 0;
  //     chart.getDatasetMeta(datasetIndex).hidden = false; // Toggle visibility
  //     chart.update(); // Step 3: Update the chart
  //   };
  //   if (chartRef)
  //     if (exerciseMode) hideDots();
  //     else displayDots();
  // }, [chartRef, exerciseMode]);

  // Function to handle "Make Tables" button click
  const handleMakeTables = () => {
    const newTablesData = lineDetails.map((details, index) => {
      const tableData = generateTableDataForLine(details.line, -10, 10);
      return {
        lineIndex: index + 1,
        data: tableData,
        axisNames: ["x", "y"], // Default axis names for each table
      };
    });

    console.log("New tables data:", newTablesData);
    setTablesData(newTablesData);
  };

  const createExercise = async () => {
    const formData = new FormData();
    const loadingDialogId = addDialog({
      type: "loading",
      message: "Creating your exercise",
    });
    formData.append("chapter", "Chapter 2");
    formData.append("difficulty", 1);
    formData.append("prompt", "Please complete the table using the graph");
    formData.append("category", "graph-tables");
    formData.append("exerciseType", "graph-to-table");
    const customStyle = {};
    const customData = {
      dots,
      tablesData,
      lineDetails,
      customStyle,
    };
    console.log(customData);
    formData.append("customData", JSON.stringify(customData));

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

  const togglePlaceDots = () => {
    setPlaceDotsActive(!placeDotsActive);
    setDrawLineActive(false);
    setSelectedDotsForLine([]);
    console.log(selectedDotsForLine);
  };

  const toggleDrawLine = () => {
    setDrawLineActive(!drawLineActive);
    setPlaceDotsActive(false);
    setSelectedDotsForLine([]);
  };
  const updateAxisNames = (lineIndex, newAxisNames) => {
    const updatedTablesData = tablesData.map((table, index) =>
      index === lineIndex ? { ...table, axisNames: newAxisNames } : table
    );
    setTablesData(updatedTablesData);
  };
  return (
    <div className={styles.graphToTable}>
      <div className={styles.graphBox}>
        <Graph
          placeDotsActive={placeDotsActive}
          drawLineActive={drawLineActive}
          dots={dots}
          setDots={setDots}
          selectedDots={selectedDotsForLine}
          setSelectedDots={setSelectedDotsForLine}
          lineDetails={lineDetails}
          setLineDetails={setLineDetails}
          setChartRef={setChartRef}
          hoverOverLineIndex={hoverOverLineIndex}
          setHoverOverLineIndex={setHoverOverLineIndex}
          setDeletingLine={setDeletingLine}
          deletingLine={deletingLine}
        />
        <div className={styles.centerContent}>
          {tablesData.length > 0
            ? tablesData.map((table, lineIndex) => {
                console.log(table);
                return (
                  <Table
                    key={lineIndex}
                    data={table.data}
                    setData={(newData) => {
                      // Update only the specific table data within the tablesData state
                      const updatedTablesData = tablesData.map((t, idx) =>
                        idx === lineIndex ? { ...t, data: newData } : t
                      );
                      setTablesData(updatedTablesData);
                    }}
                    handleInputChange={(axis, index, value) =>
                      handleInputChange(lineIndex, axis, index, value)
                    }
                    displayAxis={table.axisNames}
                    setDisplayAxis={(newAxisNames) =>
                      updateAxisNames(index, newAxisNames)
                    }
                    styles={styles}
                  />
                );
              })
            : null}
          <div className={styles.flexCenter}>
            {/* <div className={styles.legendBox}>
            <LineLegend lineDetails={lineDetails} />
          </div> */}

            <div className={styles.arrowBox}>
              <SvgBtn
                SvgIcon={placeDotsIcon}
                text={placeDotsActive ? "Placing Dots..." : "Place Dots"}
                handleClick={togglePlaceDots}
              />
              <SvgBtn
                SvgIcon={drawLineIcon}
                text={drawLineActive ? "Drawing Line..." : "Draw Line"}
                handleClick={toggleDrawLine}
                customStyles={{
                  backgroundColor: `${dots.length < 1 ? "grey" : ""}`,
                  marginTop: "10px",
                }}
              />
            </div>
            <div className={styles.arrowBox}>
              <SvgBtn
                SvgIcon={tableIcon}
                handleClick={handleMakeTables}
                text="Make Tables"
                customStyles={{
                  backgroundColor: `${lineDetails.length < 1 ? "grey" : ""}`,
                }}
              />
              <SvgBtn
                SvgIcon={checkIcon}
                handleClick={createExercise}
                text="Create Exercise"
                customStyles={{
                  backgroundColor: `${tablesData.length < 1 ? "grey" : ""}`,
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGraphToTable;
