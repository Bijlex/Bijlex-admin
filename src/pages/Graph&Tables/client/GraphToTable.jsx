import React, { useEffect, useState } from "react";
import styles from "../../../styles/graph/GraphToTable.module.css";
import Table from "../../../components/general/Table.jsx";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { checkIcon, documentIcon } from "../../../constants/icons.jsx";
import { useMessage } from "../../../contexts/MessageContext.jsx";
import Graph from "../../../components/general/Graph.jsx";
// Define the number of columns

function GraphToTable({ customData }) {
  const { addFullscreenConfirmationDialog } = useMessage();

  const [tablesData, setTablesData] = useState([]);
  const [correctData, setCorrectData] = useState([]);
  const [chartRef, setChartRef] = useState(null);
  const handleInputChange = (lineIndex, axis, index, value) => {
    // First, find the table data that corresponds to the lineIndex
    const updatedTablesData = tablesData.map((table) => {
      // Check if it's the table we want to update
      if (table.lineIndex - 1 === lineIndex) {
        // Update the specific row in the table
        const updatedData = table.data.map((item, i) =>
          i === index ? { ...item, [axis]: value } : item
        );
        return { ...table, data: updatedData };
      }
      // For all other tables, return them as they are
      return table;
    });

    setTablesData(updatedTablesData); // Set the updated tables data
    console.log(`Updating Line ${lineIndex}, ${axis}[${index}] to ${value}`);
  };
  const handleCheck = () => {
    let isCorrect = true;

    correctData.forEach((correctTable) => {
      const tableToCheck = tablesData.find(
        (table) => table.lineIndex === correctTable.lineIndex
      );

      if (tableToCheck && tableToCheck.data) {
        correctTable.data.forEach((correctDataItem, index) => {
          // Ensure the table data is accessible and has the right index
          if (tableToCheck.data.length > index) {
            const dataItemToCheck = tableToCheck.data[index];
            // Convert values to numbers and compare
            if (
              Number(dataItemToCheck.x) !== Number(correctDataItem.x) ||
              Number(dataItemToCheck.y) !== Number(correctDataItem.y)
            ) {
              isCorrect = false;
            }
          } else {
            isCorrect = false; // If the data item index doesn't exist, mark as incorrect
          }
        });
      } else {
        // If no matching lineIndex is found in tablesData, or table data is undefined, the data is incorrect
        isCorrect = false;
      }
    });

    const dialogMessage = isCorrect ? "You are correct" : "You are incorrect";
    const buttonLabel = isCorrect ? "Ok" : "Try Again";

    addFullscreenConfirmationDialog(dialogMessage, buttonLabel);
  };

  useEffect(() => {
    console.log(customData?.tablesData);
    const clearedTable = customData?.tablesData.map((table) => ({
      ...table,
      data: table.data.map((entry) => ({
        ...entry,
        y: "", // Set to 0 or any other value you prefer
      })),
    }));

    setTablesData(clearedTable);
    setCorrectData(customData?.tablesData);
  }, [customData]);
  const disableEdit = (lineIndex, axis, index) => {
    console.log(lineIndex);
    const xAxis = tablesData[lineIndex].axisNames[0];
    if (axis == xAxis) return true;
    return false;
  };
  return (
    <div className={styles.graphToTable}>
      <div className={styles.graphBox}>
        <Graph
          dots={customData?.dots}
          lineDetails={customData?.lineDetails}
          setChartRef={setChartRef}
        />
        <div className={styles.centerContent}>
          {tablesData.length > 0
            ? tablesData.map((table, lineIndex) => {
                console.log(table.axisNames);
                return (
                  <>
                    <h2>Table For Line : {lineIndex + 1}</h2>
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
                      isDisabled={(axis, index) =>
                        disableEdit(lineIndex, axis, index)
                      }
                      styles={styles}
                      showBtns={false}
                      editAxis={false}
                    />
                  </>
                );
              })
            : null}
          <div className={styles.flexCenter}>
            {/* <div className={styles.legendBox}>
            <LineLegend lineDetails={lineDetails} />
          </div> */}

            <div className={styles.arrowBox}>
              <SvgBtn
                handleClick={handleCheck}
                SvgIcon={checkIcon}
                text={"Check Exercise"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphToTable;
