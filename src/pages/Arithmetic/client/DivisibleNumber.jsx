import React , { useState } from "react";

const DivisibleNumber = ({customData}) => {
 const boxes = Array.from({length: 8 }, (_, index) => index + 2); // Updated range from 2 to 9
 const boxDivideNumber = customData.divisibleNumber; // Set the "box-divide" number here

 const [selectedBoxes, setSelectedBoxes] = useState([]);

 const handleBoxClick = (boxNumber) => {
 if (selectedBoxes.includes(boxNumber)){
 setSelectedBoxes(selectedBoxes.filter((selectedBox)=> selectedBox !== boxNumber));
 } else {
 setSelectedBoxes([...selectedBoxes, boxNumber]);
 }
 };

 const areAllSelectedDivisible = selectedBoxes.every((selectedBox)=> selectedBox % boxDivideNumber === 0);

 return (
    
 <div style={styles.container}>
    
<div style={styles.boxDivide}>
{boxDivideNumber}
 </div>

 <div style={styles.boxContainer}>
{boxes.map((boxNumber)=> (
 <div
 key={boxNumber}
 style={styles.box(selectedBoxes.includes(boxNumber))}
onClick={() => handleBoxClick(boxNumber)}
 >
    
 {boxNumber}
 </div>
 ))}
 </div>

 <button style={styles.button}onClick={() => alert(areAllSelectedDivisible ? `Correct! All selected boxes are divisible by ${boxDivideNumber}` : `Oops! Not all selected boxes are divisible by ${boxDivideNumber}`)}>
 Check Answer
 </button>
 </div>
 );
};

export default DivisibleNumber;

// CSS styles
const styles = {
 container: {
 display: "flex",
 flexDirection: "column", // Stack vertically
 alignItems: "center ",
 },
 boxDivide: {
 margin: 20, // Add some margin
 width: 50, // Set width
 height: 50, // Set height
 borderRadius: 5, // Add rounded corners
 backgroundColor: "lightblue", // Set background color
 fontSize: 24, // Increase font size
 display: "flex", // To center content
 alignItems: "center", // Center vertically
 justifyContent: "center", // Center horizontally
 },
 boxContainer: {
 display: "flex",
 flexWrap: "wrap", // Allow boxes to wrap
 justifyContent: "center ", // Center horizontally
 alignItems: "center", // Center vertically
 },
 box: (isSelected) => ({
 flex: 1, // Distribute boxes evenly
 width: `calc(20% - 5px)`, // Adjust width dynamically
 height: 50, // Fixed height
 backgroundColor: isSelected ? "grey" : "white", // Set background color
 display: "flex", // Center content
 alignItems: "center", // Center vertically
 justifyContent: "center", // Center horizontally
 fontWeight: "bold", // Make text bolder
 fontSize: 16, // Set font size
 border: "1px solid #ccc", // Add border
 marginRight: 5, // Gap between boxes
 marginBottom: 10, // Gap between rows
 cursor: "pointer",
 }),
 button: {
 marginTop: 20,
 padding: 10,
 backgroundColor: "lightblue",
 color: "white",
 border: "none",
 borderRadius: 5,
 cursor: "pointer",
 },
};
