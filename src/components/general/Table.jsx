import React from "react";
import styles from "../../styles/tables/TableStyles.module.css";
import { addIcon, removeIcon } from "../../constants/icons";
import SvgBtn from "./buttons/SvgBtn";
const Table = ({
  data,
  setData,
  handleInputChange,
  isDisabled = () => false,
  hiddenIndices = [],
  showBtns = true,
  displayAxis,
  setDisplayAxis,
  tableStyle = "tableWithFilledBackground",
  customStyles = {},
  fixedTH = false,
  editAxis = true,
  ...additionalProps
}) => {
  const addColumn = () => {
    setData([...data, { x: "", y: "" }]);
  };

  const removeColumn = () => {
    setData(data.slice(0, -1));
  };
  const disableStatus = isDisabled(additionalProps);
  return (
    <>
      {showBtns && (
        <div className={styles.columnModificationButtons}>
          <SvgBtn
            handleClick={addColumn}
            SvgIcon={addIcon}
            text={"Add Column"}
          />
          <SvgBtn
            handleClick={removeColumn}
            SvgIcon={removeIcon}
            text={"Remove Column"}
          />
        </div>
      )}
      <table className={styles[tableStyle]} style={customStyles?.table}>
        <tbody style={customStyles?.table}>
          {displayAxis.map((axis, index) => (
            <tr key={axis}>
              <td>
                {!editAxis ? (
                  <td
                    className={styles.axisStyle}
                    key={index}
                    style={customStyles?.th}
                  >
                    {axis}
                  </td>
                ) : (
                  <input
                    className={styles.axisStyleInput}
                    type="text"
                    value={axis}
                    onChange={(e) => {
                      setDisplayAxis((prev) => {
                        // Create a copy of the previous state
                        const newState = [...prev];
                        // Update the value at the specific index
                        newState[index] = e.target.value;
                        // Return the new state
                        return newState;
                      });
                    }}
                    style={customStyles?.th}
                  />
                )}
              </td>
              {Array.isArray(data) &&
                data.map((item, index) =>
                  fixedTH && axis === "x" ? (
                    <td
                      style={customStyles?.td}
                      key={`${axis}-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                    >
                      {item[axis]}
                    </td>
                  ) : (
                    <td
                      style={customStyles?.td}
                      key={`${axis}-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                    >
                      <input
                        type="text"
                        value={item[axis]}
                        onChange={(e) =>
                          handleInputChange(axis, index, e.target.value)
                        }
                        {...additionalProps}
                        disabled={disableStatus}
                        style={customStyles?.tdInput}
                      />
                    </td>
                  )
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
