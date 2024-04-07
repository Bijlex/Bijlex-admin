import React from "react";
import styles from "../../../styles/buttons.module.css";
/**
 * Represents a button component that incorporates an SVG icon and text.
 * This button component allows for custom click handling and can utilize custom SVG icons
 * through the `SvgIcon` prop, enabling the use of a variety of icons as needed.
 *
 * @component
 * @param {Object} props - The props object for the SvgBtn component.
 * @param {function} props.handleClick - The function to be called when the button is clicked.
 * @param {function} props.SvgIcon - A React component that returns an SVG. It gets rendered inside the button to serve as the button's icon.
 * @param {string} props.text - The text to be displayed alongside the icon inside the button.
 * @param {Object} [props.customStyles={}] - An optional object containing custom CSS styles which will be applied to the button. This allows for inline styling to customize its appearance further.
 *
 * @example
 * // Example usage of SvgBtn with an icon and click handler
 * <SvgBtn
 *   handleClick={() => console.log("Button clicked")}
 *   SvgIcon={() => (<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />)}
 *   text="Add Item"
 *   customStyles={{ backgroundColor: 'blue', color: 'white' }}
 * />
 *
 * @returns {React.ReactElement} The SvgBtn component as a React element.
 */
const SvgBtn = ({ handleClick, SvgIcon, text, customStyles = {} }) => {
  return (
    <button
      className={(styles.addButton, styles.primary_btn)}
      onClick={handleClick}
      style={customStyles}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.btnIcon}
      >
        <SvgIcon />
      </svg>
      {text}
    </button>
  );
};

export default SvgBtn;
