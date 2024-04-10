import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "../../../styles/tables/TableExercise.module.css";
import Table from "../../../components/general/Table.jsx";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { checkIcon, documentIcon } from "../../../constants/icons.jsx";
import axios from "axios";
import { useMessage } from "../../../contexts/MessageContext.jsx";
// Define the number of columns

function TableExercise() {
  const { addDialog, removeDialog, addFullscreenConfirmationDialog } =
    useMessage();
  const { id: exerciseID } = useParams();
  const [fetchData, setFetchData] = useState([]);
  const [tableData, setTableData] = useState(Array(7).fill({ x: "", y: "" }));
  const [correct, setCorrect] = useState(true);

  const handleInputChange = (axis, index, value) => {
    const newData = tableData.map((item, i) =>
      i === index ? { ...item, [axis]: value } : item
    );
    setTableData(newData);
    console.log(`Updating ${axis}[${index}] to ${value}`);
  };

  const handleCheck = () => {
    let isCorrect = true;
    fetchData.customData.hiddenIndices.forEach((item) => {
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

  const confirmAnswer = () => {};

  const tryAgain = () => {};

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "https://bijlex-backend.onrender.com/exercises/" + exerciseID
        );
        console.log(response.data);
        if (response.status === 200) {
          const customData =
            typeof response.data.customData === "string"
              ? JSON.parse(response.data.customData)
              : response.data.customData;

          // Update your state with the parsed customData
          setFetchData({ ...response.data, customData: customData });

          // Assuming customData contains 'tableData' and needs to be parsed as well
          setTableData(customData.tableData);
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, []); // Fetch exercises once on component mount
  return (
    <div className={styles.exerciseTable}>
      <Table
        data={tableData}
        setData={setTableData}
        handleInputChange={handleInputChange}
        hiddenIndices={fetchData.customData?.hiddenIndices || []}
        displayAxis={fetchData.customData?.displayAxis || ["x", "y"]}
        tableStyle={fetchData.customData?.tableStyle}
        showBtns={false}
        editAxis={false}
      />

      <SvgBtn
        handleClick={handleCheck}
        SvgIcon={checkIcon}
        text={"Check Exercise"}
      />
    </div>
  );
}

export default TableExercise;
