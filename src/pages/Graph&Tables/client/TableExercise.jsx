import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "../../../styles/tables/TableExercise.module.css";
import Table from "../../../components/general/Table.jsx";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { checkIcon, documentIcon } from "../../../constants/icons.jsx";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext.jsx";
// Define the number of columns

function TableExercise({ customData, preview = false }) {
  const { addFullscreenConfirmationDialog } = useMessage();

  const [tableData, setTableData] = useState([]);

  const handleInputChange = (axis, index, value) => {
    const newData = tableData.map((item, i) =>
      i === index ? { ...item, [axis]: value } : item
    );
    setTableData(newData);
    console.log(`Updating ${axis}[${index}] to ${value}`);
  };

  const handleCheck = () => {
    let isCorrect = true;
    customData.hiddenIndices.forEach((item) => {
      if (item.number !== tableData[item.index][item.axis]) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      const successDialog = addFullscreenConfirmationDialog(
        "You are correct",
        "Ok"
      );
    } else {
      const successDialog = addFullscreenConfirmationDialog(
        "You are incorrect",
        "Try Again"
      );
    }
  };
  useEffect(() => {
    setTableData(customData?.tableData);
  }, [customData]);
  // Updated to disable inputs not in the hiddenIndices
  const disableEdit = (axis, index) => {
    const isEnabled = customData.hiddenIndices.some(
      (condition) => condition.axis == axis && condition.index == index
    );
    console.log(
      `Checking if editing should be disabled for ${axis}[${index}]: Not enabled is ${!isEnabled}`
    );
    return !isEnabled; // Invert the result
  };

  return (
    <div className={styles.exerciseTable}>
      <span className="prompt_text">{customData?.prompt}</span>
      <Table
        data={tableData}
        setData={setTableData}
        handleInputChange={handleInputChange}
        hiddenIndices={customData?.hiddenIndices || []}
        displayAxis={customData?.displayAxis || ["x", "y"]}
        tableStyle={customData?.tableStyle}
        showBtns={false}
        editAxis={false}
        isDisabled={(axis, index) => disableEdit(axis, index)}
      />

      {!preview && (
        <SvgBtn
          handleClick={handleCheck}
          SvgIcon={checkIcon}
          text={"Check Exercise"}
        />
      )}
    </div>
  );
}

export default TableExercise;
