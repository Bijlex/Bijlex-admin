import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/tables/TableExercise.module.css";
import Table from "../../../components/general/Table.jsx";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { checkIcon, documentIcon } from "../../../constants/icons.jsx";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext.jsx";
// Define the number of columns

function CreateTableExercise({ setCustomData }) {
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();

  const [tableData, setTableData] = useState(Array(7).fill({ x: "", y: "" }));
  const [displayAxis, setDisplayAxis] = useState(["x", "y"]);
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [tableStyle, setTableStyle] = useState("basicTable");
  const [prompt, setPrompt] = useState("Please fill in the missing data");

  const prevDisplayAxisRef = useRef(displayAxis);

  const handleInputChange = (axis, index, value) => {
    const newData = tableData.map((item, i) =>
      i === index ? { ...item, [axis]: value } : item
    );
    console.log(newData);
    setTableData(newData);
    console.log(`Updating ${axis}[${index}] to ${value}`);
  };
  const addExercise = async (hiddenIndices, tableData) => {
    const customStyle = {};
    const customData = {
      hiddenIndices,
      tableData,
      displayAxis,
      tableStyle,
      prompt,
      customStyle,
    };
    setCustomData(customData);
  };

  const handleMakeExercise = async () => {
    const min = 3;
    const max = tableData.length * 2 - 2; // Ensure that data.length is more than 2 to avoid negative values.
    const totalClearCount = Math.floor(Math.random() * (max - min + 1)) + min;
    let clearedIndices = new Set();

    // Ensure unique indices are selected until the desired totalClearCount is met
    while (clearedIndices.size < totalClearCount) {
      // Randomly decide to clear from x or y
      const axis = Math.random() < 0.5 ? displayAxis[0] : displayAxis[1];
      const index = Math.floor(Math.random() * tableData.length);

      // Construct a unique identifier for the index and axis to avoid duplicates
      clearedIndices.add(`${axis}-${index}`);
    }

    // Adjust data to reflect cleared inputs for both x and y
    let newArray = structuredClone(tableData);

    let newClearedIndex = [];
    let newData = [...tableData];
    clearedIndices.forEach((clearedIndex) => {
      const [axis, index] = clearedIndex.split("-");
      let valueCopy = newArray[Number(index)][axis];
      let thingToPush = { axis, index, number: valueCopy };
      newData[Number(index)][axis] = ""; // Clear the value
      newClearedIndex.push(thingToPush);
    });
    setHiddenIndices(newClearedIndex);
    setTableData(newData);
    addExercise(newClearedIndex, newData);
  };
  useEffect(() => {
    const prevDisplayAxis = prevDisplayAxisRef.current;
    // Assuming displayAxis and prevDisplayAxis always contain 2 items
    if (
      displayAxis[0] !== prevDisplayAxis[0] ||
      displayAxis[1] !== prevDisplayAxis[1]
    ) {
      console.log(
        `Axis changed from [${prevDisplayAxis.join(
          ", "
        )}] to [${displayAxis.join(", ")}]`
      );

      const updatedTableData = tableData.map((item) => {
        const newItem = { ...item };
        // For each axis in displayAxis, copy data from the corresponding prevDisplayAxis
        for (let i = 0; i < displayAxis.length; i++) {
          const newAxis = displayAxis[i];
          const oldAxis = prevDisplayAxis[i];

          if (newAxis !== oldAxis) {
            newItem[newAxis] = item[oldAxis]; // Copy data from old to new axis
            delete newItem[oldAxis]; // Remove data associated with the old axis
          }
        }
        return newItem;
      });

      setTableData(updatedTableData); // Update tableData with the modifications
    }

    // Update the ref with the new displayAxis after processing
    prevDisplayAxisRef.current = displayAxis;
  }, [displayAxis]);
  return (
    <div className={styles.exerciseTable}>
      <label htmlFor="">Question Prompt</label>
      <input
        id="prompt_input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        type="text"
      />
      <Table
        data={tableData}
        setData={setTableData}
        handleInputChange={handleInputChange}
        hiddenIndices={hiddenIndices}
        displayAxis={displayAxis}
        tableStyle={tableStyle}
        setDisplayAxis={setDisplayAxis}
        editAxis={true}
      />

      <SvgBtn
        handleClick={handleMakeExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
      />
      <SvgBtn
        handleClick={() => setTableStyle("tableWithFilledBackground")}
        SvgIcon={documentIcon}
        text={"Change Style"}
      />
    </div>
  );
}

export default CreateTableExercise;
